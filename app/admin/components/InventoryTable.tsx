"use client";

import Image from "next/image";
import type { Product } from "@/src/types/product";
import { useState, useMemo } from "react";
// 🧱 STEP 17.4 — Fix the import using the correct alias path
import { toggleProductVisibility } from "../services/adminApi";
import { toast } from "react-toastify";

type Props = {
  products: Product[];
  loading?: boolean;
  onEdit: (product: Product) => void;
};

export default function InventoryTable({
  products,
  loading = false,
  onEdit,
}: Props) {
  const [selected, setSelected] = useState<Set<number | string>>(new Set());
  const [filterCategory, setFilterCategory] = useState<string>("All");
  const [visibilityOverrides, setVisibilityOverrides] = useState<
    Map<number | string, boolean>
  >(new Map());

  const categories = useMemo(() => {
    const unique = Array.from(new Set(products.map((p) => p.category)));
    return ["All", ...unique];
  }, [products]);

  const filteredProducts = useMemo(() => {
    if (filterCategory === "All") return products;
    return products.filter((p) => p.category === filterCategory);
  }, [products, filterCategory]);

  const toggleSelect = (id: number | string) => {
    const next = new Set(selected);

    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }

    setSelected(next);
  };

  const selectAll = () => {
    if (selected.size === filteredProducts.length && filteredProducts.length > 0) {
      setSelected(new Set());
    } else {
      setSelected(new Set(filteredProducts.map((p) => p.id)));
    }
  };

  const clearSelection = () => setSelected(new Set());

  const handleVisibilityToggle = async (product: Product) => {
    const currentVisibility =
      visibilityOverrides.get(product.id) ?? product.isVisible ?? true;
    const nextVisibility = !currentVisibility;
    const toastId = toast.loading(nextVisibility ? "Showing product on site..." : "Hiding product from site...");

    try {
      const updatedProduct = await toggleProductVisibility(
        product.id,
        nextVisibility
      );

      setVisibilityOverrides((prev) => {
        const next = new Map(prev);
        next.set(product.id, updatedProduct.isVisible);
        return next;
      });
      toast.update(toastId, {
        render: nextVisibility ? "Product is now visible" : "Product is hidden",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });
    } catch (err) {
      console.error("Visibility update failed:", err);
      toast.update(toastId, {
        render: "Visibility update failed",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  const SkeletonRow = () => (
    <tr className="border-t border-zinc-800 animate-pulse">
      <td className="p-3"><div className="w-4 h-4 bg-zinc-800 rounded"></div></td>
      <td className="p-3 flex items-center gap-3">
        <div className="w-10 h-10 rounded bg-zinc-800"></div>
        <div className="space-y-2">
          <div className="h-3 w-24 bg-zinc-800 rounded"></div>
          <div className="h-2 w-32 bg-zinc-800 rounded"></div>
        </div>
      </td>
      <td className="p-3"><div className="h-3 w-16 bg-zinc-800 rounded"></div></td>
      <td className="p-3 text-right"><div className="h-3 w-12 bg-zinc-800 rounded ml-auto"></div></td>
      <td className="p-3 text-right"><div className="h-7 w-20 bg-zinc-800 rounded ml-auto"></div></td>
    </tr>
  );

  return (
    <div className="w-full rounded-lg border border-zinc-800 overflow-hidden">
      <div className="flex items-center justify-between p-3 bg-zinc-900 border-b border-zinc-800">
        <div className="flex items-center gap-4">
          <select
            value={filterCategory}
            onChange={(e) => { setFilterCategory(e.target.value); clearSelection(); }}
            className="bg-zinc-800 text-xs px-2 py-1 rounded border border-zinc-700"
          >
            {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
          </select>

        </div>

        <div className="flex items-center gap-4">
          <span className="text-xs text-zinc-400">{selected.size} selected</span>
          <button
            onClick={selectAll}
            className="text-xs px-3 py-1 bg-zinc-800 rounded hover:bg-zinc-700"
          >
            {selected.size === filteredProducts.length && filteredProducts.length > 0
              ? "Deselect All"
              : "Select All"}
          </button>
        </div>
      </div>

      <table className="w-full text-sm text-left text-zinc-300">
        <thead className="bg-zinc-900 text-zinc-400 uppercase text-xs">
          <tr>
            <th className="p-3 w-10"></th>
            <th className="p-3">Product</th>
            <th className="p-3">Category</th>
            <th className="p-3 text-right">Price</th>
            <th className="p-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
          ) : (
            filteredProducts.map((product) => (
              <tr key={product.id} className="border-t border-zinc-800 hover:bg-zinc-900/60">
                <td className="p-3">
                  <input type="checkbox" checked={selected.has(product.id)} onChange={() => toggleSelect(product.id)} />
                </td>
                <td className="p-3 flex items-center gap-3">
                  <div className="w-10 h-10 rounded overflow-hidden bg-zinc-800">
                    <Image src={product.image} alt={product.name} width={40} height={40} />
                  </div>
                  <div>
                    <div className="font-medium text-white">{product.name}</div>
                    <div className="text-xs text-zinc-500 truncate max-w-[220px]">{product.description ?? "No description"}</div>
                  </div>
                </td>
                <td className="p-3 text-zinc-400">{product.category}</td>
                <td className="p-3 text-right text-amber-500 font-medium">₹{product.price}</td>
                <td className="p-3 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => handleVisibilityToggle(product)}
                      className={`px-3 py-1 text-xs rounded ${(visibilityOverrides.get(product.id) ?? product.isVisible ?? true) === false ? "bg-amber-600 hover:bg-amber-500" : "bg-emerald-600 hover:bg-emerald-500"}`}
                    >
                      {(visibilityOverrides.get(product.id) ?? product.isVisible ?? true) === false ? "Show" : "Hide"}
                    </button>
                    <button onClick={() => onEdit(product)} className="px-3 py-1 text-xs rounded bg-blue-600 hover:bg-blue-500">Edit</button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
