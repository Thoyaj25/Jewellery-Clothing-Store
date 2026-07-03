import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import type { JWT } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  console.log("========== MIDDLEWARE ==========");
  console.log("req.url:", req.url);
  console.log("req.nextUrl.href:", req.nextUrl.href);
  console.log("req.nextUrl.origin:", req.nextUrl.origin);
  console.log("Host header:", req.headers.get("host"));
  console.log("Method:", req.method);
  console.log("Pathname:", req.nextUrl.pathname);
  console.log("================================");

  const { pathname } = req.nextUrl;

  // Protect /admin and write operations on /api/products
  const protectAdmin =
    pathname === "/admin" || pathname.startsWith("/admin/");

  const protectApi =
    pathname === "/api/products" ||
    pathname.startsWith("/api/products/");

  if (!protectAdmin && !protectApi) {
    return NextResponse.next();
  }

  // Allow GET on /api/products
  if (protectApi && req.method === "GET") {
    return NextResponse.next();
  }

  const token = (await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  })) as JWT | null;

  if (token?.isAdmin) {
    return NextResponse.next();
  }

  // Redirect to NextAuth sign-in
  const signInUrl = new URL("/api/auth/signin", req.url);
  signInUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);

  console.log("Redirecting to:", signInUrl.toString());

  return NextResponse.redirect(signInUrl);
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/products/:path*",
    "/api/admin/:path*",
  ],
};