import { NextResponse } from "next/server";
import { query } from "@/src/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const name =
      typeof body.name === "string" ? body.name.trim() : "";
    const phone =
      typeof body.phone === "string" ? body.phone.trim() : "";
    const email =
      typeof body.email === "string" ? body.email.trim() : "";
    const message =
      typeof body.message === "string" ? body.message.trim() : "";

    if (!name || !phone || !message) {
      return NextResponse.json(
        {
          success: false,
          error: "Name, phone and message are required.",
        },
        { status: 400 }
      );
    }

    const result = await query<{
      id: number;
      name: string;
      phone: string;
      email: string | null;
      message: string;
      status: string;
      created_at: Date;
    }>(
      `
        INSERT INTO enquiries (
          name,
          phone,
          email,
          message
        )
        VALUES ($1, $2, $3, $4)
        RETURNING
          id,
          name,
          phone,
          email,
          message,
          status,
          created_at
      `,
      [name, phone, email || null, message]
    );

    return NextResponse.json(
      {
        success: true,
        enquiry: result.rows[0],
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to create enquiry:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Unable to submit enquiry.",
      },
      { status: 500 }
    );
  }
}
