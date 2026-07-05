import sql from "@/src/lib/db";
import type { Product } from "@/src/domain/product";
import type { ProductRepository } from "./productRepository";

type ProductRow = Product;

type CreateProductInput = Omit<Product, "id">;
type UpdateProductInput = Omit<Product, "id">;

export const postgresProductRepository: ProductRepository = {
  async getProducts(): Promise<Product[]> {
    const rows = await sql`
      SELECT
        id,
        name,
        category,
        price,
        image,
        description
      FROM products
      ORDER BY id;
    `;

    return rows as ProductRow[];
  },

  async getProductById(id: number): Promise<Product | null> {
    const rows = await sql`
      SELECT
        id,
        name,
        category,
        price,
        image,
        description
      FROM products
      WHERE id = ${id}
      LIMIT 1;
    `;

    return (rows as ProductRow[])[0] ?? null;
  },

  async createProduct(product: CreateProductInput): Promise<Product> {
    const rows = await sql`
      INSERT INTO products (
        name,
        category,
        price,
        image,
        description
      )
      VALUES (
        ${product.name},
        ${product.category},
        ${product.price},
        ${product.image},
        ${product.description}
      )
      RETURNING
        id,
        name,
        category,
        price,
        image,
        description;
    `;

    return (rows as ProductRow[])[0];
  },

  async updateProduct(
    id: number,
    product: UpdateProductInput
  ): Promise<Product | null> {
    const rows = await sql`
      UPDATE products
      SET
        name = ${product.name},
        category = ${product.category},
        price = ${product.price},
        image = ${product.image},
        description = ${product.description}
      WHERE id = ${id}
      RETURNING
        id,
        name,
        category,
        price,
        image,
        description;
    `;

    return (rows as ProductRow[])[0] ?? null;
  },

  async deleteProduct(id: number): Promise<boolean> {
    const rows = await sql`
      DELETE FROM products
      WHERE id = ${id}
      RETURNING id;
    `;

    return rows.length > 0;
  },

  async deleteProducts(ids: number[]): Promise<number> {
    const rows = await sql`
      DELETE FROM products
      WHERE id = ANY(${ids})
      RETURNING id;
    `;

    return rows.length;
  },
};