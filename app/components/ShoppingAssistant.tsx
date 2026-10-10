"use client";

import Link from "next/link";
import { useState } from "react";

const questions = [
  {
    label: "🛍️ Shop Products",
    answer: "Explore our jewellery, handbags, sarees, kurtis and fashion collections.",
    href: "/products",
    action: "Browse Products",
  },
  {
    label: "🚚 Shipping & Delivery",
    answer: "Shipping is ₹100 below ₹2,000. Orders of ₹2,000 or more qualify for free shipping, subject to delivery serviceability. Delivery estimates are confirmed through WhatsApp.",
    href: "/shipping-policy",
    action: "Shipping Policy",
  },
  {
    label: "↩️ Returns & Refunds",
    answer: "Please report damaged, defective or incorrect products preferably within 48 hours. This does not limit your statutory rights. We review eligible returns and refunds according to our policy.",
    href: "/returns-refunds",
    action: "Returns Policy",
  },
  {
    label: "📦 How to Order",
    answer: "Add your favourite products to your cart, proceed to checkout and send an order request through WhatsApp. Our team confirms availability, delivery and payment arrangements.",
    href: "/cart",
    action: "View Cart",
  },
  {
    label: "📍 Track My Order",
    answer: "Live order tracking is not yet available. Contact our support team with your order details for delivery updates.",
    href: "/contact",
    action: "Contact Support",
  },
  {
    label: "💬 Customer Support",
    answer: "Our team can help with product enquiries, orders, delivery questions and after-sales support.",
    href: "/contact",
    action: "Contact Us",
  },
];

export default function ShoppingAssistant() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <div className="fixed bottom-5 left-4 z-40 sm:bottom-6 sm:left-6">
      {open && (
        <section
          aria-label="ULTIMA Shopping Assistant"
          className="mb-3 flex max-h-[min(70dvh,520px)] w-[min(340px,calc(100vw-32px))] flex-col overflow-hidden rounded-2xl border border-amber-500/40 bg-zinc-950 text-white shadow-2xl"
        >
          <div className="flex items-center justify-between border-b border-amber-500/30 bg-gradient-to-r from-zinc-950 via-amber-950/40 to-zinc-950 px-4 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full border border-amber-400 bg-gradient-to-br from-amber-200 to-amber-600 text-xl text-black">
                ◆
              </div>
              <div>
                <p className="font-bold tracking-widest text-amber-300">
                  ULTIMA
                </p>
                <p className="text-[11px] text-amber-100/70">
                  Your Ultimate Shopping Companion
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close ULTIMA"
              className="rounded-lg border border-amber-500/30 px-2 py-1 text-lg text-amber-200 hover:bg-amber-500/10 focus-visible:outline-2 focus-visible:outline-amber-300"
            >
              ×
            </button>
          </div>

          <div className="space-y-4 overflow-y-auto bg-gradient-to-b from-zinc-950 to-stone-950 p-4">
            <div className="max-w-[95%] rounded-2xl rounded-tl-sm border border-amber-500/20 bg-zinc-800/80 p-3 shadow-sm">
              <p className="text-sm leading-relaxed text-amber-50">
                Namaste! 👋 I'm ULTIMA, your shopping companion.
                How may I help you today?
              </p>
            </div>

            <p className="text-[10px] font-bold tracking-widest text-amber-300">
              EXPLORE OUR SERVICES
            </p>

            <div className="grid grid-cols-2 gap-2">
              {questions.map((question, index) => (
                <button
                  key={question.label}
                  type="button"
                  onClick={() => setSelected(index)}
                  aria-pressed={selected === index}
                  className="min-h-14 rounded-xl border border-amber-600/40 bg-gradient-to-br from-stone-900 to-zinc-950 p-3 text-left text-xs font-medium leading-relaxed text-amber-100 transition hover:border-amber-300 hover:bg-amber-900/20 focus-visible:outline-2 focus-visible:outline-amber-400 aria-pressed:border-amber-300 aria-pressed:bg-amber-900/30"
                >
                  {question.label}
                </button>
              ))}
            </div>

            {selected !== null && (
              <div aria-live="polite" className="space-y-3 text-sm">
                <div className="flex justify-end">
                  <p className="max-w-[85%] rounded-2xl rounded-tr-sm bg-amber-800/70 px-3 py-2 font-medium text-amber-50">
                    {questions[selected].label}
                  </p>
                </div>

                <div className="max-w-[95%] space-y-3 rounded-2xl rounded-tl-sm border border-amber-500/20 bg-zinc-800/80 p-3">
                  <p className="leading-relaxed text-zinc-100">
                    {questions[selected].answer}
                  </p>
                  <Link
                    href={questions[selected].href}
                    onClick={() => setOpen(false)}
                    className="inline-block font-semibold text-amber-300 underline underline-offset-4 hover:text-amber-200"
                  >
                    {questions[selected].action} →
                  </Link>
                </div>

                <button
                  type="button"
                  onClick={() => setSelected(null)}
                  className="w-full rounded-xl border border-amber-500/40 px-3 py-2 font-medium text-amber-300 hover:bg-amber-500/10 focus-visible:outline-2 focus-visible:outline-amber-400"
                >
                  ← Back to Menu
                </button>
              </div>
            )}
          </div>
        </section>
      )}

      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-label={open ? "Close ULTIMA" : "Chat with ULTIMA"}
        aria-expanded={open}
        title={open ? "Close ULTIMA" : "Chat with ULTIMA"}
        className="flex h-14 w-14 rotate-45 items-center justify-center rounded-lg border-2 border-amber-200 bg-gradient-to-br from-yellow-200 via-amber-400 to-amber-700 text-black shadow-[0_4px_24px_rgba(217,119,6,0.4)] transition-transform duration-200 hover:scale-110 focus-visible:outline-2 focus-visible:outline-white"
      >
        <span aria-hidden="true" className="-rotate-45 text-2xl">
          {open ? "✕" : "💎"}
        </span>
      </button>
    </div>
  );
}
