"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  orderId: string;
  orderStatus: string;
  paymentStatus: string;
};

export default function PaymentActions({
  orderId,
  orderStatus,
  paymentStatus,
}: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (paymentStatus === "Refunded") {
    return <span className="text-xs text-zinc-400">Refunded</span>;
  }

  if (paymentStatus === "Paid") {
    return (
      <div className="flex flex-col gap-2">
        <span className="text-xs text-emerald-400">Paid</span>
        <button
          type="button"
          disabled={loading}
          onClick={markAsRefunded}
          className="rounded-lg border border-amber-600 px-3 py-2 text-xs font-semibold text-amber-400 disabled:opacity-50"
        >
          {loading ? "Recording..." : "Mark as Refunded"}
        </button>
        {error && <p role="alert" className="text-xs text-red-400">{error}</p>}
      </div>
    );
  }

  if (!["Confirmed", "Packed", "Shipped", "Delivered"].includes(orderStatus)) {
    return <span className="text-xs text-zinc-500">Awaiting approval</span>;
  }

  async function markAsRefunded() {
    if (loading) return;

    const refundReference = window.prompt(
      "Enter the verified refund transaction reference:"
    );

    if (!refundReference?.trim()) return;

    if (refundReference.trim().length > 200) {
      setError("Refund reference cannot exceed 200 characters.");
      return;
    }

    const notes = window.prompt(
      "Enter optional refund notes:"
    );

    if (notes === null) return;

    if (notes.trim().length > 2000) {
      setError("Refund details cannot exceed 2000 characters.");
      return;
    }

    if (
      !window.confirm(
        "Have you independently confirmed that the customer received the refund? This action records the payment as Refunded but does not send money."
      )
    ) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `/api/admin/orders/${encodeURIComponent(orderId)}/payment`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            status: "Refunded",
            refundReference: refundReference.trim(),
            notes: notes.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Unable to record refund.");
      }

      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to record refund."
      );
    } finally {
      setLoading(false);
    }
  }

  async function markAsPaid() {
    if (loading) return;

    const method = window.prompt(
      "Enter payment method (UPI, Bank Transfer, Cash):"
    );

    if (!method?.trim()) return;

    const transactionReference = window.prompt(
      "Enter the verified payment transaction reference:"
    );

    if (!transactionReference?.trim()) return;

    if (!window.confirm("Have you independently verified that this payment was received?")) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `/api/admin/orders/${encodeURIComponent(orderId)}/payment`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            status: "Paid",
            method: method.trim(),
            transactionReference: transactionReference.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Unable to update payment.");
      }

      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to update payment."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        disabled={loading}
        onClick={markAsPaid}
        className="rounded-lg bg-emerald-700 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-800 disabled:opacity-50"
      >
        {loading ? "Saving..." : "Mark as Paid"}
      </button>

      {error && <p role="alert" className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
