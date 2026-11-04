import { NextResponse } from "next/server";
import { createHmac } from "node:crypto";
import { query } from "@/src/lib/db";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-vercel-forwarded-for")?.trim();
    const secret = process.env.NEXTAUTH_SECRET;

    if (!ip || !secret || ip.includes(",")) {
      return NextResponse.json(
        { error: "Order tracking is temporarily unavailable." },
        { status: 503 }
      );
    }

    const identifierHash = createHmac("sha256", secret)
      .update(`order-tracking:${ip}`)
      .digest("hex");

    const attempt = await query<{ attempt_count: number }>(
      `INSERT INTO public.order_tracking_rate_limits
         (identifier_hash, window_start, attempt_count)
       VALUES ($1, date_trunc('hour', NOW()), 1)
       ON CONFLICT (identifier_hash, window_start)
       DO UPDATE SET attempt_count =
         LEAST(order_tracking_rate_limits.attempt_count + 1, 6)
       RETURNING attempt_count`,
      [identifierHash]
    );

    if (attempt.rows[0].attempt_count > 5) {
      return NextResponse.json(
        { error: "Too many tracking attempts. Please try later." },
        {
          status: 429,
          headers: { "Retry-After": "3600" },
        }
      );
    }

    const body = await request.json();

    const orderReference =
      typeof body?.orderReference === "string"
        ? body.orderReference.trim().toUpperCase()
        : "";

    const mobile =
      typeof body?.mobile === "string"
        ? body.mobile.replace(/\D/g, "")
        : "";

    if (
      !/^UC-\d{4}-\d{4,}$/.test(orderReference) ||
      !/^\d{10,13}$/.test(mobile)
    ) {
      return NextResponse.json(
        { error: "Please provide a valid order reference and mobile number." },
        { status: 400 }
      );
    }

    const result = await query<{
      order_reference: string;
      status: string;
      payment_status: string;
      courier_name: string | null;
      tracking_number: string | null;
    }>(
      `SELECT
         o.order_reference,
         o.status,
         COALESCE(p.status, 'Pending') AS payment_status,
         s.courier_name,
         s.tracking_number
       FROM public.orders o
       LEFT JOIN public.order_payments p ON p.order_id = o.id
       LEFT JOIN public.order_shipments s ON s.order_id = o.id
       WHERE o.order_reference = $1
         AND RIGHT(REGEXP_REPLACE(o.customer_mobile, '[^0-9]', '', 'g'), 10)
             = RIGHT($2, 10)
       LIMIT 1`,
      [orderReference, mobile]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "No matching order found. Please check your details." },
        { status: 404 }
      );
    }

    const order = result.rows[0];

    return NextResponse.json({
      success: true,
      order: {
        orderReference: order.order_reference,
        status: order.status,
        paymentStatus: order.payment_status,
        courierName: order.courier_name,
        trackingNumber: order.tracking_number,
      },
    });
  } catch (error) {
    console.error("Order tracking failed:", error);

    return NextResponse.json(
      { error: "Unable to retrieve order status right now." },
      { status: 500 }
    );
  }
}
