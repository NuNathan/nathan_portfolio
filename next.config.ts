import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['positive-life-875d223e2a.media.strapiapp.com', 'localhost', 'nathan.binarybridges.ca', 'via.placeholder.com'],
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
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
    ],
  },
};

export default nextConfig;
