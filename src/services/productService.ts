import { productRepo } from "@/src/repositories";
import type { Product } from "@/src/domain/product";

export async function getProducts() {
  return productRepo.getProducts();
}

export async function getProductById(id: number) {
  return productRepo.getProductById(id);
}

export async function createProduct(
  product: Omit<Product, "id">
) {
  return productRepo.createProduct(product);
}

export async function updateProduct(
  id: number,
  product: Omit<Product, "id">
) {
  return productRepo.updateProduct(id, product);
}

export async function deleteProduct(id: number) {
  return productRepo.deleteProduct(id);
}