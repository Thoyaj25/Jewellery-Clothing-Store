"use client";

import React from "react";
import { useCart } from "@/app/context/CartProvider";

export default function OrderButtons({
  product,
  whatsappNumber,
  instagramHandle,
}: {
  product: { id: string | number; name: string; price: number };
  whatsappNumber?: string;
  instagramHandle?: string;
}) {
  const { items } = useCart();

  const buildMessage = () => {
    const lines: string[] = [];
    lines.push(`Hello, I would like to order the following items:`);

    // include cart items first
    if (items.length > 0) {
      items.forEach((it) => {
        lines.push(`- ${it.name} (ID: ${it.id}) x ${it.quantity} — ₹${(
          it.price * it.quantity
        ).toLocaleString("en-IN")}`);
      });
    }

    // include the product page item if it's not in cart
    const inCart = items.some((it) => String(it.id) === String(product.id));
    if (!inCart) {
      lines.push(`- ${product.name} (ID: ${product.id}) x 1 — ₹${product.price.toLocaleString("en-IN")}`);
    }

    const total = items.reduce((s, it) => s + it.price * it.quantity, 0) + (inCart ? 0 : product.price);
    lines.push(`Total (approx): ₹${total.toLocaleString("en-IN")}`);

    lines.push(`Please confirm availability and delivery options.`);
    return lines.join("\n");
  };

  const openWhatsApp = () => {
    if (!whatsappNumber) return;
    const msg = buildMessage();
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="space-y-2 mt-4">
      {whatsappNumber && (
        <button
          onClick={openWhatsApp}
          className="w-full px-4 py-3 bg-emerald-500 text-black font-semibold rounded-lg hover:bg-emerald-400"
        >
          Order via WhatsApp
        </button>
      )}

      {instagramHandle && (
        <a
          href={`https://instagram.com/${instagramHandle}`}
          target="_blank"
          rel="noreferrer"
          className="block w-full text-center px-4 py-3 border border-pink-400 text-white bg-gradient-to-r from-pink-500 to-pink-400 rounded-lg"
        >
          Message on Instagram
        </a>
      )}
    </div>
  );
}
