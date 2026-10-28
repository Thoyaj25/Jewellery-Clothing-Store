"use client";

import { useEffect, useRef, useState } from "react";
import { Camera, X } from "lucide-react";
import {
  findSimilarProducts,
  type VisualSearchProduct,
  type VisualSearchMatch,
} from "@/src/lib/findSimilarProducts";

export default function ImageSearchUpload({
  products,
  onResults,
  resetKey,
}: {
  products: VisualSearchProduct[];
  resetKey: number;
  onResults: (matches: VisualSearchMatch[] | null) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [searching, setSearching] = useState(false);
  const searchIdRef = useRef(0);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  async function handleFile(file?: File) {
    if (!file) return;

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setError("Please select a JPEG, PNG or WebP image.");
      if (inputRef.current) inputRef.current.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be smaller than 5 MB.");
      if (inputRef.current) inputRef.current.value = "";
      return;
    }

    const searchId = ++searchIdRef.current;
    const imageUrl = URL.createObjectURL(file);

    setError("");
    setPreview(imageUrl);
    setSearching(true);
    onResults(null);

    try {
      const matches = await findSimilarProducts(imageUrl, products);

      if (searchId !== searchIdRef.current) return;

      if (matches.length === 0) {
        setError("No sufficiently similar products found. Try another image or use text search.");
        onResults([]);
      } else {
        setError("");
        onResults(matches);
      }
    } catch {
      if (searchId === searchIdRef.current) {
        setError("Image search could not finish. Please try another image.");
      }
    } finally {
      if (searchId === searchIdRef.current) {
        setSearching(false);
      }
    }
  }

  function clearImage() {
    searchIdRef.current++;
    setSearching(false);
    setPreview(null);
    setError("");
    onResults(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  const previousResetKey = useRef(resetKey);

  useEffect(() => {
    if (previousResetKey.current === resetKey) return;
    previousResetKey.current = resetKey;
    searchIdRef.current++;
    setSearching(false);
    setPreview(null);
    setError("");
    if (inputRef.current) inputRef.current.value = "";
  }, [resetKey]);

  return (
    <div className="space-y-3">
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        aria-label="Choose a product image"
        onChange={(event) => handleFile(event.target.files?.[0])}
      />

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="flex items-center gap-2 rounded-full border border-amber-600/50 bg-zinc-950 px-4 py-3 text-amber-400 hover:bg-amber-900/30"
      >
        <Camera size={20} />
        Search with an image
      </button>

      {searching && (
        <p role="status" className="text-sm text-amber-400">
          Comparing with our collections...
        </p>
      )}

      {error && (
        <p role="alert" className="text-sm text-red-400">
          {error}
        </p>
      )}

      {preview && (
        <div className="flex items-start gap-3">
          {/* Local browser preview; no image is uploaded to a server. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={preview}
            alt="Selected search image preview"
            className="h-24 w-24 rounded-lg border border-amber-600/40 object-cover"
          />
          <button
            type="button"
            onClick={clearImage}
            className="flex items-center gap-1 text-sm text-zinc-300 hover:text-white"
          >
            <X size={16} />
            Remove image
          </button>
        </div>
      )}
    </div>
  );
}
