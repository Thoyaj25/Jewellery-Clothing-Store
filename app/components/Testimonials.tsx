import Link from "next/link";
import { query } from "@/src/lib/db";

type Review = {
  id: string;
  customer_name: string;
  product_name: string;
  rating: number;
  review_text: string;
};

export default async function Testimonials() {
  // Do not query the production database before reviews are enabled.
  if (
    process.env.NODE_ENV === "production" &&
    process.env.CUSTOMER_REVIEWS_ENABLED !== "true"
  ) {
    return (
      <section className="mt-20 border-t border-amber-600/20 py-16">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <h2 className="text-3xl font-light text-white md:text-4xl">
            Loved By Customers
          </h2>
          <p className="mt-4 text-gray-400">
            Customer reviews are coming soon.
          </p>
        </div>
      </section>
    );
  }

  let reviews: Review[] = [];

  try {
    const result = await query<Review>(
      `SELECT id::text, customer_name, product_name,
              rating, review_text
       FROM public.customer_reviews
       WHERE status = 'approved'
         AND consent_to_publish = TRUE
       ORDER BY created_at DESC
       LIMIT 8`
    );

    reviews = result.rows;
  } catch (error) {
    console.error("Unable to load customer testimonials:", error);
    return null;
  }

  return (
    <section className="mt-20 border-t border-amber-600/20 py-16">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="mb-4 text-center text-3xl font-light text-white md:text-4xl">
          Loved By Customers
        </h2>

        <p className="mb-10 text-center text-gray-400">
          Experiences shared by Ultimate Collections customers
        </p>

        {reviews.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {reviews.map((review) => (
              <article
                key={review.id}
                className="rounded-lg border border-amber-600/20 bg-amber-950/10 p-6"
              >
                <p
                  className="mb-3 text-amber-400"
                  aria-label={`${review.rating} out of 5 stars`}
                >
                  {"★".repeat(review.rating)}
                  {"☆".repeat(5 - review.rating)}
                </p>

                <p className="mb-4 whitespace-pre-wrap text-sm italic text-gray-300">
                  &ldquo;{review.review_text}&rdquo;
                </p>

                <p className="text-sm text-white">
                  {review.customer_name}
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  {review.product_name}
                </p>
              </article>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-400">
            Be the first to share your shopping experience.
          </p>
        )}

        <div className="mt-10 text-center">
          <Link
            href="/reviews"
            className="inline-block rounded-lg border border-amber-500 px-6 py-3 text-amber-300 transition-colors hover:bg-amber-500 hover:text-black"
          >
            Share Your Experience
          </Link>
        </div>
      </div>
    </section>
  );
}
