"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";

type Review = {
  id: string;
  customer_name: string;
  product_name: string;
  rating: number;
  review_text: string;
  status: string;
  source: string;
  consent_to_publish: boolean;
  created_at: string;
};

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadReviews = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/reviews", {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(
          response.status === 401 || response.status === 403
            ? "Admin authentication required."
            : "Unable to load reviews."
        );
      }

      const data = await response.json();
      setReviews(data.reviews ?? []);
      setError("");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to load reviews."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    async function initializeReviews() {
      if (!controller.signal.aborted) {
        await loadReviews();
      }
    }

    void initializeReviews();

    return () => {
      controller.abort();
    };
  }, [loadReviews]);

  async function moderate(id: string, status: "approved" | "rejected") {
    if (busyId) return;

    setBusyId(id);
    setError("");
    setMessage("");

    try {
      const response = await fetch(
        `/api/admin/reviews/${encodeURIComponent(id)}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
        }
      );

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(result?.error || "Unable to update review.");
      }

      setMessage(
        status === "approved" ? "Review approved." : "Review rejected."
      );

      await loadReviews();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to update review."
      );
    } finally {
      setBusyId(null);
    }
  }

  return (
    <main className="min-h-screen bg-black px-4 py-10 text-white">
      <div className="mx-auto max-w-5xl">
        <Link href="/admin" className="text-amber-300 underline">
          Back to Admin Dashboard
        </Link>

        <h1 className="mt-8 text-3xl font-semibold text-amber-300">
          Customer Reviews
        </h1>

        <p className="mt-2 text-zinc-400">
          Approve genuine customer feedback before it appears publicly.
        </p>

        {error && (
          <p role="alert" className="mt-5 text-red-400">{error}</p>
        )}

        {message && (
          <p role="status" className="mt-5 text-green-400">{message}</p>
        )}

        {loading ? (
          <p className="mt-8">Loading reviews...</p>
        ) : reviews.length === 0 ? (
          <p className="mt-8 text-zinc-400">No reviews submitted yet.</p>
        ) : (
          <div className="mt-8 space-y-5">
            {reviews.map((review) => (
              <article
                key={review.id}
                className="rounded-xl border border-amber-600/30 bg-zinc-950 p-6"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h2 className="font-semibold">{review.customer_name}</h2>
                  <span className="text-sm text-amber-300">
                    {review.status.toUpperCase()}
                  </span>
                </div>

                <p className="mt-2 text-sm text-zinc-400">
                  {review.product_name} · {review.source}
                </p>

                <p className="mt-2 text-amber-400">
                  {"★".repeat(review.rating)}
                  {"☆".repeat(5 - review.rating)}
                </p>

                <p className="mt-4 whitespace-pre-wrap text-zinc-200">
                  {review.review_text}
                </p>

                <p className="mt-3 text-xs text-zinc-500">
                  Submitted: {new Date(review.created_at).toLocaleDateString("en-IN")}
                  {" · "}
                  Publication consent: {review.consent_to_publish ? "Yes" : "No"}
                </p>

                {review.status === "pending" && (
                  <div className="mt-5 flex gap-3">
                    <button
                      type="button"
                      disabled={busyId !== null || !review.consent_to_publish}
                      onClick={() => void moderate(review.id, "approved")}
                      className="rounded-lg bg-amber-500 px-4 py-2 font-semibold text-black disabled:opacity-50"
                    >
                      Approve
                    </button>

                    <button
                      type="button"
                      disabled={busyId !== null}
                      onClick={() => void moderate(review.id, "rejected")}
                      className="rounded-lg border border-red-500 px-4 py-2 text-red-300 disabled:opacity-50"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
