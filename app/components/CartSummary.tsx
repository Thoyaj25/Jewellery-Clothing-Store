"use client";

import Link from "next/link";

interface CartSummaryProps {
  subtotal: number;
  taxRate?: number;
  shippingCost: number;
  itemCount: number;
}

export default function CartSummary({
  subtotal,
  taxRate = 0.1,
  shippingCost,
  itemCount,
}: CartSummaryProps) {
  const tax = subtotal * taxRate;
  const total = subtotal + tax + shippingCost;

  return (
    <div className="sticky top-6 rounded-2xl border border-zinc-700 bg-zinc-800 p-6">
      <h2 className="mb-6 text-xl font-bold text-white">
        Order Summary
      </h2>

      <div className="mb-6 space-y-4 border-b border-zinc-700 pb-6">
        <div className="flex justify-between text-zinc-300">
          <span>Subtotal ({itemCount} items)</span>
          <span>₹{subtotal.toLocaleString("en-IN")}</span>
        </div>

        <div className="flex justify-between text-zinc-300">
          <span>Tax (10%)</span>
          <span>
            ₹
            {tax.toLocaleString("en-IN", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
        </div>

        <div className="flex justify-between text-zinc-300">
          <span>Shipping</span>
          <span className={shippingCost === 0 ? "text-green-400" : ""}>
            {shippingCost === 0 ? "FREE" : `₹${shippingCost}`}
          </span>
        </div>
      </div>

      <div className="mb-6 flex justify-between">
        <span className="text-lg font-semibold text-white">Total</span>
        <span className="text-2xl font-bold text-green-400">
          ₹{total.toLocaleString("en-IN")}
        </span>
      </div>

      {subtotal < 500 && (
        <div className="mb-6 rounded-lg border border-blue-700 bg-blue-900/30 p-3">
          <p className="text-sm text-blue-300">
            🎉 Free shipping on orders above ₹500
          </p>
          <p className="mt-1 text-xs text-blue-400">
            Add ₹{(500 - subtotal).toLocaleString("en-IN")} more to unlock
            free shipping
          </p>
        </div>
      )}

      <div className="space-y-3">
        <Link
          href="/checkout"
          className="block w-full rounded-lg bg-green-600 px-4 py-3 text-center font-semibold text-white transition-colors hover:bg-green-700"
        >
          Proceed to Checkout
        </Link>

        <Link
          href="/products"
          className="block w-full rounded-lg border border-zinc-600 px-4 py-3 text-center font-semibold text-white transition-colors hover:border-zinc-500"
        >
          Continue Shopping
        </Link>
      </div>

      <div className="mt-6 space-y-2 border-t border-zinc-700 pt-6 text-center text-xs text-zinc-400">
        <p>✓ Secure checkout</p>
        <p>✓ 30-day returns</p>
        <p>✓ Fast delivery</p>
      </div>
    </div>
  );
}