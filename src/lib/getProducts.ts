import sql from "@/src/lib/db";

export async function getProducts() {
  return await sql`
    SELECT *
    FROM products
    ORDER BY id
  `;
}
