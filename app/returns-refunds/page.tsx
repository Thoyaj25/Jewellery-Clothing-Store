import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Returns, Exchanges & Refunds Policy",
  description:
    "Information about returns, clothing exchanges and refunds at Ultimate Collections.",
};

export default function ReturnsRefundsPage() {
  return (
    <div className="min-h-screen bg-black px-4 py-12 text-white sm:px-6">
      <article className="mx-auto max-w-3xl space-y-8">
        <header className="border-b border-amber-600/30 pb-6">
          <h1 className="text-3xl font-bold text-amber-400 sm:text-4xl">
            Returns, Exchanges & Refunds Policy
          </h1>
          <p className="mt-3 text-sm text-zinc-400">
            Ultimate Collections
          </p>
        </header>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">
            1. Damaged, Defective or Incorrect Products
          </h2>
          <p className="text-zinc-300">
            If you receive a damaged, defective or incorrect product,
            please contact Ultimate Collections through our official
            business WhatsApp, preferably within 48 hours of delivery.
          </p>
          <p className="text-zinc-300">
            Please share your order details, a description of the issue,
            and clear photographs where available. An unboxing video
            may help but is not mandatory.
          </p>
          <p className="text-zinc-300">
            The 48-hour period is a preferred reporting guideline and
            does not limit your rights under applicable consumer law.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">
            2. Clothing Size Exchanges
          </h2>
          <p className="text-zinc-300">
            Size-related exchange requests for eligible clothing
            will be reviewed individually, depending on product
            condition, replacement availability and applicable law.
          </p>
          <p className="text-zinc-300">
            For voluntary size exchanges, items should ordinarily
            be unused, unwashed and returned with original tags
            where applicable.
          </p>
          <p className="text-zinc-300">
            Any exchange shipping charges will be communicated
            before you agree to proceed.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">
            3. Change-of-Mind Returns
          </h2>
          <p className="text-zinc-300">
            We do not ordinarily offer returns solely for a change
            of preference unless otherwise stated for a product.
            Statutory remedies for defective, misdescribed or
            incorrectly supplied products remain available.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">
            4. Return and Replacement Review
          </h2>
          <p className="text-zinc-300">
            We review return requests and communicate the available
            options through WhatsApp. Eligible requests may result
            in a replacement, exchange or refund.
          </p>
          <p className="text-zinc-300">
            Please contact us to confirm return arrangements
            before dispatching an item.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">
            5. Return Shipping Charges
          </h2>
          <p className="text-zinc-300">
            Where Ultimate Collections is responsible for supplying
            a damaged, defective or incorrect product, reasonable
            return shipping will be arranged at our expense,
            as applicable.
          </p>
          <p className="text-zinc-300">
            For discretionary exchanges, any customer-payable
            shipping charge will be explained in advance.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">
            6. Refund Processing
          </h2>
          <p className="text-zinc-300">
            Once a refund is approved, Ultimate Collections aims
            to initiate it within 5–7 business days, subject to
            applicable law.
          </p>
          <p className="text-zinc-300">
            The time for funds to reach your account may vary
            depending on your payment method and banking provider.
            Refund arrangements will be communicated through WhatsApp.
          </p>
        </section>

        <section className="space-y-3 border-t border-zinc-800 pt-6">
          <h2 className="text-xl font-semibold">
            7. Support and Complaints
          </h2>
          <p className="text-zinc-300">
            Store: Ultimate Collections
          </p>
          <p className="text-zinc-300">
            Responsible Person: Durga Prasad PJ
          </p>
          <p className="text-zinc-300">
            Email: prasadpj509@gmail.com
          </p>
          <p className="text-zinc-300">
            WhatsApp: Official Ultimate Collections business WhatsApp
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">
            8. Consumer Rights
          </h2>
          <p className="text-zinc-300">
            Nothing in this policy excludes or limits rights or
            remedies available under applicable Indian consumer
            protection laws.
          </p>
        </section>
      </article>
    </div>
  );
}
