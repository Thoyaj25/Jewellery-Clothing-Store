import { NextRequest, NextResponse } from "next/server";
import { createHmac } from "node:crypto";
import { query } from "@/src/lib/db";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  if (
    process.env.NODE_ENV === "production" &&
    process.env.CUSTOMER_REVIEWS_ENABLED !== "true"
  ) {
    return NextResponse.json(
      { error: "Customer reviews are not available yet." },
      { status: 503 }
    );
  }

  try {
    const ip = request.headers.get("x-vercel-forwarded-for")?.trim();
    const secret = process.env.NEXTAUTH_SECRET;

    if (!ip || !secret || ip.includes(",")) {
      return NextResponse.json(
        { error: "Review submission is temporarily unavailable." },
        { status: 503 }
      );
    }

    const identifierHash = createHmac("sha256", secret)
      .update(`customer-reviews:${ip}`)
      .digest("hex");

    const attempt = await query<{ attempt_count: number }>(
      `INSERT INTO public.review_rate_limits
         (identifier_hash, window_start, attempt_count)
       VALUES ($1, date_trunc('hour', NOW()), 1)
       ON CONFLICT (identifier_hash, window_start)
       DO UPDATE SET attempt_count =
         LEAST(registration_rate_limits.attempt_count + 1, 6)
       RETURNING attempt_count`,
      [identifierHash]
    );

    if (attempt.rows[0].attempt_count > 5) {
      return NextResponse.json(
        { error: "Too many reviews submitted. Please try later." },
        {
          status: 429,
          headers: { "Retry-After": "3600" },
        }
      );
    }

    const body = await request.json().catch(() => null);

    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return NextResponse.json(
        { error: "Invalid review details." },
        { status: 400 }
      );
    }

    const name =
      typeof body.name === "string" ? body.name.trim() : "";

    const productName =
      typeof body.productName === "string"
        ? body.productName.trim()
        : "";

    const review =
      typeof body.review === "string" ? body.review.trim() : "";

    const rating = body.rating;

    if (
      name.length < 2 ||
      name.length > 100 ||
      productName.length < 2 ||
      productName.length > 200 ||
      review.length < 10 ||
      review.length > 1000 ||
      !Number.isInteger(rating) ||
      rating < 1 ||
      rating > 5 ||
      body.consentToPublish !== true
    ) {
      return NextResponse.json(
        { error: "Please provide valid review details and publication consent." },
        { status: 400 }
      );
    }

    await query(
      `INSERT INTO public.customer_reviews
         (customer_name, product_name, rating,
          review_text, status, source, consent_to_publish)
       VALUES ($1, $2, $3, $4, 'pending', 'website', TRUE)`,
      [name, productName, rating, review]
    );

    return NextResponse.json(
      {
        success: true,
        message: "Thank you! Your review is awaiting approval.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Customer review submission failed:", error);

    return NextResponse.json(
      { error: "Unable to submit review." },
      { status: 500 }
    );
  }
}
