import sql from "@/src/lib/db";
import type { Product } from "@/src/types/product";

type DbProductRow = {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
  description: string | null;
};

export async function getProducts(): Promise<Product[]> {
  const rows = await sql<DbProductRow[]>`
    SELECT
      id,
      name,
      category,
      price,
      image,
      description
    FROM products
    ORDER BY id ASC
  `;

  return rows.map((row): Product => ({
    id: row.id,
    name: row.name,
    category: row.category,
    price: row.price,
    image: row.image,
    description: row.description,
  }));
}