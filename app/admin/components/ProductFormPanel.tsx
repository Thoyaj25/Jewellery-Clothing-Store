"use client";

import Image from "next/image";
import { useState, type FormEvent, useEffect, type ChangeEvent } from "react";import type { Product } from "@/src/types/product";

type Props = {
  editing: Product | null;
  onSuccess: () => void;
  onCancelEdit: () => void;
};

type FormState = {
  name: string;
  category: string;
  price: string;
  image: string;
  description: string;
};

const getEmptyForm = (): FormState => ({
  name: "",
  category: "",
  price: "",
  image: "",
  description: "",
});

export default function ProductFormPanel({
  editing,
  onSuccess,
  onCancelEdit,
}: Props) {
  const [form, setForm] = useState<FormState>(getEmptyForm());
  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (editing) {
      setForm({
        name: editing.name,
        category: editing.category,
        price: editing.price.toString(),
        image: editing.image,
        description: editing.description ?? "",
      });
    } else {
      setForm(getEmptyForm());
    }
  }, [editing]);

  const handleImageUpload = async (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setErrors([]);
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Image upload failed");
      }

      setForm((current) => ({
        ...current,
        image: data.url,
      }));
    } catch (error) {
      setErrors([
        error instanceof Error
          ? error.message
          : "Failed to upload image",
      ]);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrors([]);

    const validation: string[] = [];

    if (form.name.trim().length < 2) {
      validation.push("Name too short");
    }

    const price = Number(form.price);

    if (Number.isNaN(price) || price < 0) {
      validation.push("Invalid price");
    }

    if (!form.image.trim()) {
      validation.push("Product image is required");
    }

    if (validation.length) {
      setErrors(validation);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        editing ? `/api/products/${editing.id}` : "/api/products",
        {
          method: editing ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...form,
            price,
          }),
        }
      );

      if (!res.ok) {
        throw new Error("Request failed");
      }

      setForm(getEmptyForm());
      onSuccess();
    } catch (err) {
      setErrors([
        err instanceof Error
          ? err.message
          : "Failed to save product",
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 bg-zinc-900 rounded space-y-4"
    >
      <h2 className="text-white font-bold">
        {editing ? "Edit Product" : "Add Product"}
      </h2>

      {errors.length > 0 && (
        <div className="text-red-400 text-sm space-y-1">
          {errors.map((error, index) => (
            <div key={index}>{error}</div>
          ))}
        </div>
      )}

      <div className="space-y-2">
        <label className="block text-sm text-zinc-300">
          Product Title
        </label>

        <input
          placeholder="Enter product title"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
          className="w-full p-2 bg-black text-white rounded"
          disabled={loading || uploading}
        />
      </div>

      <div className="space-y-2">
  <label className="block text-sm text-zinc-300">
    Product Image
  </label>

  <label className="inline-flex cursor-pointer items-center rounded bg-amber-600 px-4 py-2 text-white hover:bg-amber-500">
    {uploading ? "Uploading..." : "Upload Image"}

    <input
      type="file"
      accept="image/*"
      onChange={handleImageUpload}
      disabled={loading || uploading}
      className="hidden"
    />
  </label>

  {form.image && (
  <div className="space-y-2">
    <div className="text-sm text-zinc-400 break-all">
      Uploaded image: {form.image}
    </div>

    <Image
      src={form.image}
      alt="Product preview"
      width={240}
      height={240}
      unoptimized
      className="h-60 w-60 rounded-lg object-cover border border-zinc-700"
    />
  </div>
)}

</div>

<div className="space-y-2">
        <label className="block text-sm text-zinc-300">
          Image URL
        </label>

        <input
          placeholder="/products/example.jpg"
          value={form.image}
          onChange={(e) =>
            setForm({ ...form, image: e.target.value })
          }
          className="w-full p-2 bg-black text-white rounded"
          disabled={loading || uploading}
        />
      </div>

      <input
        placeholder="Category"
        value={form.category}
        onChange={(e) =>
          setForm({ ...form, category: e.target.value })
        }
        className="w-full p-2 bg-black text-white rounded"
        disabled={loading || uploading}
      />

      <input
        placeholder="Price"
        value={form.price}
        onChange={(e) =>
          setForm({ ...form, price: e.target.value })
        }
        className="w-full p-2 bg-black text-white rounded"
        disabled={loading || uploading}
      />

      <textarea
        placeholder="Description"
        value={form.description}
        onChange={(e) =>
          setForm({ ...form, description: e.target.value })
        }
        className="w-full p-2 bg-black text-white rounded"
        disabled={loading || uploading}
      />

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={loading || uploading}
          className="px-4 py-2 bg-amber-600 rounded disabled:bg-zinc-600"
        >
          {loading
            ? "Saving..."
            : editing
              ? "Update"
              : "Add"}
        </button>

        {editing && (
          <button
            type="button"
            onClick={onCancelEdit}
            disabled={loading || uploading}
            className="px-4 py-2 bg-zinc-700 rounded disabled:opacity-50"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}