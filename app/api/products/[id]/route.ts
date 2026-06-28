import { NextRequest, NextResponse } from "next/server";
import sql from "@/src/lib/db";
import { getToken } from "next-auth/jwt";
import { recordAudit } from "@/src/lib/audit";
import { logError } from "@/src/lib/logger";

export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { params } = context;
    const { id: rawId } = await params;
    const id = Number(rawId);
    const rows = await sql`
      SELECT id, name, category, price, image, description
      FROM products
      WHERE id = ${id}
      LIMIT 1
    `;

    if (!rows || rows.length === 0) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error("GET PRODUCT ERROR: /api/products/[id] GET", error);
    try { logError(error, { route: "/api/products/[id] GET" }); } catch (e) {}
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { params } = context;
    const { id: rawId } = await params;
    const id = Number(rawId);
    const body = await req.json();
    const { name, category, price, image, description } = body;

    const errors: string[] = [];
    if (!name || typeof name !== "string" || name.trim().length < 2) errors.push("name must be at least 2 characters");
    if (price === undefined || isNaN(Number(price)) || Number(price) < 0) errors.push("price must be a positive number");
    if (image && typeof image !== "string") errors.push("image must be a string path");
    if (description && typeof description !== "string") errors.push("description must be text");

    if (errors.length > 0) {
      return NextResponse.json({ errors }, { status: 400 });
    }

    const updated = await sql`
      UPDATE products SET
        name = ${name},
        category = ${category},
        price = ${Number(price)},
        image = ${image},
        description = ${description}
      WHERE id = ${id}
      RETURNING id, name, category, price, image, description
    `;

    try {
      const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
      const admin = token ? (token as any).name : undefined;
      const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || req.headers.get("host") || undefined;
      await recordAudit({ admin, action: "update_product", productId: id, payload: updated[0], ip });
    } catch (e) {
      console.error("Audit error:", e);
    }

    return NextResponse.json(updated[0]);
  } catch (error) {
    console.error("PUT PRODUCT ERROR: /api/products/[id] PUT", error);
    try { logError(error, { route: "/api/products/[id] PUT" }); } catch (e) {}
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { params } = context;
    const { id: rawId } = await params;
    const id = Number(rawId);
    await sql`
      DELETE FROM products WHERE id = ${id}
    `;
    try {
      const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
      const admin = token ? (token as any).name : undefined;
      const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || req.headers.get("host") || undefined;
      await recordAudit({ admin, action: "delete_product", productId: id, payload: null, ip });
    } catch (e) {
      console.error("Audit error:", e);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE PRODUCT ERROR: /api/products/[id] DELETE", error);
    try { logError(error, { route: "/api/products/[id] DELETE" }); } catch (e) {}
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
