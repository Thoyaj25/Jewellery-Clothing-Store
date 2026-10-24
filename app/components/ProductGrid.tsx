"use client";

import { useState } from "react";
import ProductCard from "./ProductCard";

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
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("default");


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


    return matchesSearch && matchesCategory;

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


      {/* Search */}
      <div className="mb-12">

        <input
          type="text"
          placeholder="Search for jewellery, clothing..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="
            w-full
            px-4 md:px-6
            py-3 md:py-4
            bg-black/40
            border border-amber-600/30
            rounded-full
            text-white
            placeholder-gray-500
            focus:outline-none
            focus:border-amber-600
          "
        />

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
