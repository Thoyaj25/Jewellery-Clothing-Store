"use client";

import React from "react";
import { useCart } from "@/app/context/CartProvider";
import { InstagramIcon, WhatsAppIcon } from "@/app/components/SocialIcons";

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
    <div className="mt-4 flex items-center gap-4">
      {whatsappNumber && (
        <button
          type="button"
          onClick={openWhatsApp}
          aria-label="Order via WhatsApp"
          title="Order via WhatsApp"
          className="flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-md transition-transform hover:scale-110"
        >
          <WhatsAppIcon className="h-7 w-7" />
        </button>
      )}

      {instagramHandle && (
        <a
          href={`https://instagram.com/${instagramHandle}`}
          target="_blank"
          rel="noreferrer"
          aria-label="Message on Instagram"
          title="Message on Instagram"
          className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-tr from-purple-600 via-pink-500 to-orange-400 text-white shadow-md transition-transform hover:scale-110"
        >
          <InstagramIcon className="h-7 w-7" />
        </a>
      )}
    </div>
  );
}
