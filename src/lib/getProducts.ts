import type { Product } from "@/src/types/product";
import { getProducts as getProductsFromService } from "@/src/services/productService";

export async function getProducts(): Promise<Product[]> {
  return getProductsFromService();
}
