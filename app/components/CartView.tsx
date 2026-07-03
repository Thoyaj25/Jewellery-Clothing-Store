"use client";

import Link from "next/link";
import { useCart } from "../context/CartProvider";
import CartItem from "./CartItem";
import CartSummary from "./CartSummary";

export default function CartView() {
  const {
    items,
    clear,
    totalPrice,
    totalCount,
    mounted,
  } = useCart();

  // Prevent hydration mismatch while loading localStorage
  if (!mounted) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-zinc-400 text-lg">Loading cart...</p>
      </div>
    );
  }

  // Calculate shipping
  const TAX_RATE = 0.1; // 10%
  const FREE_SHIPPING_THRESHOLD = 500;
  const SHIPPING_COST =
    totalPrice >= FREE_SHIPPING_THRESHOLD ? 0 : 50;

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🛒</div>

          <h2 className="text-2xl font-bold text-white mb-2">
            Your cart is empty
          </h2>

          <p className="text-zinc-400 mb-6">
            Explore our collection and add some items!
          </p>

          <Link
            href="/products"
            className="inline-block rounded-lg bg-green-600 px-8 py-3 font-semibold text-white transition-colors hover:bg-green-700"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-white">
          Shopping Cart
        </h1>

        <p className="text-zinc-400">
          {totalCount} item{totalCount !== 1 ? "s" : ""} in your cart
        </p>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
            <div className="space-y-6">
              {items.map((item) => (
                <CartItem
                  key={item.id}
                  id={item.id}
                  name={item.name}
                  price={item.price}
                  image={item.image}
                  quantity={item.quantity}
                />
              ))}
            </div>

            {/* Actions */}
            <div className="mt-8 flex justify-between border-t border-zinc-700 pt-6">
              <button
                onClick={clear}
                className="font-medium text-red-500 transition-colors hover:text-red-400"
              >
                Clear Cart
              </button>

              <Link
                href="/products"
                className="font-medium text-green-500 transition-colors hover:text-green-400"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <CartSummary
            subtotal={totalPrice}
            taxRate={TAX_RATE}
            shippingCost={SHIPPING_COST}
            itemCount={totalCount}
          />
        </div>
      </div>
    </div>
  );
}