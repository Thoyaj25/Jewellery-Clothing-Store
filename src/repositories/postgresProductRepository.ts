import { query } from "@/src/lib/db";
import type { Product } from "@/src/domain/product";
import type { ProductRepository } from "./productRepository";

type ProductRow = Product & {
  is_visible?: boolean;
  isVisible?: boolean;
};

type CreateProductInput = Omit<Product, "id">;
type UpdateProductInput = Omit<Product, "id">;

const normalizeProduct = (row: Partial<ProductRow>): Product => ({
  id: row.id ?? 0,
  name: row.name ?? "",
  category: row.category ?? "",
  price: Number(row.price ?? 0),
  image: row.image ?? "",
  description: row.description ?? null,
  badge: row.badge,
  isVisible: row.isVisible ?? row.is_visible ?? true,
});

export const postgresProductRepository: ProductRepository = {
  async getProducts(): Promise<Product[]> {
    const { rows } = await query<ProductRow>(`
      SELECT
        id,
        name,
        category,
        price,
        image,
        description,
        is_visible AS "isVisible"
      FROM products
      ORDER BY id;
    `);

    return rows.map(normalizeProduct);
  },

  async getVisibleProducts(): Promise<Product[]> {
    const { rows } = await query<ProductRow>(`
      SELECT
        id,
        name,
        category,
        price,
        image,
        description,
        is_visible AS "isVisible"
      FROM products
      WHERE is_visible = TRUE
      ORDER BY id;
    `);

    return rows.map(normalizeProduct);
  },

  async getProductById(id: number): Promise<Product | null> {
    const { rows } = await query<ProductRow>(`
      SELECT
        id,
        name,
        category,
        price,
        image,
        description,
        is_visible AS "isVisible"
      FROM products
      WHERE id = $1
      LIMIT 1;
    `, [id]);

    return rows[0] ? normalizeProduct(rows[0]) : null;
  },

  async createProduct(product: CreateProductInput): Promise<Product> {
    const isVisible = product.isVisible ?? true;

    const { rows } = await query<ProductRow>(`
      INSERT INTO products (
        name,
        category,
        price,
        image,
        description,
        is_visible
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING
        id,
        name,
        category,
        price,
        image,
        description,
        is_visible AS "isVisible";
    `, [product.name, product.category, product.price, product.image, product.description, isVisible]);

    return normalizeProduct(rows[0]);
  },

  async updateProduct(
    id: number,
    product: UpdateProductInput
  ): Promise<Product | null> {
    const { rows } = await query<ProductRow>(`
      UPDATE products
      SET
        name = $1,
        category = $2,
        price = $3,
        image = $4,
        description = $5,
        is_visible = COALESCE($6, is_visible)
      WHERE id = $7
      RETURNING
        id,
        name,
        category,
        price,
        image,
        description,
        is_visible AS "isVisible";
    `, [product.name, product.category, product.price, product.image, product.description, product.isVisible ?? null, id]);

    return rows[0] ? normalizeProduct(rows[0]) : null;
  },

  async deleteProduct(id: number): Promise<boolean> {
    const { rows } = await query<{ id: number }>(`
      DELETE FROM products
      WHERE id = $1
      RETURNING id;
    `, [id]);

    return rows.length > 0;
  },

  async deleteProducts(ids: number[]): Promise<number> {
    const { rows } = await query<{ id: number }>(`
      DELETE FROM products
      WHERE id = ANY($1)
      RETURNING id;
    `, [ids]);

    return rows.length;
  },
};