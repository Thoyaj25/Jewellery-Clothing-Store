import sql from "@/src/lib/db";
import Hero from "./components/Hero";
import ProductGrid, { type Product } from "./components/ProductGrid";
import FloatingInstagram from "./components/FloatingInstagram";
import FloatingWhatsApp from "./components/FloatingWhatsApp";
import Testimonials from "./components/Testimonials";
import SpotifySection from "./components/SpotifySection";
import ShopByCategory from "./components/ShopByCategory";
import WhyChooseUs from "./components/WhyChooseUs";

export default async function Home() {
  const products = (await sql`
    SELECT
      id,
      name,
      category,
      price,
      image,
      description
    FROM products
    ORDER BY id DESC
  `) as unknown as Product[];

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-amber-950/5 to-black text-white">
      <Hero />

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

        <Testimonials />

        <ShopByCategory />

        <SpotifySection />
      </main>

      <FloatingWhatsApp />

      <FloatingInstagram />
    </div>
  );
}