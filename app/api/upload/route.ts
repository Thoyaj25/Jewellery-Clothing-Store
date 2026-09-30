import { put } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
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
    const storageName = `${Date.now()}-${filename}`;

    try {
      const blob = await put(`products/${storageName}`, file, {
        access: "public",
      });

      return NextResponse.json({
        url: blob.url,
      });
    } catch (blobError) {
      console.warn("Vercel Blob upload failed, falling back to local storage:", blobError);

      const uploadsDir = join(process.cwd(), "public", "uploads");
      await mkdir(uploadsDir, { recursive: true });

      const bytes = Buffer.from(await file.arrayBuffer());
      const localFile = join(uploadsDir, storageName);
      await writeFile(localFile, bytes);

      return NextResponse.json({
        url: `/uploads/${storageName}`,
      });
    }
  } catch (error) {
    console.error("IMAGE UPLOAD ERROR:", error);

    return NextResponse.json(
      { error: "Failed to upload image." },
      { status: 500 }
    );
  }
}
