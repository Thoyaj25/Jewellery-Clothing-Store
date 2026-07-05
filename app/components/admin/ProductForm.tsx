"use client";

import type { FormEvent } from "react";

export type ProductFormState = {
  name: string;
  category: string;
  price: string;
  image: string;
  description: string;
};

type Props = {
  form: ProductFormState;
  setForm: React.Dispatch<React.SetStateAction<ProductFormState>>;
  editing: boolean;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
  errors: string[];
};

export default function ProductForm({
  form,
  setForm,
  editing,
  onSubmit,
  onCancel,
  errors,
}: Props) {
  return (
    <div className="p-4 bg-zinc-900 rounded">
      <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-3">

        {errors.length > 0 && (
          <div className="md:col-span-4 p-3 bg-red-900/60 text-red-200 rounded">
            <ul className="list-disc pl-5">
              {errors.map((e, i) => (
                <li key={i}>{e}</li>
              ))}
            </ul>
          </div>
        )}

        <input
          value={form.name}
          onChange={(e) => setForm(p => ({ ...p, name: e.target.value }))}
          placeholder="Name"
          className="p-2 bg-black rounded"
        />

        <input
          value={form.category}
          onChange={(e) => setForm(p => ({ ...p, category: e.target.value }))}
          placeholder="Category"
          className="p-2 bg-black rounded"
        />

        <input
          value={form.price}
          onChange={(e) => setForm(p => ({ ...p, price: e.target.value }))}
          placeholder="Price"
          className="p-2 bg-black rounded"
        />

        <input
          value={form.image}
          onChange={(e) => setForm(p => ({ ...p, image: e.target.value }))}
          placeholder="Image"
          className="p-2 bg-black rounded"
        />

        <textarea
          value={form.description}
          onChange={(e) => setForm(p => ({ ...p, description: e.target.value }))}
          placeholder="Description"
          className="md:col-span-4 p-2 bg-black rounded"
        />

        <div className="md:col-span-4 flex gap-2">
          <button className="px-4 py-2 bg-amber-600 rounded">
            {editing ? "Update" : "Add"} Product
          </button>

          {editing && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 bg-zinc-700 rounded"
            >
              Cancel
            </button>
          )}
        </div>

      </form>
    </div>
  );
}
