import { NextRequest, NextResponse } from "next/server";
import { getProductById, getProducts } from "@/src/services/productService";
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

    if (Number.isNaN(id)) {
      return NextResponse.json({ error: "Invalid product ID" }, { status: 400 });
    }

    const product = await getProductById(id);

    if (!product) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(product);
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

export async function PUT() {
  return NextResponse.json(
    { error: "Product update is not supported in static mode" },
    { status: 501 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    { error: "Product delete is not supported in static mode" },
    { status: 501 }
  );
}
