import { NextRequest, NextResponse } from "next/server";
import { withTransaction } from "@/src/lib/db";
import { hashEmailVerificationToken } from "@/src/lib/customerEmailVerification";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    const token = body?.token;

    if (
      typeof token !== "string" ||
      !/^[a-f0-9]{64}$/.test(token)
    ) {
      return NextResponse.json(
        { error: "Invalid verification link." },
        { status: 400 }
      );
    }

    const tokenHash = hashEmailVerificationToken(token);

    const verified = await withTransaction(async (client) => {
      const result = await client.query<{
        id: string;
        customer_id: string;
      }>(
        `SELECT id::text, customer_id::text
         FROM public.customer_email_verifications
         WHERE token_hash = $1
           AND used_at IS NULL
           AND expires_at > NOW()
         FOR UPDATE`,
        [tokenHash]
      );

      if (result.rows.length === 0) {
        return false;
      }

      const verification = result.rows[0];

      await client.query(
        `UPDATE public.customers
         SET email_verified_at = COALESCE(email_verified_at, NOW())
         WHERE id = $1`,
        [verification.customer_id]
      );

      await client.query(
        `UPDATE public.customer_email_verifications
         SET used_at = NOW()
         WHERE id = $1`,
        [verification.id]
      );

      return true;
    });

    if (!verified) {
      return NextResponse.json(
        { error: "Verification link is invalid, expired, or already used." },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Email verified successfully. You can now sign in.",
    });
  } catch (error) {
    console.error("Customer email verification failed:", error);

    return NextResponse.json(
      { error: "Unable to verify email. Please try again." },
      { status: 500 }
    );
  }
}
