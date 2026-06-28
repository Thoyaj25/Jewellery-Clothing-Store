import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  images: {
    // public/ images are supported by default. Keep optimization enabled for production.
    // Set `unoptimized: true` if you plan to use a static export or external image host.
    unoptimized: false,
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