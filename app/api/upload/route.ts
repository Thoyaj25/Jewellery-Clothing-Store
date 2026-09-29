import { put } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/src/lib/requireAdmin";

export async function POST(request: NextRequest) {
  const auth = await requireAdmin();

  if (!auth.ok) {
    return auth.response;
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "Image file is required." },
        { status: 400 }
      );
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Only image files are allowed." },
        { status: 400 }
      );
    }

    const maxSize = 5 * 1024 * 1024;

    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "Image must be 5 MB or smaller." },
        { status: 400 }
      );
    }

    const filename = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");

    const blob = await put(`products/${Date.now()}-${filename}`, file, {
      access: "public",
    });

    return NextResponse.json({
      url: blob.url,
    });
  } catch (error) {
    console.error("IMAGE UPLOAD ERROR:", error);

    return NextResponse.json(
      { error: "Failed to upload image." },
      { status: 500 }
    );
  }
}
