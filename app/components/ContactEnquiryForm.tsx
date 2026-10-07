"use client";

import { FormEvent, useState } from "react";

export default function ContactEnquiryForm() {
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    setSubmitting(true);
    setSuccess("");
    setError("");

    try {
      const response = await fetch("/api/enquiries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.get("name"),
          phone: formData.get("phone"),
          email: formData.get("email"),
          message: formData.get("message"),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to send enquiry.");
      }

      setSuccess(
        "Thank you! Your enquiry has been sent successfully. We will contact you soon."
      );

      form.reset();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to send enquiry. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <input
        type="text"
        name="name"
        placeholder="Your Name"
        required
        className="w-full bg-black/40 border border-zinc-700 rounded-xl p-4 text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
      />

      <input
        type="tel"
        name="phone"
        placeholder="Phone Number"
        required
        className="w-full bg-black/40 border border-zinc-700 rounded-xl p-4 text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
      />

      <input
        type="email"
        name="email"
        placeholder="Email Address (Optional)"
        className="w-full bg-black/40 border border-zinc-700 rounded-xl p-4 text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
      />

      <textarea
        name="message"
        placeholder="Tell us what you're looking for..."
        rows={6}
        required
        className="w-full bg-black/40 border border-zinc-700 rounded-xl p-4 text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
      />

      {success && (
        <div
          role="status"
          className="rounded-xl border border-green-500/30 bg-green-500/10 p-4 text-green-400"
        >
          {success}
        </div>
      )}

      {error && (
        <div
          role="alert"
          className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-400"
        >
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-gradient-to-r from-amber-600 to-amber-500 text-black py-4 rounded-xl font-semibold hover:from-amber-500 hover:to-amber-400 transition duration-300 shadow-lg hover:shadow-amber-600/30 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? "Sending Enquiry..." : "Send Enquiry"}
      </button>
    </form>
  );
}
