"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "../context/CartProvider";
import { useWishlist } from "../context/WishlistProvider";

export default function WishlistPage() {
  const { items, removeFromWishlist, clearWishlist, mounted } =
    useWishlist();
  const { addItem } = useCart();

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-zinc-900 to-black text-white">
        <div className="mx-auto flex min-h-[60vh] max-w-7xl items-center justify-center px-6">
          <p className="text-lg text-zinc-400">Loading wishlist...</p>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-zinc-900 to-black text-white">
        <div className="mx-auto flex min-h-[60vh] max-w-7xl flex-col items-center justify-center px-6 text-center">
          <div className="mb-4 text-6xl">♡</div>

          <h1 className="mb-2 text-3xl font-bold text-white">
            Your Wishlist is Empty
          </h1>

          <p className="mb-6 text-zinc-400">
            Save your favorite products here and come back to them anytime.
          </p>

          <Link
            href="/products"
            className="rounded-lg bg-gradient-to-r from-amber-600 to-amber-500 px-8 py-3 font-semibold text-black transition-all hover:from-amber-500 hover:to-amber-400"
          >
            Explore Collections
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-zinc-900 to-black text-white">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="mb-2 text-3xl font-bold text-white">
              My Wishlist
            </h1>

            <p className="text-zinc-400">
              {items.length} saved item{items.length !== 1 ? "s" : ""}
            </p>
          </div>

          <button
            type="button"
            onClick={clearWishlist}
            className="self-start text-sm font-medium text-red-500 transition-colors hover:text-red-400 sm:self-auto"
          >
            Clear Wishlist
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((item) => (
            <article
              key={item.id}
              className="overflow-hidden rounded-2xl border border-amber-600/20 bg-black/40 transition-all duration-300 hover:border-amber-600/50 hover:shadow-lg hover:shadow-amber-600/10"
            >
              <Link
                href={`/product/${item.id}`}
                className="block aspect-square overflow-hidden bg-gradient-to-br from-amber-950/20 to-black"
              >
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={500}
                    height={500}
                    className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-zinc-500">
                    No image
                  </div>
                )}
              </Link>

              <div className="p-4">
                <Link href={`/product/${item.id}`}>
                  <h2 className="mb-3 line-clamp-2 min-h-[3rem] text-lg font-light text-white transition-colors hover:text-amber-600">
                    {item.name}
                  </h2>
                </Link>

                <p className="mb-4 text-xl font-light text-amber-600">
                  ₹{item.price.toLocaleString("en-IN")}
                </p>

                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() =>
                      addItem({
                        id: item.id,
                        name: item.name,
                        price: item.price,
                        image: item.image,
                      })
                    }
                    className="w-full rounded-lg bg-gradient-to-r from-amber-600 to-amber-500 px-4 py-3 text-sm font-semibold text-black transition-all hover:from-amber-500 hover:to-amber-400"
                  >
                    Add to Cart
                  </button>

                  <button
                    type="button"
                    onClick={() => removeFromWishlist(item.id)}
                    className="w-full rounded-lg border border-amber-600/30 px-4 py-3 text-sm font-light text-amber-600 transition-colors hover:bg-amber-600/10"
                  >
                    Remove from Wishlist
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
