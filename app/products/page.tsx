import ProductGrid from "@/app/components/ProductGrid";
import { getProducts } from "@/src/lib/getProducts";

export const dynamic = "force-static";
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

export default async function ProductsPage() {
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

      <ProductGrid products={mapped} />
    </main>
  );
}