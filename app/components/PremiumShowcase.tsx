import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/src/domain/product";
import { getStorefrontCategory } from "@/src/lib/storefrontCategory";

type Props = {
  products: Product[];
};

export default function PremiumShowcase({ products }: Props) {
  const visible = products.filter(
    (product) => product.isVisible !== false && Boolean(product.image)
  );

  const jewellery =
    visible.find(
      (product) => getStorefrontCategory(product) === "Bridal Sets"
    ) ??
    visible.find(
      (product) => getStorefrontCategory(product) === "Necklace Sets"
    );

  const bangles = visible.find(
    (product) => getStorefrontCategory(product) === "Handmade Bangles"
  );

  const clutch =
    visible.find(
      (product) =>
        /designer clutch/i.test(product.name) &&
        getStorefrontCategory(product) === "Handbags"
    ) ??
    visible.find(
      (product) => getStorefrontCategory(product) === "Handbags"
    );

  // Verified production photographs, used only when the local
  // catalogue does not contain an eligible showcase product.
  const cards = [
    {
      product: jewellery,
      fallbackImage:
        "https://res.cloudinary.com/tkx37obw/image/upload/v1793816900/ultimate-collections/products/tisugqszyakvj2kbceup.png",
      fallbackName: "Emerald Elegance Kundan Pearl Bridal Necklace Set",
      title: "Discover Elegance in Every Detail",
      subtitle: "Explore timeless jewellery",
      href: "/jewellery",
    },
    {
      product: bangles,
      fallbackImage:
        "https://res.cloudinary.com/tkx37obw/image/upload/v1793797318/ultimate-collections/products/hokpwtev3gykygswgyz6.png",
      fallbackName: "Pink Silk Thread Peacock Motif Bangles",
      title: "Handmade Bangles",
      subtitle: "Crafted with care and love",
      href: "/jewellery?collection=Handmade%20Bangles",
    },
    {
      product: clutch,
      fallbackImage: "/products/handbags/designer-clutch.jpeg",
      fallbackName: "Premium Designer Clutch",
      title: "Designer Clutches",
      subtitle: "Make every occasion special",
      href: "/products?category=Handbags",
    },
  ];

  return (
    <section
      aria-labelledby="premium-showcase-heading"
      className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:py-16"
    >
      <div className="mb-9 text-center">
        <p className="mb-3 text-xs font-medium uppercase tracking-[0.25em] text-amber-400">
          Ultimate Collections · Signature Edit
        </p>

        <h2
          id="premium-showcase-heading"
          className="font-serif text-3xl font-light text-white sm:text-4xl"
        >
          Discover Our Signature Collections
        </h2>

        <p className="mx-auto mt-3 max-w-2xl text-sm text-gray-300 sm:text-base">
          Handpicked treasures for every beautiful occasion.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {cards.map((card, index) => (
          <Link
            key={card.title}
            href={card.href}
            className={`group relative block overflow-hidden rounded-2xl border border-amber-600/25 bg-zinc-950 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-400 ${
              index === 0 ? "md:col-span-2" : ""
            }`}
          >
            <div
              className={`relative ${
                index === 0
                  ? "h-[340px] sm:h-96"
                  : "h-[320px] sm:h-80"
              }`}
            >
              <Image
                src={card.product?.image ?? card.fallbackImage}
                alt={card.product?.name ?? card.fallbackName}
                fill
                sizes={
                  index === 0
                    ? "(max-width: 768px) 100vw, 1200px"
                    : "(max-width: 768px) 100vw, 600px"
                }
                className={`transition-transform duration-500 group-hover:scale-105 ${
                  index === 2 ? "object-contain" : "object-cover"
                }`}
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />

              <div className="absolute inset-x-0 bottom-0 p-5 pb-8 sm:p-8">
                <h3 className="max-w-xl font-serif text-2xl text-white sm:text-3xl">
                  {card.title}
                </h3>

                <p className="mt-2 text-sm text-amber-100">
                  {card.subtitle}
                </p>

                <span className="mt-4 inline-block border-b border-amber-400 pb-1 text-sm font-medium text-amber-300">
                  Explore Collection →
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
