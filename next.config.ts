// /next.config.js or /next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  turbopack: {}, // ✅ Updated from deprecated 'experimental.turbo'
  webpack: (config) => {
    config.resolve.fallback = {
      fs: false, // ✅ Disable 'fs' module in client bundle
      path: require.resolve('path-browserify') // ✅ Provide browser-safe 'path'
    };
    return config;
  }
};

export default nextConfig;
