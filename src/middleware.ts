import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// List of blocked user agents (AI crawlers and scrapers)
const blockedUserAgents = [
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
  'FacebookBot',
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
]

// Allowed search engine bots
const allowedBots = [
  'Googlebot',
  'Bingbot',
  'Slurp',
  'DuckDuckBot',
  'Baiduspider',
  'YandexBot',
  'facebookexternalhit',
  'Twitterbot',
  'LinkedInBot'
]

export function middleware(request: NextRequest) {
  const userAgent = request.headers.get('user-agent') || ''

  // Skip bot detection for API routes - they should be handled separately
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const response = NextResponse.next()
    return response
  }

  // Check if the user agent contains any blocked patterns
  const isBlockedBot = blockedUserAgents.some(bot =>
    userAgent.toLowerCase().includes(bot.toLowerCase())
  )

  // Check if it's an allowed search engine bot
  const isAllowedBot = allowedBots.some(bot =>
    userAgent.toLowerCase().includes(bot.toLowerCase())
  )

  // Block AI crawlers and scrapers but allow search engines
  if (isBlockedBot && !isAllowedBot) {
    console.log('Blocked bot detected:', userAgent)
    return new NextResponse('Access Denied - Bot Protection Active', {
      status: 403,
      headers: {
        'Content-Type': 'text/plain',
      }
    })
  }
  
  // Create response with security headers
  const response = NextResponse.next()
  
  // Security headers
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
  
  // Content Security Policy
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://app.rybbit.io https://va.vercel-scripts.com; " +
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
    "font-src 'self' https://fonts.gstatic.com; " +
    "img-src 'self' data: https: blob:; " +
    "connect-src 'self' https://app.rybbit.io https://vitals.vercel-insights.com; " +
    "frame-ancestors 'none';"
  )
  
  // Add cache control for static assets
  if (request.nextUrl.pathname.startsWith('/_next/static/')) {
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable')
  }
  
  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api/|_next/static|_next/image|favicon.ico).*)',
  ],
}
