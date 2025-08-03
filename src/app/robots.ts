import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Allow major search engines
      {
        userAgent: ['Googlebot', 'Bingbot', 'Slurp', 'DuckDuckBot', 'Baiduspider', 'YandexBot'],
        allow: '/',
        disallow: ['/api/', '/test-*', '/_next/', '/admin/'],
      },
      // Allow social media crawlers
      {
        userAgent: ['facebookexternalhit', 'Twitterbot', 'LinkedInBot'],
        allow: '/',
        disallow: ['/api/', '/test-*', '/_next/', '/admin/'],
      },
      // Block AI training crawlers and scrapers
      {
        userAgent: [
          'GPTBot',
          'ChatGPT-User', 
          'CCBot',
          'anthropic-ai',
          'Claude-Web',
          'PerplexityBot',
          'YouBot',
          'Meta-ExternalAgent',
          'Meta-ExternalFetcher',
          'OAI-SearchBot',
          'ChatGPT',
          'Google-Extended',
          'Applebot-Extended',
          'FacebookBot'
        ],
        disallow: '/',
      },
      // Block common scrapers and aggressive crawlers
      {
        userAgent: [
          'SemrushBot',
          'AhrefsBot',
          'MJ12bot',
          'DotBot',
          'BLEXBot',
          'DataForSeoBot',
          'PetalBot',
          'MegaIndex',
          'SeznamBot',
          'Mail.RU_Bot',
          'ia_archiver',
          'Wayback',
          'archive.org_bot'
        ],
        disallow: '/',
      },
      // Default rule for unidentified bots
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/test-*', '/_next/', '/admin/'],
        crawlDelay: 10,
      },
    ],
    sitemap: 'https://nathan.binarybridges.ca/sitemap.xml',
  }
}
