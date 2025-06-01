import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: {},
  },
  images: {
    domains: ["source.unsplash.com"], // ✅ Enables Unsplash images
  },
};

export default nextConfig;
