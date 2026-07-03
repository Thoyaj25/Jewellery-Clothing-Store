import type { Product } from "@/src/domain/product";

export interface ProductRepository {
  getProducts(): Promise<Product[]>;
  getProductById(id: number): Promise<Product | null>;
}
