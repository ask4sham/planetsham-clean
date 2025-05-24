/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: true,
    cron: [
      {
        path: '/api/cron/publish',
        schedule: '0 * * * *', // every hour
      },
    ],
  },
};

export default nextConfig;
