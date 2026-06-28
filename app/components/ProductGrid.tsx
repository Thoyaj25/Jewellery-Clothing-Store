"use client";

import { useState } from "react";
import ProductCard from "./ProductCard";

type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
  description: string;
};

export default function ProductGrid({
  products,
  whatsappNumber,
  instagramHandle,
  initialSearch,
  initialCategory,
}: {
  products: Product[];
  whatsappNumber?: string;
  instagramHandle?: string;
  initialSearch?: string;
  initialCategory?: string;
}) {
  const [search, setSearch] = useState(initialSearch || "");
  const [category, setCategory] = useState(initialCategory || "All");

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      category === "All" || product.category === category;

    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <div className="flex flex-wrap justify-center gap-3 mb-12">
        {["All", "Jewellery"].map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className="px-4 py-2 rounded-full border border-amber-600"
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="mb-12">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-3 rounded-full text-black"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={{
              id: String(product.id),
              name: product.name,
              price: product.price,
              image: product.image,
            }}
            whatsappNumber={whatsappNumber}
            instagramHandle={instagramHandle}
          />
        ))}
      </div>
    </>
  );
}
