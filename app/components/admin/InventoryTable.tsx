"use client";

import { useState } from "react";
import Image from "next/image";
import type { Product } from "@/src/types/product";

type Props = {
  products: Product[];
  loading?: boolean;
  onEdit: (p: Product) => void;
  onDelete: (id: number | string) => void;
  onBulkDelete?: (ids: (number | string)[]) => void; // Optional bulk action
};

export default function InventoryTable({
  products,
  loading = false,
  onEdit,
  onDelete,
  onBulkDelete,
}: Props) {
  // 🧱 STEP 14.1 — Add selection state
  const [selectedIds, setSelectedIds] = useState<Set<number | string>>(new Set());

  // 🧱 STEP 14.2 — Helper functions
  const toggleSelect = (id: number | string) => {
    const next = new Set(selectedIds);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelectedIds(next);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === products.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(products.map((p) => p.id)));
    }
  };

  const SkeletonRow = () => (
    <tr className="border-t border-zinc-800 animate-pulse">
      <td className="p-3"><div className="w-4 h-4 bg-zinc-800 rounded"></div></td>
      <td className="p-3 flex items-center gap-3">
        <div className="w-10 h-10 bg-zinc-800 rounded"></div>
        <div className="space-y-2"><div className="h-3 w-24 bg-zinc-800 rounded"></div></div>
      </td>
      <td className="p-3"><div className="h-4 w-20 bg-zinc-800 rounded"></div></td>
      <td className="p-3"><div className="h-4 w-12 bg-zinc-800 rounded"></div></td>
      <td className="p-3"><div className="h-6 w-20 bg-zinc-800 rounded"></div></td>
    </tr>
  );

  return (
    <div className="w-full overflow-x-auto rounded-lg border border-zinc-800">
      {/* 🧱 STEP 14.5 — Add action bar */}
      {selectedIds.size > 0 && (
        <div className="flex items-center justify-between p-3 bg-zinc-800 border-b border-zinc-700">
          <span className="text-sm text-white font-medium">{selectedIds.size} selected</span>
          {onBulkDelete && (
            <button
              onClick={() => onBulkDelete(Array.from(selectedIds))}
              className="px-3 py-1 bg-red-600 rounded text-xs text-white hover:bg-red-500"
            >
              Delete Selected
            </button>
          )}
        </div>
      )}

      <table className="w-full text-sm">
        <thead className="bg-zinc-900 text-zinc-300">
          <tr>
            {/* 🧱 STEP 14.3 — Add checkbox column */}
            <th className="p-3 w-10">
              <input
                type="checkbox"
                checked={selectedIds.size === products.length && products.length > 0}
                onChange={toggleSelectAll}
                className="rounded border-zinc-700"
              />
            </th>
            <th className="text-left p-3">Product</th>
            <th className="text-left p-3">Category</th>
            <th className="text-left p-3">Price</th>
            <th className="text-left p-3">Actions</th>
          </tr>
        </thead>

        <tbody>
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
          ) : (
            products.map((p) => (
              <tr key={p.id} className="border-t border-zinc-800 hover:bg-zinc-900/60">
                {/* 🧱 STEP 14.4 — Add row checkbox */}
                <td className="p-3">
                  <input
                    type="checkbox"
                    checked={selectedIds.has(p.id)}
                    onChange={() => toggleSelect(p.id)}
                    className="rounded border-zinc-700"
                  />
                </td>
                <td className="p-3 flex items-center gap-3">
                  <Image src={p.image} alt={p.name} width={40} height={40} className="rounded object-cover" />
                  <div>
                    <div className="font-medium text-white">{p.name}</div>
                    <div className="text-xs text-zinc-400">ID: {p.id}</div>
                  </div>
                </td>
                <td className="p-3 text-zinc-300">{p.category}</td>
                <td className="p-3 text-amber-500 font-medium">₹{p.price}</td>
                <td className="p-3 flex gap-2">
                  <button onClick={() => onEdit(p)} className="px-3 py-1 bg-blue-600 rounded text-xs text-white hover:bg-blue-500">Edit</button>
                  <button onClick={() => onDelete(p.id)} className="px-3 py-1 bg-red-600 rounded text-xs text-white hover:bg-red-500">Delete</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}