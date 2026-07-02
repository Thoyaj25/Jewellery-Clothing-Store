import ProductGrid from "@/app/components/ProductGrid";
import { getProducts } from "@/src/lib/getProducts";

export const revalidate = 0;

export default async function ProductsPage() {
  const products = await getProducts();

  const mapped = products.map((p) => ({
    ...p,
    description: p.description ?? "",
  }));

  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-light text-white mb-6">
        Products
      </h1>

      <ProductGrid products={mapped} />
    </main>
  );
}