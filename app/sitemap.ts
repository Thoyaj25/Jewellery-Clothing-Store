import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl =
  "https://jewellery-clothing-store.vercel.app";

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/cart`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/checkout`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/jewellery`,
      lastModified: new Date(),
    },
  ];
}