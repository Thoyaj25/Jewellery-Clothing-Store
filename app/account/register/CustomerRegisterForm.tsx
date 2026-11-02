"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";

export default function CustomerRegisterPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading || success) return;

    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/customers/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: fullName.trim(),
          email: email.trim().toLowerCase(),
          password,
        }),
      });

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(result?.error || "Registration failed.");
      }

      setPassword("");
      setSuccess(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Registration failed."
      );
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
          Create your customer account
        </p>

        {success ? (
          <div role="status" className="space-y-5 text-center">
            <p className="text-green-400">
              Account created successfully!
            </p>
            <Link
              href="/account/login"
              className="inline-block rounded-lg bg-amber-500 px-5 py-3 font-semibold text-black"
            >
              Sign In
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="fullName" className="mb-2 block text-sm">
                Full Name
              </label>
              <input
                id="fullName"
                required
                maxLength={100}
                autoComplete="name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-900 p-3"
              />
            </div>

            <div>
              <label htmlFor="email" className="mb-2 block text-sm">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                maxLength={254}
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-900 p-3"
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-2 block text-sm">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                minLength={12}
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-900 p-3"
              />
              <p className="mt-2 text-xs text-zinc-400">
                At least 12 characters, maximum 72 UTF-8 bytes.
              </p>
            </div>

            {error && (
              <p role="alert" className="text-sm text-red-400">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-amber-500 px-4 py-3 font-semibold text-black hover:bg-amber-400 disabled:opacity-50"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>
        )}

        <p className="mt-6 text-center text-sm text-zinc-400">
          Already registered?{" "}
          <Link href="/account/login" className="text-amber-300 underline">
            Sign In
          </Link>
        </p>

        <p className="mt-4 text-center">
          <Link href="/" className="text-sm text-zinc-400 underline">
            Back to Shopping
          </Link>
        </p>
      </div>
    </main>
  );
}
