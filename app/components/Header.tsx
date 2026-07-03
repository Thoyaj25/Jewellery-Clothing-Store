"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "../context/CartProvider";

export default function Header() {
  const { totalCount } = useCart();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Prevent hydration mismatch
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const handleMount = () => {
      setMounted(true);
    };
    handleMount();
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-amber-600/20">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex flex-col items-center group">
            <span className="text-xs tracking-widest text-amber-600 font-light">
              THE
            </span>
            <span className="text-2xl font-light tracking-widest text-white">
              Ultimate
            </span>
            <span className="text-xs tracking-widest text-amber-600 font-light">
              COLLECTIONS
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className="text-white hover:text-amber-600 transition text-sm font-light"
            >
              Home
            </Link>

            <Link
              href="/jewellery"
              className="text-white hover:text-amber-600 transition text-sm font-light"
            >
              Jewellery
            </Link>

            <Link
              href="/contact"
              className="text-white hover:text-amber-600 transition text-sm font-light"
            >
              Contact
            </Link>
          </nav>

          {/* Right Icons */}
          <div className="flex items-center gap-4">
            {/* Wishlist */}
            <button onClick={() => router.push("/products")} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-amber-600/10 transition">
              <span className="text-xl">♡</span>
            </button>

            {/* Cart */}
            <Link
              href="/cart"
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-amber-600/10 transition relative"
            >
              <span className="text-xl">🛍️</span>

              {mounted && totalCount > 0 && (
                <span className="absolute top-0 right-0 bg-amber-600 text-black text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {totalCount}
                </span>
              )}
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden w-10 h-10 flex items-center justify-center rounded-full hover:bg-amber-600/10 transition"
            >
              <span className="text-xl">☰</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 flex flex-col gap-3 border-t border-amber-600/20 pt-4">
            <Link
              href="/"
              className="text-white hover:text-amber-600 transition text-sm font-light"
            >
              Home
            </Link>

            <Link
              href="/jewellery"
              className="text-white hover:text-amber-600 transition text-sm font-light"
            >
              Jewellery
            </Link>

            <Link
              href="/contact"
              className="text-white hover:text-amber-600 transition text-sm font-light"
            >
              Contact
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}