import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth";
import { deleteProducts } from "@/src/services/productService";

type BulkDeleteRequest = {
  ids: (number | string)[];
};

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await req.json()) as BulkDeleteRequest;

    if (!Array.isArray(body.ids) || body.ids.length === 0) {
      return NextResponse.json(
        { error: "No product ids provided." },
        { status: 400 }
      );
    }

    // Reject the entire request if any product ID is invalid.
    // Never silently remove IDs from a destructive operation.
    if (
      body.ids.length > 100 ||
      !body.ids.every(
        (id) =>
          typeof id === "number" &&
          Number.isSafeInteger(id) &&
          id > 0
      )
    ) {
      return NextResponse.json(
        { error: "Provide 1 to 100 valid numeric product IDs." },
        { status: 400 }
      );
    }

    const ids = [...new Set(body.ids as number[])];

    const deleted = await deleteProducts(ids);

    if (deleted !== new Set(ids).size) {
      return NextResponse.json({
        success: false,
        deleted,
        message:
          "Some products could not be deleted because they have order history or no longer exist. Hide products with order history instead.",
      }, { status: 409 });
    }

    return NextResponse.json({
      success: true,
      deleted,
    });
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code?: unknown }).code === "23503"
    ) {
      return NextResponse.json(
        {
          error:
            "One or more products are referenced by orders. Hide them instead of deleting them.",
        },
        { status: 409 }
      );
    }

    console.error("Bulk delete failed:", error);
    return NextResponse.json(
      { error: "Bulk delete failed." },
      { status: 500 }
    );
  }
}