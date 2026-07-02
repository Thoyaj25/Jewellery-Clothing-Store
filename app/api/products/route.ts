import { NextRequest, NextResponse } from "next/server";
import sql from "@/src/lib/db";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);

    const q = url.searchParams.get("q")?.trim();
    const category = url.searchParams.get("category")?.trim();
    const minParam = url.searchParams.get("min")?.trim();
    const maxParam = url.searchParams.get("max")?.trim();

    const minValue = minParam ? Number(minParam) : null;
    const maxValue = maxParam ? Number(maxParam) : null;
    const hasMin = minValue !== null && !Number.isNaN(minValue);
    const hasMax = maxValue !== null && !Number.isNaN(maxValue);

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
    } else if (hasMin) {
      products = await sql`
        SELECT id, name, category, price, image, description
        FROM products
        WHERE price >= ${minValue}
        ORDER BY id
      `;
    } else if (hasMax) {
      products = await sql`
        SELECT id, name, category, price, image, description
        FROM products
        WHERE price <= ${maxValue}
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
      {
        error: "Database unavailable",
        code: "DB_UNAVAILABLE",
      },
      { status: 503 }
    );
  }
}
