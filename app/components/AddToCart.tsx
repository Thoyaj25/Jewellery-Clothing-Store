"use client";

import { useCart } from "../context/CartProvider";

export default function AddToCart({ product }: { product: { id: string; name: string; price: number; image?: string } }) {
  const { addItem } = useCart();

  return (
    <div className="mt-4">
      <button
        onClick={() => addItem({ id: product.id, name: product.name, price: product.price, image: product.image })}
        className="rounded bg-indigo-600 text-white px-4 py-2 hover:bg-indigo-700"
      >
        Add to cart
      </button>
    </div>
  );
}
