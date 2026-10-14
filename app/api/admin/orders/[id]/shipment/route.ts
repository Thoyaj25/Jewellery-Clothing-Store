import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/src/lib/requireAdmin";
import { withTransaction } from "@/src/lib/db";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ id: string }>;
};

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

    const courierName =
      typeof body?.courierName === "string"
        ? body.courierName.trim()
        : "";

    const trackingNumber =
      typeof body?.trackingNumber === "string"
        ? body.trackingNumber.trim()
        : "";

    const expectedDeliveryDate =
      typeof body?.expectedDeliveryDate === "string"
        ? body.expectedDeliveryDate.trim()
        : "";

    const notes =
      typeof body?.notes === "string"
        ? body.notes.trim()
        : "";

    if (
      !courierName ||
      !trackingNumber ||
      courierName.length > 150 ||
      trackingNumber.length > 150 ||
      notes.length > 2000
    ) {
      return NextResponse.json(
        { error: "Valid courier and tracking details are required." },
        { status: 400 }
      );
    }

    if (expectedDeliveryDate) {
      const validFormat = /^\d{4}-\d{2}-\d{2}$/.test(expectedDeliveryDate);
      const parsed = new Date(`${expectedDeliveryDate}T00:00:00Z`);

      if (
        !validFormat ||
        !Number.isFinite(parsed.getTime()) ||
        parsed.toISOString().slice(0, 10) !== expectedDeliveryDate
      ) {
        return NextResponse.json(
          { error: "Expected delivery date must be a valid YYYY-MM-DD date." },
          { status: 400 }
        );
      }
    }

    const result = await withTransaction(async (client) => {
      const lookup = await client.query<{
        status: string;
      }>(
        `SELECT status
         FROM public.orders
         WHERE id = $1
         FOR UPDATE`,
        [orderId]
      );

      if (!lookup.rows.length) {
        return { outcome: "not_found" as const };
      }

      if (
        !["Confirmed", "Packed", "Shipped", "Delivered"].includes(
          lookup.rows[0].status
        )
      ) {
        return { outcome: "conflict" as const };
      }

      const shipment = await client.query<{
        courier_name: string;
        tracking_number: string;
        expected_delivery_date: string | null;
      }>(
        `INSERT INTO public.order_shipments (
           order_id,
           courier_name,
           tracking_number,
           expected_delivery_date,
           admin_notes
         )
         VALUES ($1, $2, $3, $4::date, $5)
         ON CONFLICT (order_id)
         DO UPDATE SET
           courier_name = EXCLUDED.courier_name,
           tracking_number = EXCLUDED.tracking_number,
           expected_delivery_date = EXCLUDED.expected_delivery_date,
           admin_notes = EXCLUDED.admin_notes,
           updated_at = NOW()
         RETURNING
           courier_name,
           tracking_number,
           expected_delivery_date`,
        [
          orderId,
          courierName,
          trackingNumber,
          expectedDeliveryDate || null,
          notes || null,
        ]
      );

      return {
        outcome: "updated" as const,
        shipment: shipment.rows[0],
      };
    });

    if (result.outcome === "not_found") {
      return NextResponse.json(
        { error: "Order not found." },
        { status: 404 }
      );
    }

    if (result.outcome === "conflict") {
      return NextResponse.json(
        { error: "Courier details cannot be added to this order status." },
        { status: 409 }
      );
    }

    return NextResponse.json({
      success: true,
      shipment: result.shipment,
    });
  } catch (error) {
    console.error("Shipment update failed:", error);

    return NextResponse.json(
      { error: "Unable to save courier details." },
      { status: 500 }
    );
  }
}
