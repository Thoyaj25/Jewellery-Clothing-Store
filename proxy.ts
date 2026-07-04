import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Protect admin routes
  const isAdminRoute =
    pathname === "/admin" || pathname.startsWith("/admin/");

  // Protect product write APIs
  const isProtectedApi =
    pathname === "/api/products" ||
    pathname.startsWith("/api/products/");

  // Allow all non-protected routes
  if (!isAdminRoute && !isProtectedApi) {
    return NextResponse.next();
  }

  // Allow public GET access for products
  if (isProtectedApi && req.method === "GET") {
    return NextResponse.next();
  }

  // Read JWT from NextAuth (Edge-safe)
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // Strict admin check (avoid truthy bugs)
  const isAdmin = token?.isAdmin === true;

  if (isAdmin) {
    return NextResponse.next();
  }

  // Redirect to login
  const signInUrl = new URL("/api/auth/signin", req.url);
  signInUrl.searchParams.set("callbackUrl", pathname);

  return NextResponse.redirect(signInUrl);
}

export const config = {
  matcher: ["/admin/:path*", "/api/products/:path*", "/api/admin/:path*"],
};