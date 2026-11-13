import Image from "next/image";
import type { Metadata } from "next";
import { DIWALI_OFFER } from "@/src/lib/diwaliOffer";
import { getProducts } from "@/src/lib/getProducts";
import Hero from "./components/Hero";
import PremiumShowcase from "./components/PremiumShowcase";
import DiwaliUtsavMotion from "./components/DiwaliUtsavMotion";
import ProductGrid, { type Product } from "./components/ProductGrid";
import Testimonials from "./components/Testimonials";
import StyleStoriesIndia from "./components/StyleStoriesIndia";
import SpotifySection from "./components/SpotifySection";
import ShopByCategory from "./components/ShopByCategory";
import WhyChooseUs from "./components/WhyChooseUs";
import WebsiteQRCode from "./components/WebsiteQRCode";

export const dynamic = "force-dynamic";

const SITE_URL = "https://ultimate-collections-store.vercel.app";

export const metadata: Metadata = {
  title: "Indian Imitation Jewellery, Sarees & Fashion",
  description:
    "Shop imitation jewellery, designer clutches, sarees, kurtis and fashion accessories at Ultimate Collections. Discover elegant styles for every occasion.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Indian Imitation Jewellery, Sarees & Fashion",
    description:
      "Shop imitation jewellery, designer clutches, sarees, kurtis and fashion accessories at Ultimate Collections. Discover elegant styles for every occasion.",
    url: "/",
    siteName: "Ultimate Collections",
    locale: "en_IN",
    type: "website",
    images: [{
      url: "/og-image.jpeg",
      width: 1200,
      height: 1600,
      alt: "Ultimate Collections — Indian jewellery and fashion",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Indian Imitation Jewellery, Sarees & Fashion",
    description:
      "Shop imitation jewellery, designer clutches, sarees, kurtis and fashion accessories at Ultimate Collections. Discover elegant styles for every occasion.",
    images: ["/og-image.jpeg"],
  },
};

const homepageStructuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "Ultimate Collections",
      url: SITE_URL,
      logo: `${SITE_URL}/images/ultimate-collections-logo-transparent.png`,
      email: "prasadpj509@gmail.com",
      telephone: "+91 9490731606",
      address: {
        "@type": "PostalAddress",
        streetAddress: "5/200, KPT Street",
        addressLocality: "Venkatagirikota",
        addressRegion: "Andhra Pradesh",
        postalCode: "517424",
        addressCountry: "IN",
      },
      sameAs: [
        "https://instagram.com/durgapj.badri",
        "https://www.facebook.com/durgapj.badri9974",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: "Ultimate Collections",
      publisher: { "@id": `${SITE_URL}/#organization` },
    },
  ],
};
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

async function isDiwaliPromotionActive(): Promise<boolean> {
  const { connection } = await import("next/server");
  await connection();

  const now = Date.now();

  return (
    now >= Date.parse(DIWALI_OFFER.startsAt) &&
    now < Date.parse(DIWALI_OFFER.endsAt)
  );
}

export default async function Home() {
  const products = prioritizeProductOrder(await getProducts());
  const showDiwaliBanner = await isDiwaliPromotionActive();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(homepageStructuredData).replace(/</g, "\\u003c"),
        }}
      />
    <div className="min-h-screen bg-gradient-to-b from-black via-amber-950/5 to-black text-white">

      <Hero />


      {/* Diwali Utsav 2026 — animated festive promotion */}
      {showDiwaliBanner && <DiwaliUtsavMotion />}

      {/* Premium product showcase — uses existing visible catalogue */}
      <PremiumShowcase products={products} />

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

        <StyleStoriesIndia />

        <Testimonials />

        <ShopByCategory />

        <SpotifySection />

        <WebsiteQRCode />
      </main>


    </div>
    </>
  );
}
