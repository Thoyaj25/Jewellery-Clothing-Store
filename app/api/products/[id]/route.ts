import { NextRequest, NextResponse } from "next/server";
import {
  getProductById,
  updateProduct,
  deleteProduct,
} from "@/src/services/productService";
import { logError } from "@/src/lib/logger";
import { requireAdmin } from "@/src/lib/requireAdmin";
import { validateStockQuantity } from "@/src/lib/validateStockQuantity";

interface ProductBody {
  name?: string;
  category?: string;
  price?: number;
  image?: string;
  description?: string | null;
  isVisible?: boolean;
  stockQuantity?: number | null;
}

function formatError(error: unknown) {
  if (error instanceof Error) {
    return {
      message: error.message,
      stack: error.stack,
    };
  }

  return {
    message: String(error),
  };
}

function postgresErrorCode(error: unknown): string | undefined {
  if (typeof error === "object" && error !== null && "code" in error) {
    const code = (error as { code?: unknown }).code;
    return typeof code === "string" ? code : undefined;
  }
  return undefined;
}

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: rawId } = await context.params;
    const id = Number(rawId);

    if (Number.isNaN(id)) {
      return NextResponse.json(
        { error: "Invalid product ID" },
        { status: 400 }
      );
    }

    const product = await getProductById(id);

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error(formatError(error));
    logError(error, { route: "/api/products/[id] GET" });

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin();

  if (!auth.ok) {
    return auth.response;
  }

  try {
    const { id: rawId } = await context.params;
    const id = Number(rawId);

    if (Number.isNaN(id)) {
      return NextResponse.json(
        { error: "Invalid product ID" },
        { status: 400 }
      );
    }

    const body: ProductBody = await req.json();

    const existingProduct = await getProductById(id);

    if (!existingProduct) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    let stockQuantity = existingProduct.stockQuantity ?? null;

    if (Object.prototype.hasOwnProperty.call(body, "stockQuantity")) {
      try {
        stockQuantity = validateStockQuantity(body.stockQuantity);
      } catch {
        return NextResponse.json(
          { error: "Stock quantity must be null or a non-negative whole number." },
          { status: 400 }
        );
      }
    }

    if (existingProduct.stockQuantity != null && stockQuantity === null) {
      return NextResponse.json(
        { error: "Inventory tracking cannot be disabled once configured. Set stock to 0 instead." },
        { status: 409 }
      );
    }

    const product = await updateProduct(id, {
      name: body.name ?? existingProduct.name,
      category: body.category ?? existingProduct.category,
      price: body.price ?? existingProduct.price,
      image: body.image ?? existingProduct.image,
      description:
        body.description !== undefined
          ? body.description
          : existingProduct.description,
      isVisible:
        typeof body.isVisible === "boolean"
          ? body.isVisible
          : existingProduct.isVisible,
      stockQuantity,
    });

    if (!product) {
      return NextResponse.json(
        { error: "Product update could not be completed. Refresh and try again." },
        { status: 409 }
      );
    }

    return NextResponse.json(product);
  } catch (error) {
    if (postgresErrorCode(error) === "23514") {
      return NextResponse.json(
        { error: "Inventory tracking cannot be disabled once configured. Set stock to 0 instead." },
        { status: 409 }
      );
    }

    console.error(formatError(error));
    logError(error, { route: "/api/products/[id] PUT" });

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin();

  if (!auth.ok) {
    return auth.response;
  }

  try {
    const { id: rawId } = await context.params;
    const id = Number(rawId);

    if (Number.isNaN(id)) {
      return NextResponse.json(
        { error: "Invalid product ID" },
        { status: 400 }
      );
    }

    const existingProduct = await getProductById(id);

    if (!existingProduct) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    const deleted = await deleteProduct(id);

    if (!deleted) {
      return NextResponse.json(
        { error: "Product cannot be deleted because it has order history or was changed. Hide it instead." },
        { status: 409 }
      );
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    if (postgresErrorCode(error) === "23503") {
      return NextResponse.json(
        { error: "This product is referenced by an order. Hide it instead of deleting it." },
        { status: 409 }
      );
    }

    console.error(formatError(error));
    logError(error, { route: "/api/products/[id] DELETE" });

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}