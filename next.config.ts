import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Note: Turbopack + Prisma has issues on Windows. Works fine on Vercel (Linux)
  // Local dev works fine with: npm run dev
};

export default nextConfig;
