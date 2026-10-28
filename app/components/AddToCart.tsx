"use client";

import { ShoppingCart } from "lucide-react";
import { toast } from "react-toastify";
import { useCart } from "../context/CartProvider";

type Product = {
  id: string | number;
  name: string;
  price: number;
  image?: string;
  stockQuantity?: number | null;
};

export default function AddToCart({ product }: { product: Product }) {
  const { addItem } = useCart();

  const outOfStock = product.stockQuantity === 0;

  const handleAddToCart = () => {
    if (outOfStock) return;

    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    });

    toast.success(`${product.name} added to cart!`, {
      containerId: "store",
      toastId: `cart-${product.id}`,
    });
  };

  return (
    <button
      type="button"
      onClick={handleAddToCart}
      disabled={outOfStock}
      aria-label={outOfStock ? `${product.name} is out of stock` : `Add ${product.name} to cart`}
      title={outOfStock ? "Out of Stock" : "Add to Cart"}
      className="mt-4 flex h-12 min-w-12 px-2 items-center justify-center disabled:cursor-not-allowed disabled:opacity-50 rounded-lg bg-gradient-to-r from-amber-600 to-amber-500 text-black shadow-md transition-colors hover:from-amber-500 hover:to-amber-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400"
    >
      {outOfStock ? (
        <span className="text-xs font-semibold">Out of Stock</span>
      ) : (
        <ShoppingCart className="h-6 w-6" aria-hidden="true" />
      )}
    </button>
  );
}
