import Image from "next/image";
import { getProducts } from "@/src/lib/getProducts";
import Hero from "./components/Hero";
import ProductGrid, { type Product } from "./components/ProductGrid";
import Testimonials from "./components/Testimonials";
import SpotifySection from "./components/SpotifySection";
import ShopByCategory from "./components/ShopByCategory";
import WhyChooseUs from "./components/WhyChooseUs";
import WebsiteQRCode from "./components/WebsiteQRCode";

export const dynamic = "force-dynamic";
const PRIORITY_PRODUCT_NAME = "Designer Clutch";

function prioritizeProductOrder(products: Product[]) {
  const index = products.findIndex(
    (product) => product.name === PRIORITY_PRODUCT_NAME
  );

  if (index <= 0) {
    return products;
  }

  const prioritizedProduct = products[index];
  return [
    prioritizedProduct,
    ...products.slice(0, index),
    ...products.slice(index + 1),
  ];
}

export default async function Home() {
  const products = prioritizeProductOrder(await getProducts());

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-amber-950/5 to-black text-white">
      <Hero />

      {/* Diwali 2026 festive promotion — no automatic discount */}
      <section
        aria-label="Diwali festive collection"
        className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 md:pt-12"
      >
        <div className="relative overflow-hidden rounded-3xl border border-amber-500/40 bg-gradient-to-br from-amber-950 via-black to-amber-950 px-6 py-10 text-center shadow-xl shadow-amber-950/20 sm:px-10 md:py-14">
          <div className="pointer-events-none absolute -left-12 -top-12 h-44 w-44 rounded-full bg-amber-500/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-16 -right-12 h-48 w-48 rounded-full bg-amber-500/10 blur-3xl" />

          <div className="relative z-10">
            <p className="mb-4 text-xs font-medium uppercase tracking-[0.3em] text-amber-300 sm:text-sm">
              ✦ Ultimate Collections ✦
            </p>

            <h2 className="mb-4 text-3xl font-light tracking-wide text-amber-200 sm:text-4xl md:text-5xl">
              Diwali Sparkle Collection
            </h2>

            <p className="mx-auto mb-3 max-w-xl text-base text-amber-100 sm:text-lg">
              Celebrate the Festival of Lights with Elegance
            </p>

            <p className="mx-auto mb-8 max-w-xl text-sm leading-7 text-gray-300 sm:text-base">
              Discover festive jewellery, stylish handbags and beautiful fashion
              for your celebrations and gifting.
            </p>

            <a
              href="/products"
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-amber-400 px-8 py-3 text-sm font-semibold tracking-wide text-black transition-colors hover:bg-amber-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-300"
            >
              Explore Festive Collections
            </a>

            <p className="mt-6 text-xs tracking-widest text-amber-300/80">
              STYLE • ELEGANCE • CELEBRATION
            </p>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 py-12 md:py-20">
        <section id="collections" className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-light mb-4">
              Our Collections
            </h2>

            <p className="text-gray-300 text-base md:text-lg">
              Curated for elegance, crafted for you
            </p>
          </div>

          <ProductGrid products={products} />
        </section>

        <section className="border-t border-amber-600/20 pt-12 md:pt-20 mt-12 md:mt-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            <div className="text-center">
              <div className="text-4xl mb-4">✦</div>
              <h3 className="text-xl font-light mb-2">Premium Quality</h3>
              <p className="text-gray-400">
                Handcrafted jewellery with authentic materials
              </p>
            </div>

            <div className="text-center">
              <div className="text-4xl mb-4">✦</div>
              <h3 className="text-xl font-light mb-2">Fast Delivery</h3>
              <p className="text-gray-400">
                Quick shipping to your doorstep
              </p>
            </div>

            <div className="text-center">
              <div className="text-4xl mb-4">✦</div>
              <h3 className="text-xl font-light mb-2">24/7 Support</h3>
              <p className="text-gray-400">
                Customer support via WhatsApp & calls
              </p>
            </div>
          </div>
        </section>

        <WhyChooseUs />

        <section
          id="founder"
          className="border-t border-amber-600/20 pt-16 md:pt-24 mt-16 md:mt-24 mb-20"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
            <div className="relative mx-auto w-full max-w-md">
              <div className="absolute -inset-3 rounded-3xl bg-gradient-to-br from-amber-500/20 via-transparent to-amber-700/10 blur-xl" />

              <div className="relative overflow-hidden rounded-3xl border border-amber-600/30 bg-black">
                <Image
                  src="/images/founder/durga-prasad-founder.png"
                  alt="Durga Prasad - Founder and Creator of Ultimate Collections"
                  width={1024}
                  height={1536}
                  className="h-auto w-full object-cover"
                />
              </div>
            </div>

            <div className="text-center md:text-left">
              <p className="mb-3 text-sm uppercase tracking-[0.3em] text-amber-400">
                The Creator Behind Ultimate Collections
              </p>

              <h2 className="mb-6 text-3xl font-light sm:text-4xl md:text-5xl">
                Meet the Founder
              </h2>

              <p className="mb-5 text-lg leading-8 text-gray-300">
                Welcome to Ultimate Collections — a fashion destination
                created with a passion for elegant jewellery, sarees,
                clothing, and accessories.
              </p>

              <p className="mb-8 leading-7 text-gray-400">
                I&apos;m Durga Prasad, the creator behind Ultimate Collections.
                The vision is to bring together timeless Indian fashion and
                modern online shopping in one beautiful experience.
              </p>

              <div className="inline-flex items-center gap-3 rounded-full border border-amber-600/30 px-5 py-3 text-sm text-amber-300">
                <span className="text-lg">✦</span>
                <span>Ultimate Collections</span>
              </div>
            </div>
          </div>
        </section>

        <Testimonials />

        <ShopByCategory />

        <SpotifySection />

        <WebsiteQRCode />
      </main>


    </div>
  );
}