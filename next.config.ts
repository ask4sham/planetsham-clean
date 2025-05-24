/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: true, // optional but fine to include
    cron: [
      {
        path: '/api/cron/publish',
        schedule: '0 * * * *', // every hour
      },
    ],
  },
};

export default nextConfig;
