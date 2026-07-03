import type { ProductRepository } from "./productRepository";
import type { Product } from "@/src/domain/product";
import { products as fallbackProducts } from "@/src/lib/products";

const PRIORITY_PRODUCT_NAME = "Designer Clutch";

function prioritizeProductOrder<T extends { name: string }>(items: T[]) {
  const index = items.findIndex((item) => item.name === PRIORITY_PRODUCT_NAME);
  if (index <= 0) {
    return items;
  }

  const prioritizedItem = items[index];
  return [
    prioritizedItem,
    ...items.slice(0, index),
    ...items.slice(index + 1),
  ];
}

function normalizeStaticProduct(product: (typeof fallbackProducts)[number], index: number): Product {
  return {
    id: 1000 + index,
    name: product.name,
    category: product.category,
    price: product.price,
    image: product.image,
    description: product.description ?? "",
    badge: product.badge,
  };
}

const mockData: Product[] = prioritizeProductOrder(
  fallbackProducts.map(normalizeStaticProduct)
);

export const mockProductRepository: ProductRepository = {
  async getProducts() {
    return mockData;
  },

  async getProductById(id) {
    return mockData.find((product) => product.id === id) ?? null;
  },
};
