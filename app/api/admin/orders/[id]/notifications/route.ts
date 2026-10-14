import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/src/lib/requireAdmin";
import { query } from "@/src/lib/db";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ id: string }>;
};

const notificationTypes = [
  "OrderConfirmed",
  "OrderRejected",
  "PaymentReceived",
  "OrderPacked",
  "OrderShipped",
  "OrderDelivered",
] as const;

export async function POST(
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
    const notificationType = body?.notificationType;

    const notes =
      typeof body?.notes === "string"
        ? body.notes.trim()
        : "";

    if (
      typeof notificationType !== "string" ||
      !notificationTypes.some((type) => type === notificationType)
    ) {
      return NextResponse.json(
        { error: "Invalid notification type." },
        { status: 400 }
      );
    }

    if (notes.length > 2000) {
      return NextResponse.json(
        { error: "Notes cannot exceed 2000 characters." },
        { status: 400 }
      );
    }

    const existingOrder = await query<{ id: string }>(
      `SELECT id
       FROM public.orders
       WHERE id = $1`,
      [orderId]
    );

    if (!existingOrder.rows.length) {
      return NextResponse.json(
        { error: "Order not found." },
        { status: 404 }
      );
    }

    const result = await query<{
      id: string;
      notification_type: string;
      channel: string;
      status: string;
      marked_sent_at: Date;
      marked_sent_by: string;
    }>(
      `INSERT INTO public.order_notifications (
        order_id,
        notification_type,
        channel,
        status,
        marked_sent_by,
        notes
      )
      VALUES ($1, $2, 'WhatsApp', 'Sent', $3, $4)
      RETURNING
        id,
        notification_type,
        channel,
        status,
        marked_sent_at,
        marked_sent_by`,
      [
        orderId,
        notificationType,
        auth.session?.user?.name || "admin",
        notes || null,
      ]
    );

    return NextResponse.json(
      {
        success: true,
        notification: result.rows[0],
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Notification tracking failed:", error);

    return NextResponse.json(
      { error: "Unable to record WhatsApp notification." },
      { status: 500 }
    );
  }
}

export async function GET(
  _request: NextRequest,
  context: RouteContext
) {
  const auth = await requireAdmin();

  if (!auth.ok) {
    return auth.response;
  }

  const { id } = await context.params;
  const orderId = Number(id);

  if (!Number.isSafeInteger(orderId) || orderId <= 0) {
    return NextResponse.json(
      { error: "Invalid order ID." },
      { status: 400 }
    );
  }

  try {
    const result = await query(
      `SELECT
        id,
        notification_type,
        channel,
        status,
        marked_sent_at,
        marked_sent_by,
        notes
       FROM public.order_notifications
       WHERE order_id = $1
       ORDER BY marked_sent_at DESC, id DESC`,
      [orderId]
    );

    return NextResponse.json({
      success: true,
      notifications: result.rows,
    });
  } catch (error) {
    console.error("Failed to load notifications:", error);

    return NextResponse.json(
      { error: "Unable to load notification history." },
      { status: 500 }
    );
  }
}
