import { NextResponse } from "next/server";
import { withTransaction } from "@/src/lib/db";
import { getDiwaliDiscount } from "@/src/lib/diwaliOffer";
import { validateOrderInput, OrderValidationError, type OrderRequest } from "@/src/lib/validateOrderInput";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body: OrderRequest = await request.json();

    const {
      submissionKey, customerName, customerMobile, customerEmail,
      deliveryAddress, deliveryCity, deliveryState,
      deliveryPincode, quantities,
    } = validateOrderInput(body);

    const order = await withTransaction(async (client) => {
      // Serialize requests with the same submission key, including concurrent retries.
      await client.query(
        "SELECT pg_advisory_xact_lock(hashtextextended($1, 0))",
        [submissionKey]
      );

      const existing = await client.query<{
        order_reference: string;
        total_amount: string;
      }>(
        `SELECT order_reference, total_amount
         FROM public.orders WHERE submission_key = $1`,
        [submissionKey]
      );

      if (existing.rows.length) {
        return {
          orderReference: existing.rows[0].order_reference,
          totalAmount: Number(existing.rows[0].total_amount),
          existing: true,
        };
      }

      const ids = [...quantities.keys()];

      const products = await client.query<{
        id: number;
        name: string;
        price: string;
        stock_quantity: number | null;
      }>(
        `SELECT id, name, price, stock_quantity
         FROM public.products
         WHERE id = ANY($1::bigint[]) AND is_visible = TRUE
         ORDER BY id
         FOR UPDATE`,
        [ids]
      );

      if (products.rows.length !== ids.length) {
        throw new OrderValidationError("One or more products are unavailable.");
      }

      const items = products.rows.map((product) => {
        const unitPrice = Number(product.price);
        const quantity = quantities.get(Number(product.id))!;

        if (
          product.stock_quantity !== null &&
          quantity > product.stock_quantity
        ) {
          throw new OrderValidationError(
            `Insufficient stock for ${product.name}.`
          );
        }

        if (!Number.isSafeInteger(unitPrice * 100) || unitPrice < 0) {
          throw new OrderValidationError("Invalid product price.");
        }

        return {
          productId: Number(product.id),
          productName: product.name,
          unitPrice,
          quantity,
          lineTotal: unitPrice * quantity,
        };
      });

      const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);
      const shippingAmount = subtotal >= 2000 ? 0 : 100;
      const diwaliDiscount = getDiwaliDiscount(subtotal);
      const totalAmount = subtotal + shippingAmount - diwaliDiscount;

      const year = new Date().getUTCFullYear();

      const counter = await client.query<{ last_number: string }>(
        `INSERT INTO public.order_number_counters(order_year, last_number)
         VALUES ($1, 1)
         ON CONFLICT (order_year)
         DO UPDATE SET last_number = public.order_number_counters.last_number + 1
         RETURNING last_number`,
        [year]
      );

      const number = String(counter.rows[0].last_number).padStart(4, "0");
      const orderReference = `UC-${year}-${number}`;

      const inserted = await client.query<{ id: string }>(
        `INSERT INTO public.orders (
          order_reference, submission_key,
          customer_name, customer_mobile, customer_email,
          delivery_address, delivery_city, delivery_state, delivery_pincode,
          subtotal, shipping_amount, discount_amount, total_amount
        )
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
        RETURNING id`,
        [
          orderReference, submissionKey,
          customerName, customerMobile, customerEmail || null,
          deliveryAddress, deliveryCity, deliveryState, deliveryPincode,
          subtotal, shippingAmount, diwaliDiscount, totalAmount,
        ]
      );

      const orderId = inserted.rows[0].id;

      for (const item of items) {
        const product = products.rows.find(
          (row) => Number(row.id) === item.productId
        );

        const reservedQuantity =
          product?.stock_quantity == null ? 0 : item.quantity;

        await client.query(
          `INSERT INTO public.order_items
           (order_id, product_id, product_name, unit_price,
            quantity, line_total, stock_reserved_quantity)
           VALUES ($1,$2,$3,$4,$5,$6,$7)`,
          [
            orderId, item.productId, item.productName,
            item.unitPrice, item.quantity, item.lineTotal,
            reservedQuantity,
          ]
        );
      }

      // Deduct configured inventory inside the order transaction.
      // NULL stock means inventory tracking has not been configured.
      for (const item of items) {
        const stockUpdate = await client.query(
          `UPDATE public.products
           SET stock_quantity = stock_quantity - $1
           WHERE id = $2
             AND stock_quantity IS NOT NULL
             AND stock_quantity >= $1`,
          [item.quantity, item.productId]
        );

        const product = products.rows.find(
          (row) => Number(row.id) === item.productId
        );

        if (
          product?.stock_quantity !== null &&
          stockUpdate.rowCount !== 1
        ) {
          throw new OrderValidationError(
            `Unable to reserve stock for ${item.productName}.`
          );
        }
      }

      await client.query(
        `INSERT INTO public.order_payments(order_id) VALUES ($1)`,
        [orderId]
      );

      await client.query(
        `INSERT INTO public.order_shipments(order_id) VALUES ($1)`,
        [orderId]
      );

      await client.query(
        `INSERT INTO public.order_status_history
         (order_id, previous_status, new_status, changed_by, reason)
         VALUES ($1, NULL, 'Requested', 'system', 'Customer submitted order')`,
        [orderId]
      );

      return {
        orderReference,
        totalAmount,
        existing: false,
      };
    });

    return NextResponse.json(
      { success: true, order },
      { status: order.existing ? 200 : 201 }
    );
  } catch (error) {
    if (error instanceof OrderValidationError) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      );
    }

    console.error("Order creation failed:", error);

    return NextResponse.json(
      { success: false, error: "Unable to create order." },
      { status: 500 }
    );
  }
}
