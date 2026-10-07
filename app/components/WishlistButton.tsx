"use client";

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
        className="mt-4 rounded-lg border border-amber-600/30 px-4 py-2 text-gray-400"
      >
        ♡ Wishlist
      </button>
    );
  }

  const wishlisted = isWishlisted(product.id);

  return (
    <button
      type="button"
      aria-pressed={wishlisted}
      onClick={() => toggleWishlist(product)}
      className={`mt-4 rounded-lg border px-4 py-2 font-medium transition ${
        wishlisted
          ? "border-amber-500 bg-amber-500 text-black"
          : "border-amber-600/50 text-amber-500 hover:bg-amber-600 hover:text-black"
      }`}
    >
      {wishlisted ? "♥ Remove from Wishlist" : "♡ Add to Wishlist"}
    </button>
  );
}
