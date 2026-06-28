import ProductCard from "../components/ProductCard";
import { products } from "../../src/lib/products";

export default function JewelleryPage() {
  const jewellery = products.filter((p) => p.category === "Jewellery");

  return (
    <div className="bg-gray-50 min-h-screen">
      <main className="mx-auto max-w-5xl px-6 py-12">
        <header className="mb-8">
          <h1 className="text-3xl font-bold">Jewellery</h1>
          <p className="mt-2 text-lg text-gray-700">Beautiful handcrafted jewellery</p>
        </header>

        <section>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {jewellery.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
