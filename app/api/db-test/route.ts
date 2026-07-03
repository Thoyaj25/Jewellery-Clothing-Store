import { NextResponse } from "next/server";

export async function GET() {
  const url = process.env.DATABASE_URL;

  return NextResponse.json({
    hasDatabaseUrl: !!url,
    host: url ? new URL(url).hostname : null,
    sslmode: url ? new URL(url).searchParams.get("sslmode") : null,
    channelBinding: url
      ? new URL(url).searchParams.get("channel_binding")
      : null,
  });
}