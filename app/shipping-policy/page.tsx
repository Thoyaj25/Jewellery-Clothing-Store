import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shipping & Delivery Policy",
  description:
    "Shipping charges, delivery availability and order confirmation information for Ultimate Collections.",
};

export default function ShippingPolicyPage() {
  return (
    <div className="min-h-screen bg-black px-4 py-12 text-white sm:px-6">
      <article className="mx-auto max-w-3xl space-y-8">
        <header className="border-b border-amber-600/30 pb-6">
          <h1 className="text-3xl font-bold text-amber-400 sm:text-4xl">
            Shipping & Delivery Policy
          </h1>
          <p className="mt-3 text-sm text-zinc-400">
            Ultimate Collections
          </p>
        </header>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">1. Shipping Charges</h2>
          <p className="text-zinc-300">
            Orders below ₹2,000 have a shipping charge of ₹100.
            Orders of ₹2,000 or more qualify for free shipping,
            subject to confirmed delivery serviceability.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">2. Delivery Coverage</h2>
          <p className="text-zinc-300">
            We aim to deliver across India to serviceable PIN codes.
            Customers must confirm courier availability through our
            official business WhatsApp before an order is accepted.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">3. Delivery Timeline</h2>
          <p className="text-zinc-300">
            Estimated delivery timelines are communicated through WhatsApp
            after checking courier availability and the destination.
            Timelines may vary depending on product availability,
            courier operations, holidays and location.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">4. Order Confirmation</h2>
          <p className="text-zinc-300">
            Sending a WhatsApp order request does not automatically
            confirm an order. We confirm product availability,
            delivery serviceability, charges and payment arrangements
            before accepting an order.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">5. Delivery Delays</h2>
          <p className="text-zinc-300">
            We will communicate significant known delivery delays and
            discuss available options with the customer.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">6. Delivery Details</h2>
          <p className="text-zinc-300">
            Customers should provide accurate contact details,
            delivery addresses and PIN codes. Please contact us
            promptly if your delivery information requires correction.
          </p>
        </section>

        <section className="space-y-3 border-t border-zinc-800 pt-6">
          <h2 className="text-xl font-semibold">7. Customer Support</h2>
          <p className="text-zinc-300">
            Store: Ultimate Collections
          </p>
          <p className="text-zinc-300">
            Email: prasadpj509@gmail.com
          </p>
          <p className="text-zinc-300">
            WhatsApp: Official Ultimate Collections business WhatsApp
          </p>
          <p className="text-sm text-zinc-400">
            Applicable consumer rights remain unaffected by this policy.
          </p>
        </section>
      </article>
    </div>
  );
}
