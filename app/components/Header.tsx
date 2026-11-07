"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "../context/CartProvider";
import { useWishlist } from "../context/WishlistProvider";

export default function Header() {
  const { totalCount } = useCart();
  const { totalCount: wishlistCount, mounted: wishlistMounted } = useWishlist();
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
          {/* Royal Ultimate Collections generated logo */}
          <Link
            href="/"
            aria-label="Ultimate Collections homepage"
            className="flex min-w-0 shrink-0 items-center"
          >
            <Image
              src="/images/ultimate-collections-logo-transparent.png"
              alt="Ultimate Collections — Style, Elegance, Trust"
              width={1672}
              height={941}
              priority
              sizes="(max-width: 640px) 176px, 260px"
              className="block h-auto w-[176px] max-w-[42vw] object-contain sm:w-[220px] md:w-[260px]"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="uc-desktop-nav hidden items-center gap-8">
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
              href="/products"
              className="text-white hover:text-amber-600 transition text-sm font-light"
            >
              Collections
            </Link>

            <Link
              href="/reviews"
              className="text-white hover:text-amber-600 transition text-sm font-light"
            >
              Reviews
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
            <button
              type="button"
              onClick={() => router.push("/wishlist")}
              aria-label="Open wishlist"
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-amber-600/10 transition relative"
            >
              <span className="text-xl">♡</span>

              {wishlistMounted && wishlistCount > 0 && (
                <span className="absolute top-0 right-0 bg-amber-600 text-black text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {wishlistCount}
                </span>
              )}
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
              className="uc-mobile-toggle flex w-10 h-10 items-center justify-center rounded-full hover:bg-amber-600/10 transition"
            >
              <span className="text-xl">☰</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="uc-mobile-nav mt-4 pb-4 flex flex-col gap-3 border-t border-amber-600/20 pt-4">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="text-white hover:text-amber-600 transition text-sm font-light"
            >
              Home
            </Link>

            <Link
              href="/jewellery"
              onClick={() => setMobileMenuOpen(false)}
              className="text-white hover:text-amber-600 transition text-sm font-light"
            >
              Jewellery
            </Link>

            <Link
              href="/products"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between text-white hover:text-amber-600 transition text-sm font-light"
            >
              <span>Collections</span>
            </Link>

            <Link
              href="/wishlist"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between text-white hover:text-amber-600 transition text-sm font-light"
            >
              <span>Wishlist</span>
              {wishlistMounted && wishlistCount > 0 && (
                <span className="rounded-full bg-amber-600 px-2 py-0.5 text-xs font-bold text-black">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <Link
              href="/cart"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between text-white hover:text-amber-600 transition text-sm font-light"
            >
              <span>Cart</span>
              {mounted && totalCount > 0 && (
                <span className="rounded-full bg-amber-600 px-2 py-0.5 text-xs font-bold text-black">
                  {totalCount}
                </span>
              )}
            </Link>

            <Link
              href="/reviews"
              onClick={() => setMobileMenuOpen(false)}
              className="text-white hover:text-amber-600 transition text-sm font-light"
            >
              Reviews
            </Link>

            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="text-white hover:text-amber-600 transition text-sm font-light"
            >
              Contact
            </Link>
          </nav>
        )}
      </div>
      <style jsx>{`
        @media (min-width: 768px) {
          .uc-desktop-nav {
            display: flex;
          }

          .uc-mobile-toggle,
          .uc-mobile-nav {
            display: none;
          }
        }

        @media (max-width: 767px) {
          .uc-desktop-nav {
            display: none;
          }

          .uc-mobile-toggle {
            display: flex;
          }
        }
      `}</style>
    </header>
  );
}