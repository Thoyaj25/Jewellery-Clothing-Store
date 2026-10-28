"use client";

import { useEffect, useRef, useState } from "react";
import { Mic } from "lucide-react";
import ProductCard from "./ProductCard";
import ImageSearchUpload from "./ImageSearchUpload";
import type { VisualSearchMatch } from "@/src/lib/findSimilarProducts";

type SpeechRecognitionInstance = {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  onresult: ((event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
  start: () => void;
  abort: () => void;
};

type SpeechRecognitionConstructor = new () => SpeechRecognitionInstance;

export type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
  description: string | null;
};

export default function ProductGrid({
  products,
}: {
  products: Product[];
}) {
  const [search, setSearch] = useState("");
  const [visualMatches, setVisualMatches] = useState<VisualSearchMatch[] | null>(null);
  const [listening, setListening] = useState(false);
  const [voiceMessage, setVoiceMessage] = useState("");
  const [imageResetKey, setImageResetKey] = useState(0);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);

  useEffect(() => {
    return () => recognitionRef.current?.abort();
  }, []);

  function startVoiceSearch() {
    const browser = window as Window & {
      SpeechRecognition?: SpeechRecognitionConstructor;
      webkitSpeechRecognition?: SpeechRecognitionConstructor;
    };

    const Recognition =
      browser.SpeechRecognition ?? browser.webkitSpeechRecognition;

    if (!Recognition) {
      setVoiceMessage("Voice search is not supported in this browser. Please type your search.");
      return;
    }

    if (recognitionRef.current) return;

    const recognition = new Recognition();
    recognitionRef.current = recognition;
    recognition.lang = "en-IN";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const transcript = event.results[0]?.[0]?.transcript;
      if (transcript) {
        setSearch(transcript);
        setVoiceMessage("");
      }
    };

    recognition.onerror = () => {
      setVoiceMessage("Could not recognize speech. Please try again or type your search.");
    };

    recognition.onend = () => {
      setListening(false);
      recognitionRef.current = null;
    };

    try {
      setVoiceMessage("");
      recognition.start();
      setListening(true);
    } catch {
      recognitionRef.current = null;
      setListening(false);
      setVoiceMessage("Microphone could not start. Please use text search.");
    }
  }
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("default");

  function clearAllFilters() {
    recognitionRef.current?.abort();
    setListening(false);
    setVoiceMessage("");
    setSearch("");
    setCategory("All");
    setSort("default");
    setVisualMatches(null);
    setImageResetKey((key) => key + 1);
  }



  const categories = [
    "All",
    ...Array.from(
      new Set(products.map((product) => product.category))
    ).sort(),
  ];


  const filteredProducts = products.filter((product) => {

    const searchTerm = search.trim().toLowerCase();

    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm) ||
      product.category.toLowerCase().includes(searchTerm) ||
      (product.description ?? "").toLowerCase().includes(searchTerm);


    const matchesCategory =
      category === "All" ||
      product.category === category;


    const matchesImage =
      visualMatches === null ||
      visualMatches.some((match) => match.productId === product.id);

    return visualMatches !== null
      ? matchesImage
      : matchesSearch && matchesCategory;

  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {

    if (sort === "price-low") {
      return a.price - b.price;
    }

    if (sort === "price-high") {
      return b.price - a.price;
    }

    return 0;
  });


  return (
    <>

      {/* Category Filter */}
      <div className="mb-6 flex flex-col gap-2 sm:max-w-md">
        <label
          htmlFor="collection-category"
          className="text-sm font-medium text-amber-400"
        >
          Browse Collections
        </label>

        <select
          id="collection-category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="
            w-full rounded-lg
            border border-amber-600/50
            bg-zinc-950 px-4 py-3
            text-white
            focus:outline-none
            focus:ring-2 focus:ring-amber-500
          "
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat === "All" ? "All Collections" : cat}
            </option>
          ))}
        </select>
      </div>


      {/* AI visual search */}
      <div className="mb-6">
        <ImageSearchUpload
          resetKey={imageResetKey}
          products={products.map(({ id, name, image }) => ({
            id,
            name,
            image,
          }))}
          onResults={setVisualMatches}
        />
      </div>

      {/* Search and voice recognition */}
      <div className="mb-12">
        <div className="flex items-center gap-2">
          <input
            type="search"
            aria-label="Search products"
            placeholder="Search for jewellery, clothing..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="min-w-0 flex-1 rounded-full border border-amber-600/30 bg-black/40 px-4 py-3 text-white placeholder-gray-500 focus:border-amber-600 focus:outline-none md:px-6 md:py-4"
          />
          <button
            type="button"
            onClick={startVoiceSearch}
            disabled={listening}
            aria-label={listening ? "Listening for your search" : "Search by voice"}
            title={listening ? "Listening..." : "Search by voice"}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-amber-600/50 bg-zinc-950 text-amber-400 transition hover:bg-amber-900/30 disabled:opacity-60"
          >
            <Mic size={20} aria-hidden="true" />
          </button>
        </div>
        {listening && (
          <p role="status" className="mt-2 text-sm text-amber-400">
            Listening... speak your product name.
          </p>
        )}
        {voiceMessage && (
          <p role="status" className="mt-2 text-sm text-zinc-400">
            {voiceMessage}
          </p>
        )}


      </div>



        {/* Sorting */}
        <div className="mb-10 flex justify-end">
          <label className="flex items-center gap-3 text-sm text-gray-400">
            <span>Sort by</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="bg-black/60 border border-amber-600/30 rounded-full px-4 py-2 text-white focus:outline-none focus:border-amber-600"
            >
              <option value="default">Default</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </label>
        </div>


      {/* Active AI image search mode */}
      {visualMatches !== null && (
        <p
          role="status"
          className="mb-4 rounded-lg border border-amber-600/30 bg-amber-950/20 px-4 py-3 text-sm text-amber-200"
        >
          Showing AI image matches. Text and category filters are
          temporarily inactive. Use Clear All Filters to return to
          normal browsing.
        </p>
      )}

      {/* Product results summary */}
      <p
        role="status"
        className="mb-5 text-sm text-zinc-400"
      >
        Showing {sortedProducts.length} of {products.length} products
      </p>

      {/* Reset all shopping filters */}
      <div className="mb-5 flex justify-end">
        <button
          type="button"
          onClick={clearAllFilters}
          className="rounded-full border border-amber-600/50 px-4 py-2 text-sm text-amber-400 transition hover:bg-amber-900/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400"
        >
          Clear All Filters
        </button>
      </div>

      {/* Products */}
      {
        sortedProducts.length === 0 ?

        (

          <div className="text-center py-12">

            <p className="text-4xl mb-4">
              🔍
            </p>

            <p className="text-gray-400 text-lg">
              No products found. Try adjusting your filters.
            </p>

          </div>

        )

        :

        (

          <div className="
            grid
            grid-cols-1
            sm:grid-cols-2
            lg:grid-cols-3
            gap-6 md:gap-8
          ">

            {
              sortedProducts.map((product) => (

                <ProductCard
                  key={product.id}
                  product={product}
                />

              ))
            }

          </div>

        )
      }

    </>
  );
}
