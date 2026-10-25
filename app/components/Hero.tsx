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
    <section className="relative flex min-h-[480px] items-center justify-center overflow-hidden py-16 md:min-h-[520px] md:py-20 bg-gradient-to-br from-black via-amber-950/5 to-black">
      {/* Subtle champagne-gold ambient lighting */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-24 top-0 h-80 w-80 rounded-full bg-[#C5A46D]/10 blur-3xl" />
        <div className="absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-[#C5A46D]/5 blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-col items-center gap-7 px-8 text-center sm:px-6 md:gap-9">
        {/* Promotional label */}
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-amber-400 sm:text-sm">
          ✦ Timeless Indian Fashion
        </p>

        {/* Main Heading */}
        <h1 className="flex flex-col gap-2">
          <span className="block text-5xl md:text-7xl font-light text-white tracking-tight">
            Festival Ready
          </span>
          <span className="block text-5xl md:text-7xl font-light text-amber-500 tracking-tight">
            Elegance
          </span>
        </h1>

        {/* Subheading */}
        <p className="text-gray-300 text-lg md:text-xl font-light max-w-2xl mx-auto leading-relaxed">
          Discover our premium collection of handcrafted jewellery and exquisite clothing for every occasion
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-5">
          <button onClick={handleExplore} className="min-w-44 px-8 py-4 bg-gradient-to-r from-amber-600 to-amber-500 text-black font-semibold rounded-full hover:from-amber-500 hover:to-amber-400 transition-all duration-300 shadow-lg hover:shadow-amber-600/50 hover:shadow-2xl">
            Explore Collection
          </button>
          <button onClick={handleLearnMore} className="min-w-44 px-8 py-4 border border-amber-600 text-amber-600 font-semibold rounded-full hover:bg-amber-600/10 transition-all duration-300">
            Learn More
          </button>
        </div>


      </div>
    </section>
  );
}
