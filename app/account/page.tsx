import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/src/lib/auth";
import SignOutButton from "./SignOutButton";

export const dynamic = "force-dynamic";

export default async function CustomerAccountPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/account/login");
  }

  if (session.user?.isAdmin !== false) {
    redirect("/admin");
  }

  return (
    <main className="min-h-screen bg-black px-4 py-12 text-white">
      <div className="mx-auto max-w-3xl space-y-8">
        <header>
          <p className="text-sm uppercase tracking-widest text-amber-400">
            Ultimate Collections
          </p>
          <h1 className="mt-3 text-3xl font-bold">
            My Account
          </h1>
          <p className="mt-3 text-zinc-400">
            Welcome, {session.user.name || "Customer"}!
          </p>
        </header>

        <section className="rounded-2xl border border-amber-600/30 bg-zinc-950 p-6">
          <h2 className="text-xl font-semibold text-amber-300">
            Track Your Orders
          </h2>

          <p className="mt-3 text-sm text-zinc-400">
            Track an order securely using its order reference
            and registered mobile number.
          </p>

          <Link
            href="/track-order"
            className="mt-5 inline-block rounded-lg bg-amber-500 px-5 py-3 font-semibold text-black hover:bg-amber-400"
          >
            Track My Order
          </Link>
        </section>

<div className="flex flex-wrap items-center gap-5">
        <Link
          href="/"
          className="inline-block text-sm text-amber-300 hover:underline"
        >
          Continue Shopping
        </Link>
          <SignOutButton />
        </div>
      </div>
    </main>
  );
}
