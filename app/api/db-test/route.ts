import { NextResponse } from "next/server";
import sql from "@/src/lib/db";

export async function GET() {
  try {
    const result = await sql`SELECT NOW() as current_time`;

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.error("FULL DB ERROR:");
    console.dir(error, { depth: null });

    return NextResponse.json(
      {
        success: false,
        error: String(error),
        code: error?.code,
        errors: error?.errors,
      },
      { status: 500 }
    );
  }
}