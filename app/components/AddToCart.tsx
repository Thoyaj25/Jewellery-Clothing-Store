"use client";

import { ShoppingCart } from "lucide-react";
import { toast } from "react-toastify";
import { useCart } from "../context/CartProvider";

type Product = {
  id: string | number;
  name: string;
  price: number;
  image?: string;
};

export default function AddToCart({ product }: { product: Product }) {
  const { addItem } = useCart();

  const handleAddToCart = () => {
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
      aria-label={`Add ${product.name} to cart`}
      title="Add to Cart"
      className="mt-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-r from-amber-600 to-amber-500 text-black shadow-md transition-colors hover:from-amber-500 hover:to-amber-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400"
    >
      <ShoppingCart className="h-6 w-6" aria-hidden="true" />
    </button>
  );
}
