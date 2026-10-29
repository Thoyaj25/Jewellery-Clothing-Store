"use client";

import Link from "next/link";
import { useCart } from "../context/CartProvider";
import { useWishlist } from "../context/WishlistProvider";
import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import { toast } from "react-toastify";

import type { Product } from "@/src/types/product";

export default function ProductCard({
  product,
  whatsappNumber,
  instagramHandle,
}: {
  product: Product;
  whatsappNumber?: string;
  instagramHandle?: string;
}) {
  const { addItem } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();

  const wishlisted = isWishlisted(product.id);

  const stock = product.stockQuantity;

  const stockLabel =
    stock == null
      ? null
      : stock === 0
        ? "Out of Stock"
        : stock === 1
          ? "Only 1 Left"
          : "In Stock";

  const stockStyle =
    stock === 0
      ? "bg-red-950 text-red-300 border-red-800/50"
      : stock === 1
        ? "bg-amber-950 text-amber-300 border-amber-700/50"
        : "bg-emerald-950 text-emerald-300 border-emerald-800/50";

  return (
    <div className="group relative flex flex-col h-full bg-zinc-950/70 rounded-xl border border-amber-600/15 overflow-hidden hover:border-amber-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-amber-600/10">
      {/* Product Image */}
      <Link href={`/product/${product.id}`} className="block w-full aspect-square overflow-hidden bg-gradient-to-br from-amber-950/20 to-black relative">
       <Image
  src={product.image}
  alt={product.name}
  width={500}
  height={500}
  className="w-full h-full object-cover md:group-hover:scale-105 transition-transform duration-300"
/>
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Badge */}
        {product.badge && (
          <div className="absolute top-3 right-3 bg-gradient-to-r from-amber-500 to-amber-600 text-black px-3 py-1 rounded-full text-xs font-semibold">
            {product.badge}
          </div>
        )}
      </Link>

      {/* Customer-facing stock availability */}
      {stockLabel && (
        <div className="px-3 pt-3 md:px-4">
          <span
            className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${stockStyle}`}
          >
            {stockLabel}
          </span>
        </div>
      )}

      {/* Wishlist */}
        <button
          type="button"
          aria-label={
            wishlisted
              ? `Remove ${product.name} from wishlist`
              : `Add ${product.name} to wishlist`
          }
          aria-pressed={wishlisted}
          onClick={() => {
            toggleWishlist({
              id: product.id,
              name: product.name,
              price: product.price,
              image: product.image,
            });

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
          className="absolute top-3 left-3 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-black/70 border-0 text-xl text-amber-500 backdrop-blur-sm hover:bg-amber-600 hover:text-black transition-all duration-200"
        >
          {wishlisted ? "♥" : "♡"}
        </button>

        {/* Product Info */}
      <div className="p-3 md:p-4 flex flex-col flex-1">
        <Link href={`/product/${product.id}`} className="block">
          <h3 className="text-white font-light text-base md:text-lg tracking-tight hover:text-amber-600 transition-colors mb-2 line-clamp-2 min-h-[3rem]">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center justify-between mb-4">
          <span className="text-xl md:text-2xl font-light text-amber-600">
            ₹{product.price.toLocaleString("en-IN")}
          </span>
          <span className="text-xs text-gray-400 font-light">Premium</span>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 mt-auto">
          <button
            type="button"
            aria-label={
              stock === 0
                ? `${product.name} is out of stock`
                : `Add ${product.name} to cart`
            }
            title={stock === 0 ? "Out of Stock" : "Add to Cart"}
            disabled={stock === 0}
            onClick={() => {
              if (stock === 0) return;
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
            }}
            className="w-full px-4 py-3 md:py-2 bg-gradient-to-r from-amber-600 to-amber-500 text-black font-semibold rounded-lg hover:from-amber-500 hover:to-amber-400 transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-amber-600/30 text-sm disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
          >
            {stock === 0 ? (
              <span>Out of Stock</span>
            ) : (
              <ShoppingCart className="mx-auto h-5 w-5" aria-hidden="true" />
            )}
          </button>
          <Link
            href={`/product/${product.id}`}
            className="block w-full text-center px-4 py-3 md:py-2 border border-amber-600/30 text-amber-600 font-light rounded-lg hover:bg-amber-600/10 transition-colors text-sm"
          >
            View Details
          </Link>
          {/* Ordering via WhatsApp / Instagram - values passed from server page */}
          {whatsappNumber && (
            <a
              href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                `Hi, I'm interested in ${product.name} (ID: ${product.id}). Please share details.`
              )}`}
              target="_blank"
              rel="noreferrer"
              className="block w-full text-center px-4 py-3 md:py-2 border border-amber-600/30 text-black bg-amber-100 rounded-lg hover:bg-amber-200 transition-colors text-sm"
            >
              Order via WhatsApp
            </a>
          )}
          {instagramHandle && (
            <a
              href={`https://instagram.com/${instagramHandle}`}
              target="_blank"
              rel="noreferrer"
              className="block w-full text-center px-4 py-3 md:py-2 border border-amber-600/30 text-white bg-gradient-to-r from-pink-500 to-pink-400 rounded-lg hover:opacity-90 transition-colors text-sm"
            >
              Message on Instagram
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
