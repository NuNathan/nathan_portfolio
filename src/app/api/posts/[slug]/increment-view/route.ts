import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    
    // Get the Strapi URL from environment variables
    const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1339';
    const apiUrl = `${strapiUrl}/api/posts/${slug}/increment-view`;

    console.log('Proxying increment-view request to:', apiUrl);

    // Forward the request to Strapi
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.warn(`Failed to increment view for post ${slug}:`, response.status);

      // Log the response body for debugging
      const errorText = await response.text();
      console.error('Strapi error response:', errorText);

      return NextResponse.json(
        { error: 'Failed to increment view count', details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('Successfully incremented view for:', slug);
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error incrementing view count:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
