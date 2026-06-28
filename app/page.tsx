"use client";

import { useState } from "react";
import Hero from "./components/Hero";
import ProductCard from "./components/ProductCard";
import FloatingInstagram from "./components/FloatingInstagram";
import FloatingWhatsApp from "./components/FloatingWhatsApp";
import Testimonials from "./components/Testimonials";
import InstagramSection from "./components/InstagramSection";
import WhyChooseUs from "./components/WhyChooseUs";
import ShopByCategory from "./components/ShopByCategory";
import SpotifySection from "./components/SpotifySection";
import { products } from "../src/lib/products";

export default function Home() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      category === "All" || product.category === category;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-amber-950/5 to-black text-white">
      <Hero />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 py-12 md:py-20">
        {/* Collections */}
        <section id="collections" className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-light text-white mb-4 tracking-tight">
              Our Collections
            </h2>

            <p className="text-gray-300 text-base md:text-lg font-light">
              Curated for elegance, crafted for you
            </p>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {[
              "All",
              "Jewellery",
              "Handbags",
              "Sarees",
              "Kurtis",
              "Kids Wear",
            ].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 md:px-6 py-2 text-sm md:text-base rounded-full font-light transition-all duration-300 ${
                  category === cat
                    ? "bg-amber-600 text-black"
                    : "border border-amber-600/30 text-white hover:border-amber-600"
                }`}
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
              className="w-full px-4 md:px-6 py-3 md:py-4 bg-black/40 border border-amber-600/30 rounded-full text-white placeholder-gray-500 focus:outline-none focus:border-amber-600 transition-colors"
            />
          </div>

          {/* Products */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-4xl mb-4">🔍</p>

              <p className="text-gray-400 text-lg">
                No products found. Try adjusting your filters.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {filteredProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </section>

        {/* Features */}
        <section className="border-t border-amber-600/20 pt-12 md:pt-20 mt-12 md:mt-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            <div className="text-center">
              <div className="text-4xl mb-4">✦</div>

              <h3 className="text-xl font-light text-white mb-2">
                Premium Quality
              </h3>

              <p className="text-gray-400 font-light">
                Handcrafted jewellery with authentic materials
              </p>
            </div>

            <div className="text-center">
              <div className="text-4xl mb-4">✦</div>

              <h3 className="text-xl font-light text-white mb-2">
                Fast Delivery
              </h3>

              <p className="text-gray-400 font-light">
                Quick shipping to your doorstep
              </p>
            </div>

            <div className="text-center">
              <div className="text-4xl mb-4">✦</div>

              <h3 className="text-xl font-light text-white mb-2">
                24/7 Support
              </h3>

              <p className="text-gray-400 font-light">
                Customer support via WhatsApp & calls
              </p>
            </div>
          </div>
        </section>

        <WhyChooseUs />

        <Testimonials />

        <ShopByCategory />

        <SpotifySection />
      </main>

      <FloatingWhatsApp />

      <FloatingInstagram />
    </div>
  );
}