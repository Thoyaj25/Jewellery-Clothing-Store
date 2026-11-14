import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    deviceSizes: [640, 672, 750, 828, 1080, 1200, 1920, 2048, 3840],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "x9uetgt5sjp0nmjw.public.blob.vercel-storage.com",
      },
    ],
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
