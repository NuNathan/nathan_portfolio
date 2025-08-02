import { NextResponse } from 'next/server';

const STRAPI_URL = process.env.STRAPI_API_URL;
const STRAPI_TOKEN = process.env.STRAPI_TOKEN;

export async function GET() {
  try {
    // Check if environment variables are set
    if (!STRAPI_URL || !STRAPI_TOKEN) {
      return NextResponse.json(
        { 
          status: 'error', 
          message: 'Configuration error: Missing environment variables' 
        }, 
        { status: 500 }
      );
    }

    // Try to reach Strapi with a simple request
    const response = await fetch(`${STRAPI_URL}/posts?pagination[pageSize]=1`, {
      headers: {
        'Authorization': `Bearer ${STRAPI_TOKEN}`,
      },
      // Short timeout for health check
      signal: AbortSignal.timeout(5000),
    });

    if (response.ok) {
      return NextResponse.json({
        status: 'healthy',
        message: 'All services are operational',
        timestamp: new Date().toISOString()
      });
    } else {
      return NextResponse.json(
        {
          status: 'degraded',
          message: `Strapi responded with status ${response.status}`,
          timestamp: new Date().toISOString()
        },
        { status: 503 }
      );
    }
  } catch (error) {
    console.error('Health check failed:', error);
    
    // Determine error type
    let errorMessage = 'Unknown error';
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        errorMessage = 'Request timeout - Strapi is not responding';
      } else if (error.message.includes('fetch')) {
        errorMessage = 'Cannot connect to Strapi - service may be down';
      } else {
        errorMessage = error.message;
      }
    }

    return NextResponse.json(
      {
        status: 'unhealthy',
        message: errorMessage,
        timestamp: new Date().toISOString()
      },
      { status: 503 }
    );
  }
}
