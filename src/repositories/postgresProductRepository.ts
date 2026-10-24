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
  stockQuantity: row.stockQuantity ?? null,
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
        is_visible AS "isVisible",
        stock_quantity AS "stockQuantity"
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
        is_visible AS "isVisible",
        stock_quantity AS "stockQuantity"
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
        is_visible AS "isVisible",
        stock_quantity AS "stockQuantity"
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
        is_visible,
        stock_quantity
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING
        id,
        name,
        category,
        price,
        image,
        description,
        is_visible AS "isVisible",
        stock_quantity AS "stockQuantity";
    `, [product.name, product.category, product.price, product.image, product.description, isVisible, product.stockQuantity ?? null]);

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
        is_visible = COALESCE($6, is_visible),
        stock_quantity = CASE
          WHEN $8::boolean THEN $9::integer
          ELSE stock_quantity
        END
      WHERE id = $7
        AND (
          NOT ($8::boolean AND $9::integer IS NULL)
          OR NOT EXISTS (
            SELECT 1
            FROM public.order_items oi
            JOIN public.orders o ON o.id = oi.order_id
            WHERE oi.product_id = products.id
              AND oi.stock_reserved_quantity > 0
              AND o.status = 'Requested'
          )
        )
      RETURNING
        id,
        name,
        category,
        price,
        image,
        description,
        is_visible AS "isVisible",
        stock_quantity AS "stockQuantity";
    `, [product.name, product.category, product.price, product.image, product.description, product.isVisible ?? null, id, product.stockQuantity !== undefined, product.stockQuantity ?? null]);

    return rows[0] ? normalizeProduct(rows[0]) : null;
  },

  async deleteProduct(id: number): Promise<boolean> {
    const { rows } = await query<{ id: number }>(`
      DELETE FROM products
      WHERE id = $1
        AND NOT EXISTS (
          SELECT 1
          FROM public.order_items oi
          WHERE oi.product_id = products.id
        )
      RETURNING id;
    `, [id]);

    return rows.length > 0;
  },

  async deleteProducts(ids: number[]): Promise<number> {
    const { rows } = await query<{ id: number }>(`
      DELETE FROM products
      WHERE id = ANY($1)
        AND NOT EXISTS (
          SELECT 1
          FROM public.order_items oi
          WHERE oi.product_id = products.id
        )
      RETURNING id;
    `, [ids]);

    return rows.length;
  },
};