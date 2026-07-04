import type { ProductRepository } from "./productRepository";
import type { Product } from "@/src/domain/product";
import { products as fallbackProducts } from "@/src/lib/products";

const PRIORITY_PRODUCT_NAME = "Designer Clutch";

function prioritizeProductOrder<T extends { name: string }>(items: T[]) {
  const index = items.findIndex(
    (item) => item.name === PRIORITY_PRODUCT_NAME
  );

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

function normalizeStaticProduct(
  product: (typeof fallbackProducts)[number],
  index: number
): Product {
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

  async createProduct(product) {
    const newProduct: Product = {
      id: Math.max(...mockData.map((p) => p.id), 0) + 1,
      ...product,
    };

    mockData.push(newProduct);

    return newProduct;
  },

  async updateProduct(id, product) {
    const index = mockData.findIndex((p) => p.id === id);

    if (index === -1) {
      return null;
    }

    mockData[index] = {
      id,
      ...product,
    };

    return mockData[index];
  },

  async deleteProduct(id) {
    const index = mockData.findIndex((p) => p.id === id);

    if (index === -1) {
      return false;
    }

    mockData.splice(index, 1);

    return true;
  },
};