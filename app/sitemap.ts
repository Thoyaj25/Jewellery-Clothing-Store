import type { MetadataRoute } from "next";
import { getProducts } from "@/src/lib/getProducts";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://ultimate-collections-store.vercel.app";

  const staticRoutes = [
    "",
    "/products",
    "/jewellery",
    "/contact",
    "/reviews",
    "/privacy-policy",
    "/returns-refunds",
    "/shipping-policy",
    "/terms-conditions",
  ];

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
  }));

  const products = await getProducts();

  const productEntries: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${baseUrl}/product/${product.id}`,
    lastModified: new Date(),
  }));

  return [...staticEntries, ...productEntries];
}
