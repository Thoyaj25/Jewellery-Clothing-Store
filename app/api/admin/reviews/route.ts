import { NextResponse } from "next/server";
import { requireAdmin } from "@/src/lib/requireAdmin";
import { query } from "@/src/lib/db";

export const runtime = "nodejs";

type Review = {
  id: string;
  customer_name: string;
  product_name: string;
  rating: number;
  review_text: string;
  status: string;
  source: string;
  consent_to_publish: boolean;
  created_at: Date;
};

export async function GET() {
  const admin = await requireAdmin();

  if (!admin.ok) {
    return admin.response;
  }

  try {
    const result = await query<Review>(
      `SELECT id::text, customer_name, product_name,
              rating, review_text, status, source,
              consent_to_publish, created_at
       FROM public.customer_reviews
       ORDER BY
         CASE WHEN status = 'pending' THEN 0 ELSE 1 END,
         created_at DESC
       LIMIT 100`
    );

    return NextResponse.json({ reviews: result.rows });
  } catch (error) {
    console.error("Unable to load admin reviews:", error);

    return NextResponse.json(
      { error: "Unable to load reviews." },
      { status: 500 }
    );
  }
}
