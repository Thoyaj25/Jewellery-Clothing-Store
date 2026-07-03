import { productRepo } from "@/src/repositories";

export async function getProducts() {
  return productRepo.getProducts();
}

export async function getProductById(id: number) {
  return productRepo.getProductById(id);
}
