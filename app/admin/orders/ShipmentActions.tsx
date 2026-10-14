"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  orderId: string;
  orderStatus: string;
  courierName: string | null;
  trackingNumber: string | null;
};

export default function ShipmentActions({
  orderId,
  orderStatus,
  courierName,
  trackingNumber,
}: Props) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [courier, setCourier] = useState(courierName ?? "");
  const [tracking, setTracking] = useState(trackingNumber ?? "");
  const [date, setDate] = useState("");

  if (!["Confirmed", "Packed", "Shipped", "Delivered"].includes(orderStatus)) {
    return <span className="text-xs text-zinc-500">Not available</span>;
  }

  async function saveShipment() {
    if (loading) return;

    if (!courier.trim() || !tracking.trim()) {
      setError("Courier name and tracking number are required.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `/api/admin/orders/${encodeURIComponent(orderId)}/shipment`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            courierName: courier.trim(),
            trackingNumber: tracking.trim(),
            expectedDeliveryDate: date,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Unable to save courier details.");
      }

      setEditing(false);
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to save courier details."
      );
    } finally {
      setLoading(false);
    }
  }

  if (!editing) {
    return (
      <div className="flex flex-col gap-2 text-xs">
        {courierName && trackingNumber && (
          <div className="text-zinc-300">
            <p>{courierName}</p>
            <p className="break-all text-zinc-400">{trackingNumber}</p>
          </div>
        )}
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="rounded-lg border border-green-600 px-3 py-2 text-green-400 hover:bg-green-950"
        >
          {courierName ? "Edit Courier" : "Add Courier"}
        </button>
      </div>
    );
  }

  return (
    <div className="flex min-w-48 flex-col gap-2">
      <input
        aria-label="Courier name"
        placeholder="Courier name"
        value={courier}
        maxLength={150}
        onChange={(e) => setCourier(e.target.value)}
        className="rounded border border-zinc-700 bg-black p-2 text-sm"
      />

      <input
        aria-label="Tracking number"
        placeholder="Tracking number"
        value={tracking}
        maxLength={150}
        onChange={(e) => setTracking(e.target.value)}
        className="rounded border border-zinc-700 bg-black p-2 text-sm"
      />

      <input
        aria-label="Expected delivery date"
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="rounded border border-zinc-700 bg-black p-2 text-sm"
      />

      <div className="flex gap-2">
        <button
          type="button"
          disabled={loading}
          onClick={saveShipment}
          className="rounded bg-green-700 px-3 py-2 text-xs text-white disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save"}
        </button>

        <button
          type="button"
          disabled={loading}
          onClick={() => setEditing(false)}
          className="rounded border border-zinc-600 px-3 py-2 text-xs text-zinc-300"
        >
          Cancel
        </button>
      </div>

      {error && (
        <p role="alert" className="text-xs text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}
