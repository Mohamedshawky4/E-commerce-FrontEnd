import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // <-- allows *any* HTTPS image
      },
    ],
  },
  /* config options here */
};

export default nextConfig;
