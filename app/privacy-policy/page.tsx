import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Learn how Ultimate Collections collects, uses and protects customer information.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-black px-4 py-12 text-white sm:px-6">
      <article className="mx-auto max-w-3xl space-y-8">
        <header className="border-b border-amber-600/30 pb-6">
          <h1 className="text-3xl font-bold text-amber-400 sm:text-4xl">
            Privacy Policy
          </h1>
          <p className="mt-3 text-sm text-zinc-400">
            Ultimate Collections — Effective date: 10 October 2026
          </p>
        </header>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">1. Introduction</h2>
          <p className="text-zinc-300">
            Ultimate Collections is an online jewellery, clothing,
            handbags and accessories store operated by Durga Prasad PJ
            as an individual seller in India. We respect customer privacy
            and aim to handle personal information responsibly.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">
            2. Information We Collect
          </h2>
          <p className="text-zinc-300">
            We may collect customer names, mobile numbers, email addresses
            where provided, delivery addresses, order details, customer
            enquiries, complaints and return or refund communications.
            Website service providers may process technical information
            needed to operate and secure the website.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">
            3. How We Use Information
          </h2>
          <p className="text-zinc-300">
            We use customer information to respond to enquiries, confirm
            orders, arrange delivery and payment coordination, process
            returns and refunds, maintain necessary business records,
            provide support and protect the website against misuse.
          </p>
          <p className="text-zinc-300">
            Optional promotional communications require appropriate
            customer consent.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">
            4. WhatsApp Communication
          </h2>
          <p className="text-zinc-300">
            We use our official business WhatsApp to coordinate orders,
            delivery availability, payment arrangements and customer
            support. WhatsApp communications are also subject to the
            platform's own privacy practices.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">
            5. Sharing Customer Information
          </h2>
          <p className="text-zinc-300">
            Necessary information may be shared with courier partners,
            hosting and database providers, email service providers,
            and payment or banking providers where relevant to
            providing our services.
          </p>
          <p className="text-zinc-300">
            We do not sell customer personal information to advertisers.
            Information may also be disclosed where required by law.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">
            6. Information Security
          </h2>
          <p className="text-zinc-300">
            We use administrative access controls and restricted database
            credentials to help protect customer information. No online
            service can guarantee absolute security.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">
            7. Data Retention
          </h2>
          <p className="text-zinc-300">
            We retain personal information only as long as reasonably
            necessary for customer orders, support, accounting,
            dispute resolution and applicable legal obligations.
            We do not promise automatic deletion after a fixed period.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">
            8. Customer Privacy Requests
          </h2>
          <p className="text-zinc-300">
            Customers may contact us about accessing, correcting or
            deleting eligible personal information, or withdrawing
            consent for optional marketing, subject to applicable law
            and lawful retention requirements.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">
            9. Cookies and Website Technologies
          </h2>
          <p className="text-zinc-300">
            Our website may use essential cookies or similar
            technologies for authentication, shopping-cart functions
            and security. Additional tracking technologies, if used,
            should be disclosed as applicable.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">
            10. Children's Privacy
          </h2>
          <p className="text-zinc-300">
            Our store is intended for customers legally able to
            purchase products, or those acting with appropriate
            parent or guardian involvement. We do not intentionally
            use children's information for targeted advertising.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">
            11. Changes to This Policy
          </h2>
          <p className="text-zinc-300">
            We may update this policy when our operations or applicable
            requirements change. Updated information and its effective
            date will be published on the website.
          </p>
        </section>

        <section className="space-y-3 border-t border-zinc-800 pt-6">
          <h2 className="text-xl font-semibold">
            12. Contact Information
          </h2>
          <p className="text-zinc-300">
            Store: Ultimate Collections
          </p>
          <p className="text-zinc-300">
            Operator and Responsible Person: Durga Prasad PJ
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
            13. Applicable Law
          </h2>
          <p className="text-zinc-300">
            This policy is intended to operate consistently with
            applicable Indian data protection and consumer protection
            laws. Applicable statutory rights remain unaffected.
          </p>
        </section>
      </article>
    </div>
  );
}
