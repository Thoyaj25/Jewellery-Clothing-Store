import { NextRequest, NextResponse } from "next/server";
import {
  createProduct,
  getProducts,
} from "@/src/services/productService";

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

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const name = String(body.name ?? "").trim();
    const category = String(body.category ?? "").trim();
    const price = Number(body.price);
    const image = String(body.image ?? "").trim();
    const description = String(body.description ?? "").trim();

    if (name.length < 2) {
      return NextResponse.json(
        { error: "Product name is required" },
        { status: 400 }
      );
    }

    if (!category) {
      return NextResponse.json(
        { error: "Category is required" },
        { status: 400 }
      );
    }

    if (Number.isNaN(price) || price < 0) {
      return NextResponse.json(
        { error: "Invalid price" },
        { status: 400 }
      );
    }

    const product = await createProduct({
      name,
      category,
      price,
      image,
      description,
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("PRODUCTS POST ERROR:", error);

    return NextResponse.json(
      {
        error: "Failed to create product",
        code: "CREATE_PRODUCT_FAILED",
      },
      { status: 500 }
    );
  }
}