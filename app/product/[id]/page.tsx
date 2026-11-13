import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { getProducts } from "@/src/lib/getProducts";
import AddToCart from "@/app/components/AddToCart";
import ProductImageViewer from "@/app/components/ProductImageViewer";
import OrderButtons from "@/app/components/OrderButtons";
import WishlistButton from "@/app/components/WishlistButton";

export const dynamic = "force-dynamic";

const SITE_URL = "https://ultimate-collections-store.vercel.app";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

async function getProductById(id: string) {
  const productId = Number(id);

  if (!Number.isInteger(productId) || productId <= 0) {
    return null;
  }

  const products = await getProducts();
  return products.find((product) => product.id === productId) ?? null;
}

function getProductDescription(description: string | null, name: string) {
  const fallback = `${name} available at Ultimate Collections. Explore our jewellery and fashion collection.`;

  const value = description?.trim() || fallback;

  return value.length > 160
    ? `${value.slice(0, 157).trimEnd()}...`
    : value;
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    return {
      title: "Product Not Found",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const title = product.name;
  const description = getProductDescription(
    product.description,
    product.name
  );
  const productUrl = `${SITE_URL}/product/${product.id}`;
  const imageUrl = product.image.startsWith("http")
    ? product.image
    : new URL(product.image, SITE_URL).toString();

  return {
    title,
    description,
    alternates: {
      canonical: productUrl,
    },
    openGraph: {
      type: "website",
      title,
      description,
      url: productUrl,
      siteName: "Ultimate Collections",
      locale: "en_IN",
      images: [
        {
          url: imageUrl,
          alt: product.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

export default async function ProductById({ params }: Props) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  const productUrl = `${SITE_URL}/product/${product.id}`;
  const imageUrl = product.image.startsWith("http")
    ? product.image
    : new URL(product.image, SITE_URL).toString();

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description || `${product.name} available at Ultimate Collections.`,
    image: imageUrl,
    url: productUrl,
    offers: {
      "@type": "Offer",
      url: productUrl,
      priceCurrency: "INR",
      price: Number(product.price).toFixed(2),
      ...(product.stockQuantity != null && {
        availability:
          product.stockQuantity > 0
            ? "https://schema.org/InStock"
            : "https://schema.org/OutOfStock",
      }),
    },
  };

  const safeJsonLd = JSON.stringify(productJsonLd).replace(/</g, "\\u003c");

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd }}
      />

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 md:py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div>
            <Image
              src={product.image}
              alt={product.name}
              width={600}
              height={600}
              priority
              className="h-[300px] w-full rounded-lg bg-zinc-950 object-contain p-3 sm:h-[420px]"
            />
            <ProductImageViewer
              src={product.image}
              alt={product.name}
            />
          </div>

          <div className="flex flex-col">
            <p className="text-sm uppercase tracking-wide text-amber-500">
              {product.category}
            </p>

            <h1 className="mt-2 font-serif text-3xl font-normal leading-tight tracking-tight text-white md:text-4xl">
              {product.name}
            </h1>

            <p className="mt-4 text-3xl font-semibold text-amber-500">
              ₹{Number(product.price).toLocaleString("en-IN")}
            </p>

            {/* Product availability */}
            {product.stockQuantity != null && (
              <div className="mt-4">
                <span
                  className={`inline-flex rounded-full border px-3 py-1.5 text-sm font-medium ${
                    product.stockQuantity === 0
                      ? "border-red-800/50 bg-red-950 text-red-300"
                      : product.stockQuantity === 1
                        ? "border-amber-700/50 bg-amber-950 text-amber-300"
                        : "border-emerald-800/50 bg-emerald-950 text-emerald-300"
                  }`}
                >
                  {product.stockQuantity === 0
                    ? "Out of Stock"
                    : product.stockQuantity === 1
                      ? `Only ${product.stockQuantity} Left`
                      : "In Stock"}
                </span>
              </div>
            )}

            <p className="mt-6 leading-relaxed text-gray-300">
              {product.description}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2 [&>div]:mt-0 [&>button]:mt-0">
              <AddToCart
                product={{
                  id: product.id,
                  name: product.name,
                  price: Number(product.price),
                  image: product.image,
                  stockQuantity: product.stockQuantity,
                }}
              />

              <WishlistButton
                product={{
                  id: product.id,
                  name: product.name,
                  price: Number(product.price),
                  image: product.image,
                }}
              />

              <OrderButtons
                product={{
                  id: product.id,
                  name: product.name,
                  price: Number(product.price),
                }}
                whatsappNumber={process.env.NEXT_PUBLIC_CONTACT_WHATSAPP}
                instagramHandle={process.env.NEXT_PUBLIC_INSTAGRAM_HANDLE}
              />
            </div>

            {/* Customer shopping information */}
            <section
              aria-label="Shopping information"
              className="mt-8 border-t border-zinc-800 pt-6"
            >
              <h2 className="text-lg font-semibold text-white">
                Shopping Information
              </h2>

              <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                Shipping charges, delivery availability and return
                eligibility are subject to our store policies.
              </p>

              <nav
                aria-label="Shopping policies and support"
                className="mt-4 flex flex-wrap gap-x-5 gap-y-3 text-sm"
              >
                <Link
                  href="/shipping-policy"
                  className="text-amber-400 underline-offset-4 hover:underline"
                >
                  Shipping & Delivery
                </Link>

                <Link
                  href="/returns-refunds"
                  className="text-amber-400 underline-offset-4 hover:underline"
                >
                  Returns & Refunds
                </Link>

                <Link
                  href="/contact"
                  className="text-amber-400 underline-offset-4 hover:underline"
                >
                  Contact Support
                </Link>
              </nav>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}