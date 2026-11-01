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
    const availability = body?.availability;
    const note = typeof body?.note === "string"
      ? body.note.trim()
      : "";

    if (!["Available", "Unavailable"].includes(availability)) {
      return NextResponse.json(
        { error: "Invalid dealer availability." },
        { status: 400 }
      );
    }

    if (note.length > 1000) {
      return NextResponse.json(
        { error: "Note cannot exceed 1000 characters." },
        { status: 400 }
      );
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
        return "not_found" as const;
      }

      if (lookup.rows[0].status !== "Requested") {
        return "conflict" as const;
      }

      await client.query(
        `UPDATE public.orders
         SET dealer_availability = $1,
             dealer_verified_at = NOW(),
             dealer_verification_note = $2,
             updated_at = NOW()
         WHERE id = $3`,
        [availability, note || null, orderId]
      );

      return "updated" as const;
    });

    if (result === "not_found") {
      return NextResponse.json(
        { error: "Order not found." },
        { status: 404 }
      );
    }

    if (result === "conflict") {
      return NextResponse.json(
        { error: "Dealer availability can only be updated for requested orders." },
        { status: 409 }
      );
    }

    return NextResponse.json({
      success: true,
      availability,
    });
  } catch (error) {
    console.error("Dealer verification failed:", error);

    return NextResponse.json(
      { error: "Unable to update dealer availability." },
      { status: 500 }
    );
  }
}
