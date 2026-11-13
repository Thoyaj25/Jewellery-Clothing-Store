import type { Metadata } from "next";
import ProductGrid from "@/app/components/ProductGrid";
import { getProducts } from "@/src/lib/getProducts";

export const metadata: Metadata = {
  title: "Shop All Products Online in India",
  description:
    "Explore imitation jewellery, designer clutches, sarees, kurtis and fashion accessories at Ultimate Collections. Find elegant styles for every occasion.",
  alternates: {
    canonical: "/products",
  },
  openGraph: {
    title: "Shop All Products | Ultimate Collections",
    description:
      "Explore jewellery, designer clutches, sarees, kurtis and fashion accessories at Ultimate Collections.",
    url: "https://ultimate-collections-store.vercel.app/products",
    siteName: "Ultimate Collections",
    locale: "en_IN",
    type: "website",
    images: [{
      url: "/og-image.jpeg",
      width: 1200,
      height: 1600,
      alt: "Ultimate Collections - Jewellery and Fashion",
    }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og-image.jpeg"],
    title: "Shop All Products | Ultimate Collections",
    description:
      "Explore jewellery, designer clutches, sarees, kurtis and fashion accessories at Ultimate Collections.",
  },
};

export const dynamic = "force-dynamic";
const PRIORITY_PRODUCT_NAME = "Designer Clutch";

function prioritizeProductOrder(products: Awaited<ReturnType<typeof getProducts>>) {
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

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string | string[] }>;
}) {
  const params = await searchParams;
  const initialCategory =
    typeof params.category === "string" ? params.category : undefined;

  const products = await getProducts();

  const mapped = prioritizeProductOrder(products).map((p) => ({
    ...p,
    description: p.description ?? "",
  }));

  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-light text-white mb-6">
        Products
      </h1>

      <ProductGrid key={initialCategory ?? "All"} products={mapped} initialCategory={initialCategory} />
    </main>
  );
}