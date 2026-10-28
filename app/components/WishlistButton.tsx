"use client";

import { Heart } from "lucide-react";
import { toast } from "react-toastify";
import { useWishlist } from "../context/WishlistProvider";

type Product = {
  id: string | number;
  name: string;
  price: number;
  image?: string;
};

export default function WishlistButton({
  product,
}: {
  product: Product;
}) {
  const { isWishlisted, toggleWishlist, mounted } = useWishlist();

  if (!mounted) {
    return (
      <button
        type="button"
        disabled
        className="mt-4 flex h-12 w-12 items-center justify-center rounded-lg border-0 bg-zinc-800 text-gray-400"
      >
        <span aria-label="Loading wishlist">♡</span>
      </button>
    );
  }

  const wishlisted = isWishlisted(product.id);

  return (
    <button
      type="button"
      aria-pressed={wishlisted}
      onClick={() => {
        toggleWishlist(product);

        if (wishlisted) {
          toast.info(`${product.name} removed from wishlist.`, {
            containerId: "store",
            toastId: `wishlist-${product.id}`,
          });
        } else {
          toast.success(`${product.name} added to wishlist!`, {
            containerId: "store",
            toastId: `wishlist-${product.id}`,
          });
        }
      }}
      className={`mt-4 flex h-12 w-12 items-center justify-center rounded-lg border-0 transition-colors ${
        wishlisted
          ? "bg-amber-500 text-black"
          : "bg-zinc-800 text-amber-500 hover:bg-zinc-700"
      }`}
    >
      <Heart
        className={`h-6 w-6 ${wishlisted ? "fill-current" : ""}`}
        aria-hidden="true"
      />
    </button>
  );
}
