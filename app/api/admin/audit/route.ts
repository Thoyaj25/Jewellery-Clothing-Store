import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const url = new URL(req.url);

  const page = Math.max(1, Number(url.searchParams.get("page") || "1"));
  const limit = Math.min(100, Math.max(1, Number(url.searchParams.get("limit") || "20")));

  return NextResponse.json({
    entries: [],
    page,
    limit,
    total: 0,
  });
}
