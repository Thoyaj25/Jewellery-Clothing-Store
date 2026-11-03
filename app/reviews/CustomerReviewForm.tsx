"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";

export default function CustomerReviewsPage() {
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [productName, setProductName] = useState("");
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState("");
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading || success) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          city,
          productName,
          rating,
          review,
          consentToPublish: consent,
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.error || "Unable to submit review.");
      }

      setSuccess(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to submit review."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-black px-4 py-16 text-white">
      <div className="mx-auto max-w-xl">
        <Link href="/" className="text-sm text-amber-300 underline">
          Back to Shopping
        </Link>

        <h1 className="mt-8 text-center text-3xl font-semibold text-amber-300">
          Share Your Experience
        </h1>

        <p className="mt-3 text-center text-zinc-400">
          Your feedback helps us improve and helps other customers shop
          with confidence.
        </p>

        <div className="mt-8 rounded-2xl border border-amber-600/30 bg-zinc-950 p-6 sm:p-8">
          {success ? (
            <div role="status" className="text-center">
              <h2 className="text-xl font-semibold text-green-400">
                Thank You!
              </h2>
              <p className="mt-4 text-zinc-300">
                Your review has been submitted and is awaiting approval.
              </p>
              <Link
                href="/"
                className="mt-6 inline-block text-amber-300 underline"
              >
                Continue Shopping
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="customerName" className="mb-2 block">
                  Your Name
                </label>
                <input
                  id="customerName"
                  required
                  minLength={2}
                  maxLength={100}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-900 p-3"
                />
              </div>

              <div>
                <label htmlFor="customerCity" className="mb-2 block">
                  City / Town (Optional)
                </label>
                <input
                  id="customerCity"
                  type="text"
                  maxLength={100}
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Hyderabad"
                  autoComplete="address-level2"
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-900 p-3"
                />
              </div>

              <div>
                <label htmlFor="productName" className="mb-2 block">
                  Product Purchased
                </label>
                <input
                  id="productName"
                  required
                  minLength={2}
                  maxLength={200}
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="e.g. Designer Imitation Jewellery"
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-900 p-3"
                />
              </div>

              <fieldset>
                <legend className="mb-2">Your Rating</legend>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      aria-label={`Rate ${star} out of 5`}
                      aria-pressed={rating === star}
                      onClick={() => setRating(star)}
                      className="text-3xl"
                    >
                      <span
                        className={
                          star <= rating
                            ? "text-amber-400"
                            : "text-zinc-600"
                        }
                      >
                        ★
                      </span>
                    </button>
                  ))}
                </div>
              </fieldset>

              <div>
                <label htmlFor="review" className="mb-2 block">
                  Your Feedback
                </label>
                <textarea
                  id="review"
                  required
                  minLength={10}
                  maxLength={1000}
                  rows={5}
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  placeholder="Tell us about the product quality, design and experience..."
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-900 p-3"
                />
              </div>

              <label className="flex items-start gap-3 text-sm text-zinc-300">
                <input
                  type="checkbox"
                  checked={consent}
                  required
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-1"
                />
                I agree that Ultimate Collections may display my
                name, city (if provided), product name, rating
                and feedback publicly.
              </label>

              {error && (
                <p role="alert" className="text-sm text-red-400">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading || !consent}
                className="w-full rounded-lg bg-amber-500 px-4 py-3 font-semibold text-black disabled:opacity-50"
              >
                {loading ? "Submitting..." : "Submit My Review"}
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
