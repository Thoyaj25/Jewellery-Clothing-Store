"use client";

import Image from "next/image";

import type { Product } from "@/src/types/product";

type Props = {
  product: Product;
  selected: boolean;
  onToggle: () => void;
  onEdit: (product: Product) => void;
  onDelete: (id: number | string) => void;
};

export default function InventoryRow({
  product,
  selected,
  onToggle,
  onEdit,
  onDelete,
}: Props) {
  return (
    <tr className="border-b border-zinc-800 hover:bg-zinc-900/40">
      <td className="px-4 py-3">
        <input
          type="checkbox"
          checked={selected}
          onChange={onToggle}
        />
      </td>

      <td className="px-4 py-3">
        <Image
          src={product.image}
          alt={product.name}
          width={56}
          height={56}
          className="rounded-lg object-cover"
        />
      </td>

      <td className="px-4 py-3">
        <div className="font-medium">{product.name}</div>

        <div className="text-sm text-zinc-400 line-clamp-2">
          {product.description}
        </div>
      </td>

      <td className="px-4 py-3">
        <span className="rounded-full bg-zinc-800 px-3 py-1 text-xs">
          {product.category}
        </span>
      </td>

      <td className="px-4 py-3 text-right">
        ₹{product.price}
      </td>

      <td className="px-4 py-3">
        <div className="flex justify-center gap-2">
          <button
            onClick={() => onEdit(product)}
            className="rounded bg-blue-600 px-3 py-1 text-sm"
          >
            Edit
          </button>

          <button
            onClick={() => onDelete(product.id)}
            className="rounded bg-red-600 px-3 py-1 text-sm"
          >
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
}