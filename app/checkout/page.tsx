"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useCart } from "../context/CartProvider";

const FREE_SHIPPING_THRESHOLD = 500;
const SHIPPING_COST = 50;

export default function CheckoutPage() {
  const { items, totalPrice, mounted } = useCart();

  const [customerName, setCustomerName] = useState("");
  const [mobile, setMobile] = useState("");
  const [address, setAddress] = useState("");

  if (!mounted) {
    return (
      <div className="min-h-[70vh] bg-black px-4 py-12 text-white">
        <div className="mx-auto max-w-6xl">
          <p className="text-zinc-400">Loading checkout...</p>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] bg-black px-4 py-12 text-white">
        <div className="mx-auto flex max-w-2xl flex-col items-center justify-center py-20 text-center">
          <div className="mb-4 text-6xl">🛒</div>

          <h1 className="mb-3 text-3xl font-bold">
            Your cart is empty
          </h1>

          <p className="mb-8 text-zinc-400">
            Add some products before proceeding to checkout.
          </p>

          <Link
            href="/products"
            className="rounded-lg bg-green-600 px-8 py-3 font-semibold text-white transition-colors hover:bg-green-700"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  const shippingCost =
    totalPrice >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const total = totalPrice + shippingCost;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const whatsappNumber = process.env.NEXT_PUBLIC_CONTACT_WHATSAPP;

    if (!whatsappNumber) {
      window.alert(
        "WhatsApp ordering is currently unavailable. Please contact Ultimate Collections directly."
      );
      return;
    }

    const lines = [
      "Hello, I would like to place an order from Ultimate Collections.",
      "",
      `Customer Name: ${customerName}`,
      `Mobile: ${mobile}`,
      `Delivery Address: ${address}`,
      "",
      "Order Items:",
    ];

    items.forEach((item) => {
      lines.push(
        `- ${item.name} (ID: ${item.id}) x ${item.quantity} — ₹${(
          item.price * item.quantity
        ).toLocaleString("en-IN")}`
      );
    });

    lines.push(
      "",
      `Subtotal: ₹${totalPrice.toLocaleString("en-IN")}`,
      `Shipping: ${
        shippingCost === 0
          ? "FREE"
          : `₹${shippingCost.toLocaleString("en-IN")}`
      }`,
      `Total: ₹${total.toLocaleString("en-IN")}`,
      "",
      "Payment will be arranged separately. Please confirm availability and delivery details."
    );

    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
      lines.join("\n")
    )}`;

    window.open(url, "_blank");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-zinc-900 to-black px-4 py-10 text-white sm:px-6 lg:py-14">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10">
          <h1 className="text-3xl font-bold sm:text-4xl">
            Checkout
          </h1>
          <p className="mt-2 text-zinc-400">
            Enter your delivery details and review your order.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 gap-8 lg:grid-cols-3"
        >
          <div className="space-y-6 lg:col-span-2">
            <section className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">
              <h2 className="mb-6 text-xl font-semibold">
                Customer Information
              </h2>

              <div className="space-y-5">
                <div>
                  <label
                    htmlFor="customerName"
                    className="mb-2 block text-sm font-medium text-zinc-300"
                  >
                    Full Name
                  </label>

                  <input
                    id="customerName"
                    type="text"
                    value={customerName}
                    onChange={(event) => setCustomerName(event.target.value)}
                    required
                    autoComplete="name"
                    className="w-full rounded-lg border border-zinc-700 bg-black px-4 py-3 text-white outline-none transition-colors placeholder:text-zinc-600 focus:border-green-500"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label
                    htmlFor="mobile"
                    className="mb-2 block text-sm font-medium text-zinc-300"
                  >
                    Mobile Number
                  </label>

                  <input
                    id="mobile"
                    type="tel"
                    value={mobile}
                    onChange={(event) => setMobile(event.target.value)}
                    required
                    autoComplete="tel"
                    inputMode="numeric"
                    pattern="[0-9]{10}"
                    maxLength={10}
                    className="w-full rounded-lg border border-zinc-700 bg-black px-4 py-3 text-white outline-none transition-colors placeholder:text-zinc-600 focus:border-green-500"
                    placeholder="10-digit mobile number"
                  />
                </div>

                <div>
                  <label
                    htmlFor="address"
                    className="mb-2 block text-sm font-medium text-zinc-300"
                  >
                    Delivery Address
                  </label>

                  <textarea
                    id="address"
                    value={address}
                    onChange={(event) => setAddress(event.target.value)}
                    required
                    rows={5}
                    autoComplete="street-address"
                    className="w-full resize-y rounded-lg border border-zinc-700 bg-black px-4 py-3 text-white outline-none transition-colors placeholder:text-zinc-600 focus:border-green-500"
                    placeholder="Enter your complete delivery address"
                  />
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-amber-700/30 bg-amber-950/20 p-6">
              <h2 className="mb-2 text-lg font-semibold text-amber-400">
                Payment Information
              </h2>

              <p className="text-sm leading-relaxed text-zinc-300">
                Online payment is not enabled yet. After you place the order
                through WhatsApp, payment and delivery details will be
                confirmed separately.
              </p>
            </section>
          </div>

          <aside className="h-fit rounded-2xl border border-zinc-800 bg-zinc-900/80 p-6 lg:sticky lg:top-6">
            <h2 className="mb-6 text-xl font-bold">
              Order Summary
            </h2>

            <div className="space-y-4 border-b border-zinc-700 pb-6">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between gap-4 text-sm"
                >
                  <div>
                    <p className="font-medium text-white">
                      {item.name}
                    </p>
                    <p className="mt-1 text-zinc-500">
                      Qty: {item.quantity}
                    </p>
                  </div>

                  <span className="whitespace-nowrap text-zinc-300">
                    ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                  </span>
                </div>
              ))}
            </div>

            <div className="space-y-3 border-b border-zinc-700 py-6 text-sm">
              <div className="flex justify-between text-zinc-300">
                <span>Subtotal</span>
                <span>₹{totalPrice.toLocaleString("en-IN")}</span>
              </div>

              <div className="flex justify-between text-zinc-300">
                <span>Shipping</span>
                <span className={shippingCost === 0 ? "text-green-400" : ""}>
                  {shippingCost === 0
                    ? "FREE"
                    : `₹${shippingCost.toLocaleString("en-IN")}`}
                </span>
              </div>
            </div>

            <div className="flex justify-between py-6">
              <span className="text-lg font-semibold">
                Total
              </span>

              <span className="text-2xl font-bold text-green-400">
                ₹{total.toLocaleString("en-IN")}
              </span>
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-green-600 px-4 py-3 font-semibold text-white transition-colors hover:bg-green-700"
            >
              Place Order via WhatsApp
            </button>

            <p className="mt-4 text-center text-xs leading-relaxed text-zinc-500">
              Your order details will be sent to Ultimate Collections on
              WhatsApp for confirmation.
            </p>

            <Link
              href="/cart"
              className="mt-4 block text-center text-sm text-zinc-400 transition-colors hover:text-white"
            >
              ← Back to Cart
            </Link>
          </aside>
        </form>
      </div>
    </div>
  );
}
