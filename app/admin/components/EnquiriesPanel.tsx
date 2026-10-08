"use client";

import type { Enquiry } from "../services/adminApi";

type Props = {
  enquiries: Enquiry[];
  loading?: boolean;
};

export default function EnquiriesPanel({
  enquiries,
  loading = false,
}: Props) {
  return (
    <section className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-white">
          Customer Enquiries
        </h2>

        <p className="mt-1 text-sm text-zinc-400">
          View enquiries submitted through the contact form.
        </p>
      </div>

      {loading ? (
        <p className="text-sm text-zinc-400">
          Loading enquiries...
        </p>
      ) : enquiries.length === 0 ? (
        <div className="rounded-xl border border-dashed border-zinc-700 p-8 text-center">
          <p className="text-zinc-300">
            No customer enquiries yet.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-zinc-800 text-zinc-400">
              <tr>
                <th className="px-4 py-3 font-medium">ID</th>
                <th className="px-4 py-3 font-medium">Customer</th>
                <th className="px-4 py-3 font-medium">Contact</th>
                <th className="px-4 py-3 font-medium">Message</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Received</th>
              </tr>
            </thead>

            <tbody>
              {enquiries.map((enquiry) => (
                <tr
                  key={enquiry.id}
                  className="border-b border-zinc-800/70 align-top"
                >
                  <td className="px-4 py-4 text-zinc-400">
                    #{enquiry.id}
                  </td>

                  <td className="px-4 py-4">
                    <p className="font-medium text-white">
                      {enquiry.name}
                    </p>
                  </td>

                  <td className="px-4 py-4">
                    <p className="text-zinc-200">
                      {enquiry.phone}
                    </p>

                    <p className="mt-1 text-zinc-500">
                      {enquiry.email || "No email"}
                    </p>
                  </td>

                  <td className="max-w-md px-4 py-4 text-zinc-300">
                    <p className="whitespace-pre-wrap break-words">
                      {enquiry.message}
                    </p>
                  </td>

                  <td className="px-4 py-4">
                    <span className="inline-flex rounded-full bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-400">
                      {enquiry.status}
                    </span>
                  </td>

                  <td className="px-4 py-4 text-zinc-400">
                    {new Date(enquiry.created_at).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
