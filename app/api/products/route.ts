import { NextRequest, NextResponse } from "next/server";
import sql from "@/src/lib/db";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);

    const q = url.searchParams.get("q");
    const category = url.searchParams.get("category");
    const min = url.searchParams.get("min");
    const max = url.searchParams.get("max");

    let products;

    if (q) {
      products = await sql`
        SELECT id, name, category, price, image, description
        FROM products
        WHERE name ILIKE ${`%${q}%`}
        ORDER BY id
      `;
    } else if (category) {
      products = await sql`
        SELECT id, name, category, price, image, description
        FROM products
        WHERE category = ${category}
        ORDER BY id
      `;
    } else if (min) {
      products = await sql`
        SELECT id, name, category, price, image, description
        FROM products
        WHERE price >= ${Number(min)}
        ORDER BY id
      `;
    } else if (max) {
      products = await sql`
        SELECT id, name, category, price, image, description
        FROM products
        WHERE price <= ${Number(max)}
        ORDER BY id
      `;
    } else {
      products = await sql`
        SELECT id, name, category, price, image, description
        FROM products
        ORDER BY id
      `;
    }

    return NextResponse.json(products);
  } catch (error) {
    console.error("PRODUCTS GET ERROR:", error);

    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    );
  }
}
