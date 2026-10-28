import { NextResponse } from "next/server";
import { getVisibleProducts } from "@/src/services/productService";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const products = await getVisibleProducts();

    const availability = products.map((product) => ({
      id: product.id,
      stockQuantity: product.stockQuantity ?? null,
    }));

    return NextResponse.json(
      { products: availability },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    console.error("PRODUCT AVAILABILITY ERROR:", error);

    return NextResponse.json(
      { error: "Product availability is temporarily unavailable." },
      { status: 503 }
    );
  }
}
