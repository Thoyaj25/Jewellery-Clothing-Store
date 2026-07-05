"use client";

import { useState, type FormEvent, useEffect } from "react";
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
};

// 🧱 STEP 2: Explicit empty/default helper
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
  // 🧱 STEP 2: Initialize state
  const [form, setForm] = useState<FormState>(getEmptyForm());
  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // ✅ FIX 1: Add edit sync effect to populate form when `editing` prop changes
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

  // 🧱 STEP 3: Ensure submit mode switches correctly
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrors([]);

    const validation: string[] = [];
    if (form.name.trim().length < 2) validation.push("Name too short");
    const price = Number(form.price);
    if (Number.isNaN(price) || price < 0) validation.push("Invalid price");

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
          body: JSON.stringify({ ...form, price }),
        }
      );

      if (!res.ok) throw new Error("Request failed");

      // 🧱 STEP 4: Reset is correct after success
      setForm(getEmptyForm());
      onSuccess(); // Triggers parent refresh/re-wire
    } catch (err) {
      setErrors(["Failed to save product"]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-zinc-900 rounded space-y-2">
      <h2 className="text-white font-bold">{editing ? "Edit Product" : "Add Product"}</h2>
      
      {errors.length > 0 && (
        <div className="text-red-400 text-sm">
          {errors.map((e, i) => <div key={i}>{e}</div>)}
        </div>
      )}

      <input
        placeholder="Name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        className="w-full p-2 bg-black text-white"
        disabled={loading}
      />
      <input
        placeholder="Category"
        value={form.category}
        onChange={(e) => setForm({ ...form, category: e.target.value })}
        className="w-full p-2 bg-black text-white"
        disabled={loading}
      />
      <input
        placeholder="Price"
        value={form.price}
        onChange={(e) => setForm({ ...form, price: e.target.value })}
        className="w-full p-2 bg-black text-white"
        disabled={loading}
      />
      <input
        placeholder="Image URL"
        value={form.image}
        onChange={(e) => setForm({ ...form, image: e.target.value })}
        className="w-full p-2 bg-black text-white"
        disabled={loading}
      />
      <textarea
        placeholder="Description"
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
        className="w-full p-2 bg-black text-white"
        disabled={loading}
      />

      <div className="flex gap-2">
        <button 
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-amber-600 rounded disabled:bg-zinc-600"
        >
          {loading ? "Saving..." : (editing ? "Update" : "Add")}
        </button>

        {editing && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="px-4 py-2 bg-zinc-700 rounded"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}