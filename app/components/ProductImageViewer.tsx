"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";

type Props = {
  src: string;
  alt: string;
};

export default function ProductImageViewer({ src, alt }: Props) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }

      if (event.key === "Tab") {
        event.preventDefault();
        closeRef.current?.focus();
      }
    };

    const previousOverflow = document.body.style.overflow;
    const triggerButton = triggerRef.current;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = previousOverflow;
      triggerButton?.focus();
    };
  }, [open]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        className="mt-3 rounded-full border border-amber-600/40 px-5 py-2 text-sm text-amber-400 transition hover:bg-amber-600/10"
      >
        View Full Image
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Full image of ${alt}`}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4"
        >
          <button
            ref={closeRef}
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close full image"
            className="absolute right-4 top-4 z-10 rounded-full bg-zinc-900 p-3 text-white hover:bg-zinc-800"
          >
            <X size={24} />
          </button>

          <div className="relative h-[85vh] w-full max-w-5xl">
            <Image
              src={src}
              alt={alt}
              fill
              sizes="100vw"
              className="object-contain"
            />
          </div>
        </div>
      )}
    </>
  );
}
