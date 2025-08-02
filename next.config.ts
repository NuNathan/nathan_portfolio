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
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
  },
  // Performance optimizations
  experimental: {
    optimizePackageImports: ['@radix-ui/react-icons', 'react-icons'],
  },
  // Enable compression
  compress: true,
  // Optimize builds
  swcMinify: true,
};

export default nextConfig;
