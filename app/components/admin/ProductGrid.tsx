"use client";

import Image from "next/image";
import type { Product } from "@/src/types/product";

type Props = {
  products: Product[];
  onEdit: (p: Product) => void;
  onDelete: (id: number | string) => void;
};

export default function ProductGrid({ products, onEdit, onDelete }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {products.map((p) => (
        <div key={p.id} className="p-4 bg-zinc-900 rounded">
          <Image src={p.image} alt={p.name} width={80} height={80} />

          <div className="mt-2 font-semibold">{p.name}</div>
          <div className="text-sm text-zinc-400">{p.category}</div>
          <div className="text-amber-500">₹{p.price}</div>

          <div className="flex gap-2 mt-3">
            <button
              onClick={() => onEdit(p)}
              className="px-3 py-1 bg-blue-600 rounded"
            >
              Edit
            </button>

            <button
              onClick={() => onDelete(p.id)}
              className="px-3 py-1 bg-red-600 rounded"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}