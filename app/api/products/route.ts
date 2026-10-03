import { NextRequest, NextResponse } from "next/server";
import { getProducts, createProduct } from "@/src/services/productService";
import { requireAdmin } from "@/src/lib/requireAdmin";

interface ProductBody {
  name: string;
  category: string;
  price: number;
  image: string;
  description: string | null;
  isVisible?: boolean;
}

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
  const auth = await requireAdmin();

  if (!auth.ok) {
    return auth.response;
  }

  try {
    const body = (await req.json()) as ProductBody;

    const name = body.name?.trim();
    const category = body.category?.trim();
    const image = body.image?.trim();
    const description =
      typeof body.description === "string"
        ? body.description.trim()
        : null;

    const price = Number(body.price);

    if (!name || name.length < 2) {
      return NextResponse.json(
        { error: "Product name is required." },
        { status: 400 }
      );
    }

    if (!category) {
      return NextResponse.json(
        { error: "Product category is required." },
        { status: 400 }
      );
    }

    if (!Number.isFinite(price) || price < 0) {
      return NextResponse.json(
        { error: "Product price must be a valid non-negative number." },
        { status: 400 }
      );
    }

    if (!image) {
      return NextResponse.json(
        { error: "Product image URL is required." },
        { status: 400 }
      );
    }

    const product = await createProduct({
      name,
      category,
      price,
      image,
      description: description || null,
      isVisible: typeof body.isVisible === "boolean" ? body.isVisible : true,
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("PRODUCTS POST ERROR:", error);

    return NextResponse.json(
      {
        error: "Failed to create product.",
      },
      { status: 500 }
    );
  }
}
