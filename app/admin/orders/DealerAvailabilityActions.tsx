"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Availability = "Pending" | "Available" | "Unavailable";

type Props = {
  orderId: string;
  orderStatus: string;
  availability: Availability;
};

export default function DealerAvailabilityActions({
  orderId,
  orderStatus,
  availability,
}: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function verify(value: "Available" | "Unavailable") {
    if (loading || orderStatus !== "Requested") return;

    const note = window.prompt(
      value === "Available"
        ? "Dealer confirmation note (optional):"
        : "Why is this product unavailable?"
    );

    if (note === null) return;

    if (value === "Unavailable" && !note.trim()) {
      setError("Please enter a reason for unavailability.");
      return;
    }

    if (note.trim().length > 1000) {
      setError("Note cannot exceed 1000 characters.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `/api/admin/orders/${encodeURIComponent(orderId)}/dealer-availability`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            availability: value,
            note: note.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Verification failed.");
      }

      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Verification failed."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-2">
      <p className="text-xs text-zinc-400">
        Dealer availability:{" "}
        <span className="font-semibold text-amber-400">
          {availability}
        </span>
      </p>

      {orderStatus === "Requested" && (
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            disabled={loading}
            onClick={() => verify("Available")}
            className="rounded-lg bg-green-700 px-3 py-2 text-xs font-semibold text-white disabled:opacity-50"
          >
            Mark Available
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={() => verify("Unavailable")}
            className="rounded-lg bg-red-700 px-3 py-2 text-xs font-semibold text-white disabled:opacity-50"
          >
            Mark Unavailable
          </button>
        </div>
      )}

      {error && (
        <p role="alert" className="text-xs text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}
