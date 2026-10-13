"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type OrderStatus =
  | "Confirmed"
  | "Rejected"
  | "Packed"
  | "Shipped"
  | "Delivered";

type Props = {
  orderId: string;
  status: string;
};

export default function OrderActions({ orderId, status }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const actions: Record<string, { label: string; status: OrderStatus }[]> = {
    Requested: [
      { label: "Confirm", status: "Confirmed" },
      { label: "Reject", status: "Rejected" },
    ],
    Confirmed: [{ label: "Pack", status: "Packed" }],
    Packed: [{ label: "Ship", status: "Shipped" }],
    Shipped: [{ label: "Deliver", status: "Delivered" }],
  };

  const availableActions = actions[status] ?? [];

  if (availableActions.length === 0) {
    return <span className="text-xs text-zinc-500">No actions available</span>;
  }

  async function updateStatus(newStatus: OrderStatus) {
    if (loading) return;

    const confirmed = window.confirm(
      `Are you sure you want to ${newStatus === "Confirmed" ? "confirm" : "reject"} this order?`
    );

    if (!confirmed) return;

    const reason =
      newStatus === "Rejected"
        ? window.prompt("Enter the rejection reason:")
        : "";

    if (newStatus === "Rejected" && (!reason || !reason.trim())) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `/api/admin/orders/${encodeURIComponent(orderId)}/status`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            status: newStatus,
            reason: reason?.trim() || "",
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to update order.");
      }

      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to update order."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        {availableActions.map((action) => (
          <button
            key={action.status}
            type="button"
            disabled={loading}
            onClick={() => updateStatus(action.status)}
            className={
              action.status === "Rejected"
                ? "rounded-lg bg-red-700 px-3 py-2 text-xs font-semibold text-white hover:bg-red-800 disabled:opacity-50"
                : "rounded-lg bg-green-600 px-3 py-2 text-xs font-semibold text-white hover:bg-green-700 disabled:opacity-50"
            }
          >
            {loading ? "Saving..." : action.label}
          </button>
        ))}
      </div>

      {error && (
        <p role="alert" className="text-xs text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}
