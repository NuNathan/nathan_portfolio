import { NextRequest, NextResponse } from 'next/server';
import { PostsResponse } from '@/api/posts';
import { getStrapiPosts } from '@/api/strapi';
import { isTimeoutError, isNetworkError } from '@/utils/api-client';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  // Get query parameters
  const page = parseInt(searchParams.get('page') || '1');
  const pageSize = parseInt(searchParams.get('pageSize') || '6');
  const search = searchParams.get('search') || '';
  const type = searchParams.get('type') || 'all';
  const sortBy = searchParams.get('sortBy') || 'latest';

  try {
    // Use centralized Strapi API
    const response = await getStrapiPosts({
      page,
      pageSize,
      search: search.trim(),
      type: type !== 'all' ? type as 'project' | 'blog' : undefined,
      sortBy: sortBy as 'latest' | 'oldest' | 'most-viewed' | 'least-viewed'
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching posts:', error);

    // Log specific error types for better debugging
    if (isTimeoutError(error)) {
      console.error('API request timed out - this may indicate slow Strapi response or network issues');
    } else if (isNetworkError(error)) {
      console.error('Network error - check Strapi server availability and network connectivity');
    }

    // Return empty data if API fails
    const emptyData: PostsResponse = {
      data: [],
      meta: {
        pagination: {
          page: page,
          pageSize: pageSize,
          pageCount: 0,
          total: 0
        }
      }
    };

    return NextResponse.json(emptyData);
  }
}
