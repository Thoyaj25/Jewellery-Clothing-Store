"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
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

  const [availableStock, setAvailableStock] = useState<
    Record<number, number | null>
  >({});

  useEffect(() => {
    if (!mounted || items.length === 0) return;

    const controller = new AbortController();

    async function loadAvailability() {
      try {
        const response = await fetch("/api/products/availability", {
          cache: "no-store",
          signal: controller.signal,
        });

        if (!response.ok) return;

        const data = await response.json();

        if (!Array.isArray(data.products)) return;

        const stock: Record<number, number | null> = {};

        for (const product of data.products) {
          if (
            Number.isSafeInteger(product.id) &&
            (product.stockQuantity === null ||
              (Number.isSafeInteger(product.stockQuantity) &&
                product.stockQuantity >= 0))
          ) {
            stock[product.id] = product.stockQuantity;
          }
        }

        if (!controller.signal.aborted) {
          setAvailableStock(stock);
        }
      } catch {
        // Retain existing cart behavior if availability cannot load.
      }
    }

    void loadAvailability();

    return () => controller.abort();
  }, [mounted, items.length]);

  // Prevent hydration mismatch while loading localStorage
  if (!mounted) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-zinc-400 text-lg">Loading cart...</p>
      </div>
    );
  }

  // Calculate shipping
  const FREE_SHIPPING_THRESHOLD = 2000;
  const SHIPPING_COST =
    totalPrice >= FREE_SHIPPING_THRESHOLD ? 0 : 100;

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
                  availableQuantity={availableStock[Number(item.id)]}
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
            shippingCost={SHIPPING_COST}
            itemCount={totalCount}
          />
        </div>
      </div>
    </div>
  );
}