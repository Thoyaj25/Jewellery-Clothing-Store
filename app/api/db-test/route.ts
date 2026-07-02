import { NextResponse } from "next/server";
import sql from "@/src/lib/db";

interface DatabaseError {
  code?: string;
  errors?: unknown;
}

export async function GET() {
  try {
    const result = await sql`SELECT NOW() as current_time`;

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error: unknown) {
    console.error("FULL DB ERROR:");
    console.dir(error, { depth: null });

    const dbError = error as DatabaseError;

    return NextResponse.json(
      {
        success: false,
        error: String(error),
        code: dbError.code,
        errors: dbError.errors,
      },
      { status: 500 }
    );
  }
}