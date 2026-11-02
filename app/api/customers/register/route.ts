import { NextRequest, NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { createHmac } from "node:crypto";
import { query, withTransaction } from "@/src/lib/db";
import { createEmailVerificationToken } from "@/src/lib/customerEmailVerification";
import { sendCustomerVerificationEmail } from "@/src/lib/sendCustomerVerificationEmail";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  if (
    process.env.NODE_ENV === "production" &&
    process.env.CUSTOMER_REGISTRATION_ENABLED !== "true"
  ) {
    return NextResponse.json(
      { error: "Customer registration is not available yet." },
      { status: 503 }
    );
  }

  try {
    const body = await request.json().catch(() => null);

    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return NextResponse.json(
        { error: "Invalid registration details." },
        { status: 400 }
      );
    }

    const fullName =
      typeof body.fullName === "string" ? body.fullName.trim() : "";

    const email =
      typeof body.email === "string"
        ? body.email.trim().toLowerCase()
        : "";

    const password =
      typeof body.password === "string" ? body.password : "";

    // Production runs behind Vercel's trusted edge.
    // Do not accept arbitrary forwarded IPs from untrusted proxies.
    const clientIp = request.headers
      .get("x-vercel-forwarded-for")
      ?.trim();

    if (!clientIp || !process.env.NEXTAUTH_SECRET) {
      return NextResponse.json(
        { error: "Registration is temporarily unavailable." },
        { status: 503 }
      );
    }

    const identifierHash = createHmac(
      "sha256",
      process.env.NEXTAUTH_SECRET
    ).update(clientIp).digest("hex");

    const attempt = await query<{ attempt_count: number }>(
      `INSERT INTO public.registration_rate_limits
         (identifier_hash, window_start, attempt_count)
       VALUES (
         $1,
         date_trunc('hour', NOW()),
         1
       )
       ON CONFLICT (identifier_hash, window_start)
       DO UPDATE SET
         attempt_count = registration_rate_limits.attempt_count + 1
       RETURNING attempt_count`,
      [identifierHash]
    );

    if (attempt.rows[0].attempt_count > 5) {
      return NextResponse.json(
        { error: "Too many registration attempts. Please try later." },
        {
          status: 429,
          headers: { "Retry-After": "3600" },
        }
      );
    }

    if (!fullName || fullName.length > 100) {
      return NextResponse.json(
        { error: "Enter a valid full name (maximum 100 characters)." },
        { status: 400 }
      );
    }

    if (
      !email ||
      email.length > 254 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      return NextResponse.json(
        { error: "Enter a valid email address." },
        { status: 400 }
      );
    }

    if (
      password.length < 12 ||
      Buffer.byteLength(password, "utf8") > 72
    ) {
      return NextResponse.json(
        { error: "Password must be at least 12 characters and no more than 72 bytes." },
        { status: 400 }
      );
    }

    const passwordHash = await hash(password, 12);

    const result = await withTransaction(async (client) => {
      const customerResult = await client.query<{
        id: string;
        full_name: string;
        email: string;
      }>(
        `INSERT INTO public.customers (
           full_name, email, password_hash
         )
         VALUES ($1, $2, $3)
         ON CONFLICT DO NOTHING
         RETURNING id::text AS id, full_name, email`,
        [fullName, email, passwordHash]
      );

      if (customerResult.rows.length === 0) {
        return customerResult;
      }

      const verification = createEmailVerificationToken();

      await client.query(
        `INSERT INTO public.customer_email_verifications
           (customer_id, token_hash, expires_at)
         VALUES ($1, $2, $3)`,
        [
          customerResult.rows[0].id,
          verification.tokenHash,
          verification.expiresAt,
        ]
      );

      // Send before committing so a delivery API failure rolls back registration.
      // Never return or log the verification token.
      await sendCustomerVerificationEmail({
        email: customerResult.rows[0].email,
        fullName: customerResult.rows[0].full_name,
        token: verification.token,
      });

      return customerResult;
    });

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "An account already exists with this email." },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        customer: {
          id: result.rows[0].id,
          fullName: result.rows[0].full_name,
          email: result.rows[0].email,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Customer registration failed:", error);

    return NextResponse.json(
      { error: "Unable to register customer." },
      { status: 500 }
    );
  }
}
