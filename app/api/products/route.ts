import { NextRequest, NextResponse } from "next/server";
import { getProducts } from "@/src/services/productService";

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

    let products = await getProducts();

    if (q) {
      const normalizedQuery = q.toLowerCase();
      products = products.filter((product) =>
        product.name.toLowerCase().includes(normalizedQuery)
      );
    }

    if (category) {
      products = products.filter(
        (product) => product.category === category
      );
    }

    if (hasMin) {
      products = products.filter((product) => product.price >= minValue);
    }

    if (hasMax) {
      products = products.filter((product) => product.price <= maxValue);
    }

    return NextResponse.json(products);
  } catch (error) {
    console.error("PRODUCTS GET ERROR:", error);

    return NextResponse.json(
      {
        error: "Products service unavailable",
        code: "SERVICE_UNAVAILABLE",
      },
      { status: 503 }
    );
  }
}
