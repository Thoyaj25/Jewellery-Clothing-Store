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
    const newStatus = body?.status;
    const reason =
      typeof body?.reason === "string"
        ? body.reason.trim()
        : "";

    const allowedTransitions: Record<string, string[]> = {
      Requested: ["Confirmed", "Rejected"],
      Confirmed: ["Packed"],
      Packed: ["Shipped"],
      Shipped: ["Delivered"],
    };

    const validStatuses = [
      "Confirmed",
      "Rejected",
      "Packed",
      "Shipped",
      "Delivered",
    ];

    if (!validStatuses.includes(newStatus)) {
      return NextResponse.json(
        { error: "Invalid order status." },
        { status: 400 }
      );
    }

    if (reason.length > 1000) {
      return NextResponse.json(
        { error: "Reason cannot exceed 1000 characters." },
        { status: 400 }
      );
    }

    const result = await withTransaction(async (client) => {
      const lookup = await client.query<{
        id: string;
        order_reference: string;
        status: string;
      }>(
        `SELECT id, order_reference, status
         FROM public.orders
         WHERE id = $1
         FOR UPDATE`,
        [orderId]
      );

      if (!lookup.rows.length) {
        return { outcome: "not_found" as const };
      }

      const order = lookup.rows[0];

      if (!allowedTransitions[order.status]?.includes(newStatus)) {
        return {
          outcome: "conflict" as const,
          currentStatus: order.status,
        };
      }

      await client.query(
        `UPDATE public.orders
         SET status = $1, updated_at = NOW()
         WHERE id = $2`,
        [newStatus, orderId]
      );

      await client.query(
        `INSERT INTO public.order_status_history
          (order_id, previous_status, new_status, changed_by, reason)
         VALUES ($1, $2, $3, $4, $5)`,
        [
          orderId,
          order.status,
          newStatus,
          auth.session?.user?.name || "admin",
          reason || null,
        ]
      );

      return {
        outcome: "updated" as const,
        orderReference: order.order_reference,
        status: newStatus,
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
        {
          error: "This status change is not allowed for the current order state.",
          currentStatus: result.currentStatus,
        },
        { status: 409 }
      );
    }

    return NextResponse.json({
      success: true,
      orderReference: result.orderReference,
      status: result.status,
    });
  } catch (error) {
    console.error("Order status update failed:", error);

    return NextResponse.json(
      { error: "Unable to update order status." },
      { status: 500 }
    );
  }
}
