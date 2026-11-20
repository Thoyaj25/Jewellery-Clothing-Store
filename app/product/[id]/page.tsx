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

const BASE_URL = "https://ultimate-collections-store.vercel.app";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

async function findProduct(id: string) {
  const productId = Number(id);

  if (!Number.isSafeInteger(productId) || productId <= 0) {
    return null;
  }

  const products = await getProducts();
  return products.find((product) => product.id === productId) ?? null;
}

function getProductDescription(product: {
  name: string;
  category: string;
  description: string | null;
}) {
  const description =
    product.description?.trim() ||
    `${product.name} from our ${product.category} collection at Ultimate Collections. Discover elegant Indian fashion and accessories.`;

  return description.length > 160
    ? `${description.slice(0, 157).trimEnd()}...`
    : description;
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { id } = await params;
  const product = await findProduct(id);

  if (!product) {
    return {
      title: "Product Not Found",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const title = `${product.name} | ${product.category}`;
  const description = getProductDescription(product);
  const canonical = `/product/${product.id}`;

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "Ultimate Collections",
      locale: "en_IN",
      type: "website",
      images: [
        {
          url: product.image,
          alt: product.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [product.image],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function ProductById({ params }: Props) {
  const { id } = await params;
  const product = await findProduct(id);

  if (!product) {
    notFound();
  }

  const description = getProductDescription(product);
  const productUrl = `${BASE_URL}/product/${product.id}`;
  const imageUrl = new URL(product.image, BASE_URL).toString();
  const price = Number(product.price);

  const availability =
    product.stockQuantity == null
      ? undefined
      : product.stockQuantity > 0
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock";

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description,
    image: [imageUrl],
    category: product.category,
    url: productUrl,
    offers: {
      "@type": "Offer",
      url: productUrl,
      priceCurrency: "INR",
      price: price.toString(),
      ...(availability ? { availability } : {}),
    },
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 md:py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productSchema).replace(/</g, "\\u003c"),
        }}
      />

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div>
          <Image
            src={product.image}
            alt={product.name}
            width={600}
            height={600}
            priority
            className="h-[300px] w-full rounded-lg object-cover sm:h-[420px]"
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
            ₹{price.toLocaleString("en-IN")}
          </p>

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
                price,
                image: product.image,
                stockQuantity: product.stockQuantity,
              }}
            />

            <WishlistButton
              product={{
                id: product.id,
                name: product.name,
                price,
                image: product.image,
              }}
            />

            <OrderButtons
              product={{
                id: product.id,
                name: product.name,
                price,
              }}
              whatsappNumber={process.env.NEXT_PUBLIC_CONTACT_WHATSAPP}
              instagramHandle={process.env.NEXT_PUBLIC_INSTAGRAM_HANDLE}
            />
          </div>

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
              <Link href="/shipping-policy" className="text-amber-400 underline-offset-4 hover:underline">
                Shipping & Delivery
              </Link>

              <Link href="/returns-refunds" className="text-amber-400 underline-offset-4 hover:underline">
                Returns & Refunds
              </Link>

              <Link href="/contact" className="text-amber-400 underline-offset-4 hover:underline">
                Contact Support
              </Link>
            </nav>
          </section>
        </div>
      </div>
    </div>
  );
}
