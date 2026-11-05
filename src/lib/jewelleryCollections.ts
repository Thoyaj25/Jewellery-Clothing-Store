import type { Product } from "@/src/domain/product";

export const JEWELLERY_COLLECTIONS = [
  "Bridal Sets",
  "Long Harams",
  "Handmade Bangles",
  "Bangles & Kadas",
  "Necklace Sets",
] as const;

export type JewelleryCollection =
  (typeof JEWELLERY_COLLECTIONS)[number];

// Reviewed legacy product IDs. No database changes are required.
const LEGACY_COLLECTION_IDS: Record<JewelleryCollection, number[]> = {
  "Bridal Sets": [
    25, 34, 36, 59, 60, 62, 66, 70,
    73, 74, 88, 91, 93, 96, 98, 99,
  ],
  "Long Harams": [
    12, 37, 41, 50, 61, 65, 67, 68, 69,
    71, 87, 89, 92, 97,
  ],
  "Handmade Bangles": [
    51, 52, 53, 54, 55, 57, 58, 63,
    75, 76, 77, 78, 80, 81, 82, 83, 85,
  ],
  "Bangles & Kadas": [
    23, 42, 45, 79, 84, 86, 90,
  ],
  "Necklace Sets": [
    11, 22, 24, 31, 33, 39, 43,
    44, 46, 49, 64, 94, 95,
  ],
};

export function getJewelleryCollection(
  product: Product
): JewelleryCollection | null {
  const category = product.category.trim();

  // New products use their selected standardized category.
  if (
    JEWELLERY_COLLECTIONS.some(
      (collection) => collection === category
    )
  ) {
    return category as JewelleryCollection;
  }

  // Legacy products retain their existing database categories.
  for (const collection of JEWELLERY_COLLECTIONS) {
    if (LEGACY_COLLECTION_IDS[collection].includes(product.id)) {
      return collection;
    }
  }

  // Other products remain accessible in the main shop.
  return null;
}
