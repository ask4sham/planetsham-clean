/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: {},
  },
  webpack: (config) => {
    return config;
  },
};

export default nextConfig;
