"use client";

import Link from "next/link";
import { useCart } from "../context/CartProvider";
import CartItem from "./CartItem";
import CartSummary from "./CartSummary";

export default function CartView() {
  const { items, clear, totalPrice, totalCount } = useCart();

  // Calculate shipping
  const TAX_RATE = 0.1; // 10%
  const FREE_SHIPPING_THRESHOLD = 500;
  const SHIPPING_COST = totalPrice >= FREE_SHIPPING_THRESHOLD ? 0 : 50;

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
            href="/shop"
            className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
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
        <h1 className="text-3xl font-bold text-white mb-2">
          Shopping Cart
        </h1>
        <p className="text-zinc-400">
          {totalCount} item{totalCount !== 1 ? "s" : ""} in your cart
        </p>
      </div>

      {/* Main Content - Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items - Left Side (2/3 width) */}
        <div className="lg:col-span-2">
          <div className="bg-zinc-900/50 rounded-2xl p-6 border border-zinc-800">
            {/* Items List */}
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

            {/* Cart Actions */}
            <div className="mt-8 pt-6 border-t border-zinc-700 flex justify-between">
              <button
                onClick={() => clear()}
                className="text-red-500 hover:text-red-400 font-medium transition-colors"
              >
                Clear Cart
              </button>
              <Link
                href="/shop"
                className="text-green-500 hover:text-green-400 font-medium transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>

        {/* Order Summary - Right Side (1/3 width) */}
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
