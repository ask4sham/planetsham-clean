import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: {},
  },
  images: {
    domains: ["source.unsplash.com"], // ✅ Enables Unsplash images
  },
  turbopack: {}, // ✅ Updated from deprecated 'experimental.turbo'
  webpack: (config) => {
    config.resolve.fallback = {
      fs: false, // ✅ Disable 'fs' in client bundle
      path: require.resolve("path-browserify"), // ✅ Provide browser-safe path
    };
    return config;
  },
};

export default nextConfig;
