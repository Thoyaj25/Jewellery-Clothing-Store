import { NextResponse } from "next/server";
import { Resend } from "resend";
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

    // Save the enquiry first. The database remains our source of truth.
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

    const enquiry = result.rows[0];

    // Email notification is secondary. A notification failure must never
    // cause a successfully saved customer enquiry to fail.
    try {
      const apiKey = process.env.RESEND_API_KEY;
      const notificationEmail = process.env.ENQUIRY_NOTIFICATION_EMAIL;

      if (!apiKey || !notificationEmail) {
        console.warn(
          "Enquiry saved, but email notification environment variables are missing."
        );
      } else {
        const resend = new Resend(apiKey);

        const { error } = await resend.emails.send({
          from: "Ultimate Collections <onboarding@resend.dev>",
          to: [notificationEmail],
          subject: `New Ultimate Collections Enquiry #${enquiry.id}`,
          html: `
            <h2>New Customer Enquiry</h2>

            <p><strong>Enquiry ID:</strong> ${enquiry.id}</p>
            <p><strong>Name:</strong> ${escapeHtml(enquiry.name)}</p>
            <p><strong>Phone:</strong> ${escapeHtml(enquiry.phone)}</p>
            <p><strong>Email:</strong> ${
              enquiry.email ? escapeHtml(enquiry.email) : "Not provided"
            }</p>

            <p><strong>Message:</strong></p>
            <p>${escapeHtml(enquiry.message).replace(/\n/g, "<br>")}</p>

            <hr />

            <p>
              This enquiry has already been safely stored in the
              Ultimate Collections database.
            </p>
          `,
        });

        if (error) {
          console.error(
            `Enquiry #${enquiry.id} saved, but email notification failed:`,
            error
          );
        } else {
          console.log(
            `Email notification sent for enquiry #${enquiry.id}`
          );
        }
      }
    } catch (notificationError) {
      console.error(
        `Enquiry #${enquiry.id} saved, but email notification failed:`,
        notificationError
      );
    }

    return NextResponse.json(
      {
        success: true,
        enquiry,
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

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
