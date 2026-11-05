import Link from "next/link";
import { getProducts } from "@/src/lib/getProducts";
import ProductCard from "../components/ProductCard";
import {
  JEWELLERY_COLLECTIONS,
  getJewelleryCollection,
} from "@/src/lib/jewelleryCollections";

export const dynamic = "force-dynamic";

const COLLECTIONS = [
  ...JEWELLERY_COLLECTIONS,
  "Other Jewellery",
] as const;

// Reviewed existing jewellery products outside the five main groups.
// New Earrings and Other Jewellery products are included automatically.
const OTHER_JEWELLERY_IDS = new Set([
  10, 14, 15, 16, 17, 18,
  35, 40, 47, 48, 72,
]);

export default async function JewelleryPage({
  searchParams,
}: {
  searchParams: Promise<{ collection?: string | string[] }>;
}) {
  const params = await searchParams;
  const allProducts = await getProducts();

  const groups = COLLECTIONS.map((name) => {
    const products = allProducts.filter((product) => {
      const collection = getJewelleryCollection(product);

      if (name !== "Other Jewellery") {
        return collection === name;
      }

      return (
        collection === null &&
        (
          OTHER_JEWELLERY_IDS.has(product.id) ||
          product.category === "Other Jewellery" ||
          product.category === "Earrings"
        )
      );
    });

    return { name, products };
  });

  const requested = typeof params.collection === "string"
    ? params.collection
    : undefined;

  const selected = groups.find(
    (group) => group.name === requested
  ) ?? groups[0];

  return (
    <main className="min-h-screen bg-black px-4 py-12 text-white">
      <div className="mx-auto max-w-6xl">
        <header className="mb-10 text-center">
          <h1 className="font-serif text-3xl text-amber-400 sm:text-4xl">
            Explore Our Jewellery Collections
          </h1>
          <p className="mt-3 text-zinc-400">
            Discover beautiful designs for every occasion.
          </p>
        </header>

        <nav
          aria-label="Jewellery collections"
          className="mb-10 grid grid-cols-2 gap-3 sm:grid-cols-3"
        >
          {groups.map((group) => {
            const active = group.name === selected.name;

            return (
              <Link
                key={group.name}
                href={`/jewellery?collection=${encodeURIComponent(group.name)}`}
                aria-current={active ? "page" : undefined}
                className={`rounded-xl border p-4 text-center transition ${
                  active
                    ? "border-amber-400 bg-amber-950/40 text-amber-300"
                    : "border-amber-600/20 bg-zinc-950 text-white hover:border-amber-500/60"
                }`}
              >
                <span className="block font-medium">
                  {group.name}
                </span>
                <span className="mt-1 block text-xs text-zinc-400">
                  {group.products.length} products
                </span>
              </Link>
            );
          })}
        </nav>

        <section>
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-serif text-2xl text-amber-400">
              {selected.name}
            </h2>
            <Link
              href="/products"
              className="text-sm text-amber-300 hover:underline"
            >
              Shop All Products
            </Link>
          </div>

          {selected.products.length === 0 ? (
            <p className="py-12 text-center text-zinc-400">
              No products currently available in this collection.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {selected.products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
