import sql from "@/src/lib/db";
import ProductCard from "../components/ProductCard";

type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
  description: string | null;
};

export const dynamic = "force-dynamic";

export default async function JewelleryPage() {
  const jewellery = (await sql`
    SELECT
      id,
      name,
      category,
      price,
      image,
      description
    FROM products
    WHERE category = 'Jewellery'
    ORDER BY id DESC
  `) as unknown as Product[];

  return (
    <div className="bg-gray-50 min-h-screen">
      <main className="mx-auto max-w-5xl px-6 py-12">
        <header className="mb-8">
          <h1 className="text-3xl font-bold">Jewellery</h1>

          <p className="mt-2 text-lg text-gray-700">
            Beautiful handcrafted jewellery
          </p>
        </header>

        <section>
          {jewellery.length === 0 ? (
            <p className="text-gray-500">No jewellery products available.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {jewellery.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
