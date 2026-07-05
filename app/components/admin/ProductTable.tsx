"use client";

import Image from "next/image";
import type { Product } from "@/src/types/product";

type Props = {
  products: Product[];
  onEdit: (p: Product) => void;
  onDelete: (id: number | string) => void;
};

export default function ProductTable({
  products,
  onEdit,
  onDelete,
}: Props) {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        
        {/* ================= HEADER ================= */}
        <thead className="bg-zinc-900 text-zinc-300">
          <tr className="text-left border-b border-zinc-800">
            <th className="p-3">Product</th>
            <th className="p-3">Category</th>
            <th className="p-3">Price</th>
            <th className="p-3">Status</th>
            <th className="p-3 text-right">Actions</th>
          </tr>
        </thead>

        {/* ================= BODY ================= */}
        <tbody>
          {products.map((p) => (
            <tr
              key={p.id}
              className="border-b border-zinc-800 hover:bg-zinc-900/60 transition"
            >
              {/* Product cell */}
              <td className="p-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 relative rounded overflow-hidden bg-zinc-800">
                    <Image
                      src={p.image}
                      alt={p.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="min-w-0">
                    <div className="font-medium truncate">{p.name}</div>
                    <div className="text-xs text-zinc-400 truncate">
                      ID: {p.id}
                    </div>
                  </div>
                </div>
              </td>

              {/* Category */}
              <td className="p-3 text-zinc-300">
                {p.category || "—"}
              </td>

              {/* Price */}
              <td className="p-3 text-amber-500 font-medium">
                ₹{p.price}
              </td>

              {/* Status (derived field) */}
              <td className="p-3">
                <span
                  className={
                    "px-2 py-1 rounded text-xs font-medium " +
                    (p.price > 0
                      ? "bg-green-900/40 text-green-400"
                      : "bg-red-900/40 text-red-400")
                  }
                >
                  {p.price > 0 ? "Active" : "Invalid"}
                </span>
              </td>

              {/* Actions */}
              <td className="p-3">
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => onEdit(p)}
                    className="px-3 py-1 text-xs bg-blue-600 rounded hover:bg-blue-500"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => onDelete(p.id)}
                    className="px-3 py-1 text-xs bg-red-600 rounded hover:bg-red-500"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* empty state */}
      {products.length === 0 && (
        <div className="text-center py-10 text-zinc-500">
          No products found
        </div>
      )}
    </div>
  );
}