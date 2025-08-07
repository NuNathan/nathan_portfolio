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
  // Security and SEO headers
  async headers() {
    return [
      // Stale-while-revalidate for blog and project pages
      {
        source: '/main/blog/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=60, stale-while-revalidate=3600'
          },
          {
            key: 'CDN-Cache-Control',
            value: 'public, max-age=60, stale-while-revalidate=3600'
          },
          {
            key: 'Vercel-CDN-Cache-Control',
            value: 'public, max-age=60, stale-while-revalidate=3600'
          }
        ]
      },
      {
        source: '/main/projects',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=60, stale-while-revalidate=3600'
          },
          {
            key: 'CDN-Cache-Control',
            value: 'public, max-age=60, stale-while-revalidate=3600'
          },
          {
            key: 'Vercel-CDN-Cache-Control',
            value: 'public, max-age=60, stale-while-revalidate=3600'
          }
        ]
      },
      // Cache other pages for 48 hours (excluding blog and projects)
      {
        source: '/((?!main/blog|main/projects).*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=172800, s-maxage=172800'
          },
          {
            key: 'CDN-Cache-Control',
            value: 'public, max-age=172800'
          },
          {
            key: 'Vercel-CDN-Cache-Control',
            value: 'public, max-age=172800'
          }
        ]
      },
      // Global security headers
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()'
          }
        ],
      },
      {
        source: '/robots.txt',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, s-maxage=3600'
          }
        ]
      },
      {
        source: '/sitemap.xml',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, s-maxage=3600'
          }
        ]
      }
    ]
  },
  // Redirects for SEO
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
      {
        source: '/portfolio',
        destination: '/main/projects',
        permanent: true,
      },
      {
        source: '/contact',
        destination: '/main/about-me',
        permanent: true,
      }
    ]
  }
};

export default nextConfig;
