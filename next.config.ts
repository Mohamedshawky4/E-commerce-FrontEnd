import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // <-- allows *any* HTTPS image
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },
  /* config options here */
};

export default nextConfig;
