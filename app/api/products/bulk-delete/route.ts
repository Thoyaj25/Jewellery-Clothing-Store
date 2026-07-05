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

    const ids = body.ids.filter(
      (id): id is number => typeof id === "number" && Number.isInteger(id) && id > 0
    );

    if (ids.length === 0) {
      return NextResponse.json(
        { error: "Invalid product ids." },
        { status: 400 }
      );
    }

    const deleted = await deleteProducts(ids);

    return NextResponse.json({
      success: true,
      deleted,
    });
  } catch (error) {
    console.error("Bulk delete failed:", error);
    return NextResponse.json(
      { error: "Bulk delete failed." },
      { status: 500 }
    );
  }
}