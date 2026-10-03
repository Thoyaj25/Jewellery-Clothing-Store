import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
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
