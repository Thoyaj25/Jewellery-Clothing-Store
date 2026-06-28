import ProductGrid from "@/app/components/ProductGrid";
import sql from "@/src/lib/db";

export const revalidate = 0;

export default async function ProductsPage() {
  try {
    const products = await sql`
      SELECT
        id,
        name,
        category,
        price,
        image,
        description
      FROM products
      ORDER BY id
    `;

    const mapped = products.map((p: any) => ({
      id: Number(p.id),
      name: p.name ?? "",
      category: p.category ?? "",
      price: Number(p.price ?? 0),
      image: p.image ?? "/products/placeholder.jpeg",
      description: p.description ?? "",
    }));

    return (
      <main className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-light text-white mb-6">
          Products
        </h1>

        <ProductGrid
          products={mapped}
          whatsappNumber=""
          instagramHandle=""
          initialSearch=""
          initialCategory="All"
        />
      </main>
    );
  } catch (err) {
    console.error("PRODUCT PAGE ERROR:", err);

    return (
      <main className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-red-500 text-2xl">
          Failed to load products.
        </h1>
      </main>
    );
  }
}