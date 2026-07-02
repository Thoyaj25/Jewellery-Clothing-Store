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


  const categories = [
    "All",
    "Jewellery",
    "Handbags",
    "Sarees",
    "Kurtis",
    "Kids Wear",
  ];


  const filteredProducts = products.filter((product) => {

    const matchesSearch =
      product.name
        .toLowerCase()
        .includes(search.toLowerCase());


    const matchesCategory =
      category === "All" ||
      product.category === category;


    return matchesSearch && matchesCategory;

  });


  return (
    <>

      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-3 mb-12">

        {categories.map((cat) => (

          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`
              px-4 md:px-6 py-2
              rounded-full
              text-sm md:text-base
              transition-all
              border
              ${
                category === cat
                  ? "bg-amber-600 text-black border-amber-600"
                  : "text-white border-amber-600/30 hover:border-amber-600"
              }
            `}
          >
            {cat}
          </button>

        ))}

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



      {/* Products */}
      {
        filteredProducts.length === 0 ?

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
              filteredProducts.map((product) => (

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