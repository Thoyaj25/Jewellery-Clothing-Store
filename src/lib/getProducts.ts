import type { Product } from "@/src/types/product";
import { getVisibleProducts as getVisibleProductsFromService } from "@/src/services/productService";

export async function getProducts(): Promise<Product[]> {
  return getVisibleProductsFromService();
}
