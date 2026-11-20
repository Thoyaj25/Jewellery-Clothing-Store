import type { MetadataRoute } from "next";
import { getProducts } from "@/src/lib/getProducts";
import { JEWELLERY_COLLECTIONS } from "@/src/lib/jewelleryCollections";

export const dynamic = "force-dynamic";

const BASE_URL = "https://ultimate-collections-store.vercel.app";

const PUBLIC_PAGES = [
  "",
  "/jewellery",
  "/products",
  "/contact",
  "/reviews",
  "/privacy-policy",
  "/returns-refunds",
  "/shipping-policy",
  "/terms-conditions",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getProducts();

  const staticPages: MetadataRoute.Sitemap = PUBLIC_PAGES.map((path) => ({
    url: `${BASE_URL}${path}`,
    changeFrequency: path === "" ? "daily" : "monthly",
    priority: path === "" ? 1 : path === "/jewellery" || path === "/products" ? 0.9 : 0.5,
  }));

  const collectionPages: MetadataRoute.Sitemap = [
    ...JEWELLERY_COLLECTIONS.filter((name) => name !== "Bridal Sets"),
    "Other Jewellery",
  ].map((collection) => ({
    url: `${BASE_URL}/jewellery?collection=${encodeURIComponent(collection)}`,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const productPages: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${BASE_URL}/product/${product.id}`,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...staticPages, ...collectionPages, ...productPages];
}
