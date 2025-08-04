import { NextRequest, NextResponse } from 'next/server';
import { getStrapiPostBySlug } from '@/api/strapi';
import { isTimeoutError, isNetworkError } from '@/utils/api-client';

// Function to get author headshot from about-me data
async function getAuthorHeadshot(): Promise<string | null> {
  try {
    const { getAboutMe } = await import('@/api/aboutMe');
    const response = await getAboutMe();
    const headshot = response.data?.headshot;
    return headshot?.url || null;
  } catch (error) {
    console.error('Error fetching author headshot:', error);
    return null;
  }
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  try {
    // Get post data using centralized API
    const post = await getStrapiPostBySlug(slug);

    if (post) {
      // Handle author avatar - if no avatar, try to get the headshot from about-me data
      if (post.author && (!post.author.avatar || post.author.avatar === '')) {
        const headshot = await getAuthorHeadshot();
        post.author.avatar = headshot || '';
      }

      return NextResponse.json(post);
    }

    // If no data found in Strapi, fall through to fallback data
  } catch (error) {
    console.error('Error fetching post by slug:', error);

    // Log specific error types for better debugging
    if (isTimeoutError(error)) {
      console.error('API request timed out - this may indicate slow Strapi response or network issues');
    } else if (isNetworkError(error)) {
      console.error('Network error - check Strapi server availability and network connectivity');
    }

    // Fall through to fallback data
  }

  // Return 404 if no post found
  return NextResponse.json({ error: 'Post not found' }, { status: 404 });
}
