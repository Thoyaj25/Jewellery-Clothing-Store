import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/src/lib/auth";
import { query } from "@/src/lib/db";

type EnquiryRow = {
  id: number;
  name: string;
  phone: string;
  email: string | null;
  message: string;
  status: string;
  created_at: Date;
};

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.isAdmin) {
    return NextResponse.json(
      {
        success: false,
        error: "Unauthorized",
      },
      { status: 401 }
    );
  }

  try {
    const url = new URL(request.url);

    const page = Math.max(
      1,
      Number(url.searchParams.get("page") || "1")
    );

    const limit = Math.min(
      100,
      Math.max(
        1,
        Number(url.searchParams.get("limit") || "20")
      )
    );

    const offset = (page - 1) * limit;

    const [enquiriesResult, totalResult] = await Promise.all([
      query<EnquiryRow>(
        `
          SELECT
            id,
            name,
            phone,
            email,
            message,
            status,
            created_at
          FROM enquiries
          ORDER BY created_at DESC
          LIMIT $1
          OFFSET $2
        `,
        [limit, offset]
      ),

      query<{ total: string }>(
        `
          SELECT COUNT(*)::text AS total
          FROM enquiries
        `
      ),
    ]);

    return NextResponse.json({
      success: true,
      enquiries: enquiriesResult.rows,
      page,
      limit,
      total: Number(totalResult.rows[0]?.total || 0),
    });
  } catch (error) {
    console.error("Failed to load admin enquiries:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Unable to load enquiries.",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.isAdmin) {
    return NextResponse.json(
      {
        success: false,
        error: "Unauthorized",
      },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();

    const id = Number(body.id);
    const status =
      typeof body.status === "string"
        ? body.status.trim().toLowerCase()
        : "";

    const allowedStatuses = new Set([
      "new",
      "contacted",
      "completed",
    ]);

    if (!Number.isInteger(id) || id <= 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid enquiry ID.",
        },
        { status: 400 }
      );
    }

    if (!allowedStatuses.has(status)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid enquiry status.",
        },
        { status: 400 }
      );
    }

    const result = await query<EnquiryRow>(
      `
        UPDATE enquiries
        SET status = $1
        WHERE id = $2
        RETURNING
          id,
          name,
          phone,
          email,
          message,
          status,
          created_at
      `,
      [status, id]
    );

    if (!result.rows[0]) {
      return NextResponse.json(
        {
          success: false,
          error: "Enquiry not found.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      enquiry: result.rows[0],
    });
  } catch (error) {
    console.error("Failed to update enquiry status:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Unable to update enquiry status.",
      },
      { status: 500 }
    );
  }
}
