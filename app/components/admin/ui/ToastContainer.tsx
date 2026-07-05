"use client";

import { useToast } from "./useToast";

export default function ToastContainer() {
  const { toasts } = useToast();

  return (
    <div className="fixed top-4 right-4 space-y-2 z-50">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`px-4 py-2 rounded text-sm shadow-lg ${
            t.type === "success"
              ? "bg-green-600"
              : t.type === "error"
              ? "bg-red-600"
              : "bg-zinc-700"
          }`}
        >
          {t.message}
        </div>
      ))}
    </div>
  );
}