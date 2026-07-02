import { NextRequest, NextResponse } from "next/server";
import sql from "@/src/lib/db";
import { getToken } from "next-auth/jwt";
import type { JWT } from "next-auth/jwt";
import { recordAudit } from "@/src/lib/audit";
import { logError } from "@/src/lib/logger";

interface ProductBody {
  name: string;
  category: string;
  price: number;
  image: string;
  description: string | null;
}

function formatError(error: unknown) {
  if (error instanceof Error) return { message: error.message, stack: error.stack };
  return { message: String(error) };
}

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
  } catch (error: unknown) {
    console.error("GET PRODUCT ERROR: /api/products/[id] GET", formatError(error));
    try {
      logError(error, { route: "/api/products/[id] GET" });
    } catch (err) {
      console.error("LOG ERROR FAILED", err);
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { params } = context;
    const { id: rawId } = await params;
    const id = Number(rawId);
    const body: ProductBody = await req.json();
    const { name, category, price, image, description } = body;

    const errors: string[] = [];
    if (name.trim().length < 2) errors.push("name must be at least 2 characters");
    if (Number.isNaN(price) || price < 0) errors.push("price must be a positive number");
    if (image.trim().length === 0) errors.push("image must be a string path");
    if (description !== null && description.trim().length === 0) errors.push("description must be text");

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
      const token = (await getToken({ req, secret: process.env.NEXTAUTH_SECRET })) as JWT | null;
      const admin = token?.name as string | undefined;
      const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || req.headers.get("host") || undefined;
      await recordAudit({ admin, action: "update_product", productId: id, payload: updated[0], ip });
    } catch (e: unknown) {
      console.error("Audit error:", formatError(e));
    }

    return NextResponse.json(updated[0]);
  } catch (error: unknown) {
    console.error("PUT PRODUCT ERROR: /api/products/[id] PUT", formatError(error));
    try {
      logError(error, { route: "/api/products/[id] PUT" });
    } catch (err) {
      console.error("LOG ERROR FAILED", err);
    }
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
      const token = (await getToken({ req, secret: process.env.NEXTAUTH_SECRET })) as JWT | null;
      const admin = token?.name as string | undefined;
      const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || req.headers.get("host") || undefined;
      await recordAudit({ admin, action: "delete_product", productId: id, payload: null, ip });
    } catch (e: unknown) {
      console.error("Audit error:", formatError(e));
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("DELETE PRODUCT ERROR: /api/products/[id] DELETE", formatError(error));
    try {
      logError(error, { route: "/api/products/[id] DELETE" });
    } catch (err) {
      console.error("LOG ERROR FAILED", err);
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
