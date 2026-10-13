import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/src/lib/requireAdmin";
import { withTransaction } from "@/src/lib/db";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ id: string }>;
};

type PaymentStatus = "Pending" | "Paid" | "Refunded";

export async function PATCH(
  request: NextRequest,
  context: RouteContext
) {
  const auth = await requireAdmin();

  if (!auth.ok) {
    return auth.response;
  }

  try {
    const { id } = await context.params;
    const orderId = Number(id);

    if (!Number.isSafeInteger(orderId) || orderId <= 0) {
      return NextResponse.json(
        { error: "Invalid order ID." },
        { status: 400 }
      );
    }

    const body = await request.json().catch(() => null);

    const status: PaymentStatus = body?.status;
    const method =
      typeof body?.method === "string" ? body.method.trim() : "";
    const transactionReference =
      typeof body?.transactionReference === "string"
        ? body.transactionReference.trim()
        : "";
    const notes =
      typeof body?.notes === "string" ? body.notes.trim() : "";

    const refundReference =
      typeof body?.refundReference === "string"
        ? body.refundReference.trim()
        : "";

    if (!["Paid", "Refunded"].includes(status)) {
      return NextResponse.json(
        { error: "Status must be Paid or Refunded." },
        { status: 400 }
      );
    }

    if (
      method.length > 30 ||
      transactionReference.length > 200 ||
      refundReference.length > 200 ||
      notes.length > 2000
    ) {
      return NextResponse.json(
        { error: "Payment details exceed allowed lengths." },
        { status: 400 }
      );
    }

    const result = await withTransaction(async (client) => {
      const lookup = await client.query<{
        id: string;
        status: string;
        total_amount: string;
        payment_status: string;
      }>(
        `SELECT
           o.id,
           o.status,
           o.total_amount,
           p.status AS payment_status
         FROM public.orders o
         JOIN public.order_payments p ON p.order_id = o.id
         WHERE o.id = $1
         FOR UPDATE OF o, p`,
        [orderId]
      );

      if (!lookup.rows.length) {
        return { outcome: "not_found" as const };
      }

      const order = lookup.rows[0];

      if (
        (status === "Paid" &&
          (order.payment_status !== "Pending" ||
            !["Confirmed", "Packed", "Shipped", "Delivered"].includes(order.status))) ||
        (status === "Refunded" && order.payment_status !== "Paid")
      ) {
        return {
          outcome: "conflict" as const,
          paymentStatus: order.payment_status,
        };
      }

      if (status === "Refunded" && !refundReference) {
        return { outcome: "missing_refund_reference" as const };
      }

      if (status === "Paid" && !method) {
        return { outcome: "missing_method" as const };
      }

      if (status === "Paid" && !transactionReference) {
        return { outcome: "missing_reference" as const };
      }

      await client.query(
        `UPDATE public.order_payments
         SET
           status = $1,
           method = CASE WHEN $1::varchar = 'Paid' THEN $2 ELSE method END,
           verified_amount = CASE WHEN $1::varchar = 'Paid' THEN $3 ELSE verified_amount END,
           transaction_reference = CASE WHEN $1::varchar = 'Paid' THEN $4 ELSE transaction_reference END,
           verified_at = CASE WHEN $1::varchar = 'Paid' THEN NOW() ELSE verified_at END,
           verified_by = CASE WHEN $1::varchar = 'Paid' THEN $5 ELSE verified_by END,
           admin_notes = $6,
           refunded_at = CASE
             WHEN $1::varchar = 'Refunded' THEN NOW()
             ELSE refunded_at
           END,
           refunded_by = CASE
             WHEN $1::varchar = 'Refunded' THEN $5
             ELSE refunded_by
           END,
           refund_reference = CASE
             WHEN $1::varchar = 'Refunded' THEN $8
             ELSE refund_reference
           END,
           updated_at = NOW()
         WHERE order_id = $7`,
        [
          status,
          method || null,
          order.total_amount,
          transactionReference || null,
          auth.session?.user?.name || "admin",
          notes || null,
          orderId,
          refundReference || null,
        ]
      );

      return {
        outcome: "updated" as const,
        status,
      };
    });

    if (result.outcome === "not_found") {
      return NextResponse.json(
        { error: "Order or payment record not found." },
        { status: 404 }
      );
    }

    if (result.outcome === "conflict") {
      return NextResponse.json(
        {
          error: "Payment status transition is not allowed.",
          currentStatus: result.paymentStatus,
        },
        { status: 409 }
      );
    }

    if (result.outcome === "missing_refund_reference") {
      return NextResponse.json(
        { error: "Refund reference is required." },
        { status: 400 }
      );
    }

    if (result.outcome === "missing_method" || result.outcome === "missing_reference") {
      return NextResponse.json(
        {
          error:
            result.outcome === "missing_method"
              ? "Payment method is required."
              : "Transaction reference is required.",
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      paymentStatus: result.status,
    });
  } catch (error) {
    console.error("Payment update failed:", error);

    return NextResponse.json(
      { error: "Unable to update payment." },
      { status: 500 }
    );
  }
}
