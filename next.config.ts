import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // public/ images are supported by default. Keep optimization enabled for production.
    // Set `unoptimized: true` if you plan to use a static export or external image host.
    unoptimized: false,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "x9uetgt5sjp0nmjw.public.blob.vercel-storage.com",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/shop",
        destination: "/",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;