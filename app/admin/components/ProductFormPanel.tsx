"use client";

import { useState, type FormEvent, useEffect, type ChangeEvent } from "react";
import type { Product } from "@/src/types/product";

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
  isVisible: boolean;
};

const getEmptyForm = (): FormState => ({
  name: "",
  category: "",
  price: "",
  image: "",
  description: "",
  isVisible: true,
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
  const [preview, setPreview] = useState("");

  useEffect(() => {
    if (editing) {
      setForm({
        name: editing.name,
        category: editing.category,
        price: editing.price.toString(),
        image: editing.image,
        description: editing.description ?? "",
        isVisible: editing.isVisible ?? true,
      });
      setPreview(editing.image);
    } else {
      setForm(getEmptyForm());
      setPreview("");
    }
  }, [editing]);

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setErrors([]);

    if (!file.type.startsWith("image/")) {
      setErrors(["Only image files are allowed."]);
      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrors(["Image must be 5 MB or smaller."]);
      e.target.value = "";
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
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

      setPreview(data.url);
    } catch (error) {
      console.error("IMAGE UPLOAD ERROR:", error);
      setErrors([
        error instanceof Error
          ? error.message
          : "Failed to upload image.",
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
      validation.push("Please upload an image or enter an image URL");
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
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...form,
            price,
            isVisible: form.isVisible,
          }),
        }
      );

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Request failed");
      }

      setForm(getEmptyForm());
      setPreview("");
      onSuccess();
    } catch (err) {
      console.error("PRODUCT SAVE ERROR:", err);
      setErrors([
        err instanceof Error ? err.message : "Failed to save product",
      ]);
    } finally {
      setLoading(false);
    }
  };

  const busy = loading || uploading;

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 bg-zinc-900 rounded space-y-2"
    >
      <h2 className="text-white font-bold">
        {editing ? "Edit Product" : "Add Product"}
      </h2>

      {errors.length > 0 && (
        <div className="text-red-400 text-sm">
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
            className="w-full p-2 bg-black text-white"
            disabled={busy}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm text-zinc-300">
            Product Image
          </label>

          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            disabled={busy}
            className="w-full p-2 bg-black text-white file:mr-3 file:rounded file:border-0 file:bg-amber-600 file:px-3 file:py-2 file:text-white"
          />

          {uploading && (
            <p className="text-amber-400 text-sm">
              Uploading image...
            </p>
          )}

          {preview && (
            <div className="mt-2">
              <img
                src={preview}
                alt="Product preview"
                className="h-40 w-40 rounded object-cover border border-zinc-700"
              />
            </div>
          )}

          <input
            placeholder="Or enter Image URL"
            value={form.image}
            onChange={(e) => {
              setForm({ ...form, image: e.target.value });
              setPreview(e.target.value);
            }}
            className="w-full p-2 bg-black text-white"
            disabled={busy}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm text-zinc-300">
            Price
          </label>

          <input
            placeholder="Enter product price"
            type="number"
            min="0"
            step="0.01"
            value={form.price}
            onChange={(e) =>
              setForm({ ...form, price: e.target.value })
            }
            className="w-full p-2 bg-black text-white"
            disabled={busy}
          />
        </div>

        <input
          placeholder="Category"
          value={form.category}
          onChange={(e) =>
            setForm({ ...form, category: e.target.value })
          }
          className="w-full p-2 bg-black text-white"
          disabled={busy}
        />

        <label className="flex items-center gap-2 text-sm text-zinc-300">
          <input
            type="checkbox"
            checked={form.isVisible}
            onChange={(e) => setForm({ ...form, isVisible: e.target.checked })}
            disabled={busy}
          />
          Visible on website
        </label>

        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
          className="w-full p-2 bg-black text-white"
          disabled={busy}
        />

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={busy}
          className="px-4 py-2 bg-amber-600 rounded disabled:bg-zinc-600"
        >
          {uploading
            ? "Uploading..."
            : loading
              ? "Saving..."
              : editing
                ? "Update"
                : "Add"}
        </button>

        {editing && (
          <button
            type="button"
            onClick={onCancelEdit}
            disabled={busy}
            className="px-4 py-2 bg-zinc-700 rounded disabled:bg-zinc-600"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
