"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";

type TrackingResult = {
  orderReference: string;
  status: string;
  paymentStatus: string;
  courierName: string | null;
  trackingNumber: string | null;
};

const ORDER_STAGES = [
  "Requested",
  "Confirmed",
  "Packed",
  "Shipped",
  "Delivered",
] as const;

function OrderTimeline({ status }: { status: string }) {
  const currentIndex = ORDER_STAGES.findIndex((stage) => stage === status);

  if (status === "Rejected") {
    return (
      <div role="status" className="rounded-xl border border-red-800/50 bg-red-950/30 p-4">
        <p className="font-semibold text-red-300">Order Rejected</p>
        <p className="mt-1 text-sm text-zinc-300">
          Your order was not accepted. Please contact support for assistance.
        </p>
      </div>
    );
  }

  if (currentIndex === -1) {
    return (
      <p className="text-sm text-zinc-400">
        Current status: {status}. Contact support for more information.
      </p>
    );
  }

  return (
    <div aria-label="Order progress" className="rounded-xl border border-amber-600/20 p-4">
      <h3 className="mb-4 font-medium text-amber-300">Order Progress</h3>
      <ol className="space-y-0">
        {ORDER_STAGES.map((stage, index) => {
          const completed = index < currentIndex;
          const current = index === currentIndex;
          const reached = index <= currentIndex;

          return (
            <li key={stage} className="flex gap-3">
              <div className="flex flex-col items-center">
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-bold ${
                    reached
                      ? "border-amber-400 bg-amber-500 text-black"
                      : "border-zinc-600 bg-zinc-900 text-zinc-400"
                  }`}
                  aria-hidden="true"
                >
                  {completed ? "✓" : index + 1}
                </span>
                {index < ORDER_STAGES.length - 1 && (
                  <span
                    aria-hidden="true"
                    className={`h-7 w-0.5 ${completed ? "bg-amber-500" : "bg-zinc-700"}`}
                  />
                )}
              </div>
              <div className="pb-6 pt-1">
                <span className={reached ? "font-medium text-white" : "text-zinc-500"}>
                  {stage}
                </span>
                {current && (
                  <span className="ml-2 text-xs text-amber-400">(Current)</span>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

export default function TrackOrderPage() {
  const [orderReference, setOrderReference] = useState("");
  const [mobile, setMobile] = useState("");
  const [order, setOrder] = useState<TrackingResult | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  async function copyTrackingNumber() {
    if (!order?.trackingNumber) return;

    try {
      await navigator.clipboard.writeText(order.trackingNumber);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading) return;

    setLoading(true);
    setError("");
    setOrder(null);
    setCopied(false);

    try {
      const response = await fetch("/api/orders/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify({
          orderReference: orderReference.trim(),
          mobile: mobile.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(
          response.status === 429
            ? "Too many attempts. Please wait a minute and try again."
            : data.error || "Unable to retrieve your order."
        );
        return;
      }

      setOrder(data.order);
    } catch {
      setError("Unable to connect. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-black px-4 py-16 text-white">
      <div className="mx-auto max-w-xl">
        <Link
          href="/"
          className="text-sm text-amber-400 hover:text-amber-300"
        >
          ← Back to Home
        </Link>

        <div className="mt-8 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-amber-400">
            Ultimate Collections
          </p>
          <h1 className="mt-4 text-3xl font-light sm:text-4xl">
            Track Your Order
          </h1>
          <p className="mt-4 text-sm leading-6 text-gray-400">
            Enter your order reference and the mobile number used
            at checkout to view your latest order status.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-10 space-y-6 rounded-2xl border border-amber-600/30 bg-zinc-950 p-6 shadow-xl sm:p-8"
        >
          <div>
            <label
              htmlFor="orderReference"
              className="mb-2 block text-sm text-gray-200"
            >
              Order Reference
            </label>
            <input
              id="orderReference"
              required
              maxLength={32}
              autoComplete="off"
              placeholder="UC-2026-0001"
              value={orderReference}
              onChange={(event) => setOrderReference(event.target.value)}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-white outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <label
              htmlFor="mobile"
              className="mb-2 block text-sm text-gray-200"
            >
              Registered Mobile Number
            </label>
            <input
              id="mobile"
              type="tel"
              required
              inputMode="numeric"
              autoComplete="tel"
              maxLength={13}
              placeholder="Enter your mobile number"
              value={mobile}
              onChange={(event) => setMobile(event.target.value)}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-white outline-none focus:border-amber-400"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-amber-500 px-5 py-3 font-semibold text-black transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Checking Order..." : "Track My Order"}
          </button>
        </form>

        {error && (
          <p
            role="alert"
            className="mt-6 rounded-lg border border-red-800 bg-red-950/40 p-4 text-sm text-red-300"
          >
            {error}
          </p>
        )}

        {order && (
          <section
            aria-live="polite"
            className="mt-8 space-y-4 rounded-2xl border border-amber-600/30 bg-zinc-950 p-6"
          >
            <h2 className="text-xl font-semibold text-amber-300">
              Order Details
            </h2>

            <OrderTimeline status={order.status} />

            <div className="space-y-3 text-sm">
              <p>
                <span className="text-gray-400">Reference: </span>
                {order.orderReference}
              </p>
              <p>
                <span className="text-gray-400">Order Status: </span>
                {order.status}
              </p>
              <p>
                <span className="text-gray-400">Payment Status: </span>
                {order.paymentStatus}
              </p>
              {order.courierName && (
                <p>
                  <span className="text-gray-400">Courier: </span>
                  {order.courierName}
                </p>
              )}
              {order.trackingNumber && (
                <div className="space-y-2">
                  <p>
                    <span className="text-gray-400">Tracking Number: </span>
                    <span className="break-all">{order.trackingNumber}</span>
                  </p>
                  <button
                    type="button"
                    onClick={() => void copyTrackingNumber()}
                    className="rounded-lg border border-amber-600/50 px-4 py-2 text-sm text-amber-300 transition hover:bg-amber-900/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400"
                  >
                    {copied ? "Copied!" : "Copy Tracking Number"}
                  </button>
                </div>
              )}
            </div>
          </section>
        )}

        <p className="mt-8 text-center text-sm text-gray-400">
          Need help?{" "}
          <Link href="/contact" className="text-amber-400 underline">
            Contact Support
          </Link>
        </p>
      </div>
    </main>
  );
}
