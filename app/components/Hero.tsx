"use client";

import { usePathname, useRouter } from "next/navigation";

export default function Hero() {
  const pathname = usePathname();
  const router = useRouter();

  const handleExplore = () => {
    if (pathname === "/") {
      const el = document.getElementById("collections");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
        return;
      }
    }

    router.push("/products");
  };

  const handleLearnMore = () => {
    router.push("/contact");
  };

  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-black via-amber-950/5 to-black">
      {/* Background Image Overlay */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-600/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-green-600/20 rounded-full blur-3xl animate-pulse"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        {/* Top Badges */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-8 flex-wrap">
          <div className="px-4 py-2 border border-amber-600/50 rounded-full text-sm text-amber-600 font-light">
            ✨ ORDERS ABOVE ₹999
          </div>
          <div className="px-4 py-2 border border-amber-600/50 rounded-full text-sm text-amber-600 font-light">
            ✦ HANDCRAFTED JEWELLERY
          </div>
          <div className="px-4 py-2 border border-amber-600/50 rounded-full text-sm text-amber-600 font-light">
            ✦ AUTHENTIC
          </div>
        </div>

        {/* Featured Badge */}
        <div className="mb-6 inline-block">
          <span className="px-6 py-2 border border-amber-500/50 rounded-full text-sm text-amber-500 font-light tracking-widest">
            ✦ NEW COLLECTION 2026
          </span>
        </div>

        {/* Main Heading */}
        <h1 className="mb-6">
          <span className="block text-5xl md:text-7xl font-light text-white mb-2 tracking-tight">
            Festival Ready
          </span>
          <span className="block text-5xl md:text-7xl font-light text-amber-500 tracking-tight">
            Elegance
          </span>
        </h1>

        {/* Subheading */}
        <p className="text-gray-300 text-lg md:text-xl font-light mb-8 max-w-2xl mx-auto leading-relaxed">
          Discover our premium collection of handcrafted jewellery and exquisite clothing for every occasion
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-4">
          <button onClick={handleExplore} className="px-8 py-3 bg-gradient-to-r from-amber-600 to-amber-500 text-black font-semibold rounded-full hover:from-amber-500 hover:to-amber-400 transition-all duration-300 shadow-lg hover:shadow-amber-600/50 hover:shadow-2xl">
            Explore Collection
          </button>
          <button onClick={handleLearnMore} className="px-8 py-3 border border-amber-600 text-amber-600 font-semibold rounded-full hover:bg-amber-600/10 transition-all duration-300">
            Learn More
          </button>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg
            className="w-6 h-6 text-amber-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      </div>
    </section>
  );
}
