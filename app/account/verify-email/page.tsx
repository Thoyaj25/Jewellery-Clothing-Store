"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState("Verifying your email address...");

  useEffect(() => {
    if (!token) {
      return;
    }

    let active = true;

    async function verify() {
      try {
        const response = await fetch("/api/customers/verify-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        const data = await response.json();

        if (!active) return;

        setStatus(response.ok ? "success" : "error");
        setMessage(
          response.ok
            ? "Your email has been verified successfully."
            : data.error || "Unable to verify your email."
        );
      } catch {
        if (!active) return;
        setStatus("error");
        setMessage("Unable to verify your email. Please try again.");
      }
    }

    void verify();

    return () => {
      active = false;
    };
  }, [token]);

  if (!token) {
    return (
      <main className="mx-auto max-w-lg px-6 py-20 text-center">
        <h1 className="text-2xl font-semibold">Invalid verification link</h1>
        <p className="mt-4">Your verification link is missing a token.</p>
        <Link href="/account/login" className="mt-6 inline-block underline">
          Back to Login
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-lg px-6 py-20 text-center">
      <h1 className="text-2xl font-semibold">
        {status === "loading"
          ? "Verifying Email"
          : status === "success"
            ? "Email Verified"
            : "Verification Failed"}
      </h1>

      <p className="mt-4">{message}</p>

      {status === "success" && (
        <Link href="/account/login" className="mt-6 inline-block underline">
          Sign In to Your Account
        </Link>
      )}
    </main>
  );
}
