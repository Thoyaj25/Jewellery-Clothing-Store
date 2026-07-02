"use client";

import Link from "next/link";
import { useCart } from "../context/CartProvider";
import Image from "next/image";

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

  return (
    <div className="group relative flex flex-col h-full bg-black/40 rounded-lg border border-amber-600/20 overflow-hidden hover:border-amber-600/50 transition-all duration-300 hover:shadow-lg hover:shadow-amber-600/10">
      {/* Product Image */}
      <Link href={`/product/${product.id}`} className="block w-full aspect-square overflow-hidden bg-gradient-to-br from-amber-950/20 to-black relative">
       <Image
  src={product.image}
  alt={product.name}
  width={500}
  height={500}
  className="w-full h-full object-cover md:group-hover:scale-110 transition-transform duration-300"
/>
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Badge */}
        {product.badge && (
          <div className="absolute top-3 right-3 bg-gradient-to-r from-amber-500 to-amber-600 text-black px-3 py-1 rounded-full text-xs font-semibold">
            {product.badge}
          </div>
        )}
      </Link>

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
            onClick={() =>
              addItem({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
              })
            }
            className="w-full px-4 py-3 md:py-2 bg-gradient-to-r from-amber-600 to-amber-500 text-black font-semibold rounded-lg hover:from-amber-500 hover:to-amber-400 transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-amber-600/30 text-sm"
          >
            Add to Cart
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
