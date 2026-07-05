import type { Product } from "@/src/domain/product";

export interface ProductRepository {
  getProducts(): Promise<Product[]>;
  getProductById(id: number): Promise<Product | null>;
  createProduct(product: Omit<Product, "id">): Promise<Product>;
  updateProduct(id: number, product: Omit<Product, "id">): Promise<Product | null>;
  deleteProduct(id: number): Promise<boolean>;

  deleteProducts(ids: number[]): Promise<number>;
}