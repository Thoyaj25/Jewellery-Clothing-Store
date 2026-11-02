import Link from "next/link";
import CustomerRegisterForm from "./CustomerRegisterForm";

export default function CustomerRegisterPage() {
  const registrationEnabled =
    process.env.NODE_ENV !== "production" ||
    process.env.CUSTOMER_REGISTRATION_ENABLED === "true";

  if (!registrationEnabled) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black px-4 text-white">
        <div className="max-w-md text-center">
          <h1 className="text-2xl font-semibold text-amber-300">
            Ultimate Collections
          </h1>
          <p className="mt-4 text-zinc-300">
            Customer registration is coming soon.
          </p>
          <Link
            href="/"
            className="mt-6 inline-block text-amber-300 underline"
          >
            Continue Shopping
          </Link>
        </div>
      </main>
    );
  }

  return <CustomerRegisterForm />;
}
