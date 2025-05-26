import path from "path";
import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: {},
  },
  webpack: (config) => {
    config.resolve = {
      ...config.resolve,
      alias: {
        ...(config.resolve?.alias || {}),
        "@": path.resolve(__dirname, "src"),
      },
    };
    return config;
  },
};

export default nextConfig;
