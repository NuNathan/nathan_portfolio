import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'positive-life-875d223e2a.media.strapiapp.com',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '1339',
      },
      {
        protocol: 'https',
        hostname: 'nathan.binarybridges.ca',
      },
    ],
  },
};

export default nextConfig;
