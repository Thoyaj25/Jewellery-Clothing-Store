import type { Product } from "@/src/domain/product";
import { getJewelleryCollection } from "@/src/lib/jewelleryCollections";
import { PRODUCT_CATEGORIES } from "@/src/lib/productCategories";

export type StorefrontCategory =
  (typeof PRODUCT_CATEGORIES)[number];

const NON_JEWELLERY_LEGACY_IDS = new Set([
  1, 7, 8, 9, 28, 29, 30, 38,
]);

export function getStorefrontCategory(
  product: Product
): StorefrontCategory {
  // Preserve the approved legacy jewellery ID mapping.
  const jewellery = getJewelleryCollection(product);

  if (jewellery) {
    return jewellery;
  }

  const category = product.category.trim();
  const label = `${product.name} ${category}`.toLowerCase();

  if (/saree|sari/.test(label)) {
    return "Sarees";
  }


  // Explicitly standardized categories, including new uploads.
  if (
    PRODUCT_CATEGORIES.some((item) => item === category)
  ) {
    return category as StorefrontCategory;
  }

  // Existing products reviewed as miscellaneous jewellery.
  if (!NON_JEWELLERY_LEGACY_IDS.has(product.id)) {
    return "Other Jewellery";
  }

  // Legacy fashion and accessory products.
  if (product.id === 38) {
    return "Home & Puja Accessories";
  }

  if (/handbag|clutch|purse|bag/.test(label)) {
    return "Handbags";
  }

  if (/kurti|kurta|salwar|dupatta/.test(label)) {
    return "Kurtis";
  }

  if (/kids|kid\\b|child|baby|boy|girl/.test(label)) {
    return "Kids Wear";
  }

  return "Other Clothing";
}
