"use client";

import { usePathname, useRouter } from "next/navigation";

export default function HeroActions() {
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
    <div className="flex flex-wrap items-center justify-center gap-5">
      <button
        onClick={handleExplore}
        className="min-w-44 px-8 py-4 bg-gradient-to-r from-amber-600 to-amber-500 text-black font-semibold rounded-full hover:from-amber-500 hover:to-amber-400 transition-all duration-300 shadow-lg hover:shadow-amber-600/50 hover:shadow-2xl"
      >
        Explore Collection
      </button>

      <button
        onClick={handleLearnMore}
        className="min-w-44 px-8 py-4 border border-amber-600 text-amber-600 font-semibold rounded-full hover:bg-amber-600/10 transition-all duration-300"
      >
        Learn More
      </button>
    </div>
  );
}
