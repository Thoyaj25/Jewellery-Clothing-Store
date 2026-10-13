"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  orderId: string;
  notificationCount: number;
  orderStatus: string;
  paymentStatus: string;
};

const notificationTypes = [
  { value: "OrderConfirmed", label: "Order Confirmed" },
  { value: "OrderRejected", label: "Order Rejected" },
  { value: "PaymentReceived", label: "Payment Received" },
  { value: "OrderPacked", label: "Order Packed" },
  { value: "OrderShipped", label: "Order Shipped" },
  { value: "OrderDelivered", label: "Order Delivered" },
];

export default function NotificationActions({
  orderId,
  notificationCount,
  orderStatus,
  paymentStatus,
}: Props) {
  const router = useRouter();
  const availableTypes = notificationTypes.filter((item) => {
    if (orderStatus === "Rejected") {
      return item.value === "OrderRejected";
    }

    if (item.value === "OrderRejected") return false;

    if (item.value === "PaymentReceived") {
      return paymentStatus === "Paid" || paymentStatus === "Refunded";
    }

    const stages = ["Requested", "Confirmed", "Packed", "Shipped", "Delivered"];
    const eventStage: Record<string, string> = {
      OrderConfirmed: "Confirmed",
      OrderPacked: "Packed",
      OrderShipped: "Shipped",
      OrderDelivered: "Delivered",
    };

    return stages.indexOf(orderStatus) >= stages.indexOf(eventStage[item.value]);
  });

  const [type, setType] = useState(() => availableTypes[0]?.value ?? "");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function recordNotification() {
    if (loading || !availableTypes.some((item) => item.value === type)) return;

    if (
      !window.confirm(
        "Have you already sent this WhatsApp message to the customer?"
      )
    ) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `/api/admin/orders/${encodeURIComponent(orderId)}/notifications`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            notificationType: type,
            notes: notes.trim(),
          }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.error || "Unable to record notification."
        );
      }

      setNotes("");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to record notification."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-w-48 flex-col gap-2">
      <span className="text-xs text-zinc-400">
        Recorded notifications: {notificationCount}
      </span>

      <select
        aria-label="Notification type"
        value={type}
        onChange={(event) => setType(event.target.value)}
        className="rounded border border-zinc-700 bg-black p-2 text-xs text-white"
      >
        {availableTypes.map((item) => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>

      <input
        aria-label="Notification notes"
        value={notes}
        onChange={(event) => setNotes(event.target.value)}
        maxLength={2000}
        placeholder="Optional notes"
        className="rounded border border-zinc-700 bg-black p-2 text-xs text-white"
      />

      <button
        type="button"
        disabled={loading || availableTypes.length === 0}
        onClick={recordNotification}
        className="rounded bg-green-700 px-3 py-2 text-xs font-semibold text-white disabled:opacity-50"
      >
        {loading ? "Recording..." : "Mark WhatsApp Sent"}
      </button>

      {error && (
        <p role="alert" className="text-xs text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}
