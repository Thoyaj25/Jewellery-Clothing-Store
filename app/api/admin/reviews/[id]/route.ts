import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/src/lib/requireAdmin";
import { query } from "@/src/lib/db";

export const runtime = "nodejs";

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin();

  if (!admin.ok) {
    return admin.response;
  }

  const { id } = await context.params;

  if (!/^[1-9][0-9]{0,17}$/.test(id)) {
    return NextResponse.json(
      { error: "Invalid review ID." },
      { status: 400 }
    );
  }

  const body = await request.json().catch(() => null);
  const status = body?.status;

  if (status !== "approved" && status !== "rejected") {
    return NextResponse.json(
      { error: "Status must be approved or rejected." },
      { status: 400 }
    );
  }

  try {
    const result = await query<{ id: string; status: string }>(
      `UPDATE public.customer_reviews
       SET status = $2,
           reviewed_at = NOW()
       WHERE id = $1
         AND status = 'pending'
         AND (
           $2 = 'rejected'
           OR consent_to_publish = TRUE
         )
       RETURNING id::text, status`,
      [id, status]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        {
          error:
            "Review not found, already moderated, or missing publication consent.",
        },
        { status: 409 }
      );
    }

    return NextResponse.json({
      success: true,
      review: result.rows[0],
    });
  } catch (error) {
    console.error("Review moderation failed:", error);

    return NextResponse.json(
      { error: "Unable to moderate review." },
      { status: 500 }
    );
  }
}
