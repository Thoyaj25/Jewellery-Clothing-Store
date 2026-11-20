import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/cart",
        "/checkout",
        "/api/",
      ],
    },
    sitemap: "https://ultimate-collections-store.vercel.app/sitemap.xml",
    host: "https://ultimate-collections-store.vercel.app",
  };
}
