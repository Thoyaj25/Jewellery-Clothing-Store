"use client";

import { useState, type FormEvent } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CustomerLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading) return;

    setError("");
    setLoading(true);

    try {
      const result = await signIn("customer", {
        email: email.trim().toLowerCase(),
        password,
        redirect: false,
      });

      if (result?.ok && !result.error) {
        router.replace("/account");
        router.refresh();
        return;
      }

      setError("Invalid email or password.");
    } catch {
      setError("Unable to sign in. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-4 py-12 text-white">
      <div className="w-full max-w-md rounded-2xl border border-amber-600/30 bg-zinc-950 p-8">
        <h1 className="text-center text-2xl font-semibold text-amber-300">
          Ultimate Collections
        </h1>

        <p className="mb-8 mt-2 text-center text-sm text-zinc-400">
          Sign in to your customer account
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="mb-2 block text-sm">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              maxLength={254}
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-900 p-3 text-white"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-2 block text-sm">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-900 p-3 text-white"
            />
          </div>

          {error && (
            <p role="alert" className="text-sm text-red-400">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-amber-500 px-4 py-3 font-semibold text-black transition hover:bg-amber-400 disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-zinc-400">
          New customer?{" "}
          <Link href="/account/register" className="text-amber-300 underline">
            Create Account
          </Link>
        </p>

        <p className="mt-6 text-center text-sm text-zinc-400">
          <Link href="/" className="text-amber-300 hover:underline">
            Back to Shopping
          </Link>
        </p>
      </div>
    </main>
  );
}
