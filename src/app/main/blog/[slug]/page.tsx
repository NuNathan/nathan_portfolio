import BlogDetailClient from './BlogDetailClient';
import { PostData } from '@/api/posts';
import { notFound } from 'next/navigation';

export default async function BlogDetailPage(props: unknown) {

  const { slug } = await (props as { params: Promise<{ slug: string }> }).params;

  // Use relative URL for server-side fetches to avoid port issues
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || (
    typeof window === 'undefined'
      ? 'http://localhost:3001'  // Server-side
      : window.location.origin    // Client-side
  );

  try {
    const response = await fetch(`${baseUrl}/api/posts/${slug}`, {
      cache: 'no-store',
      signal: AbortSignal.timeout(20000), // 20 second timeout for server-side fetch
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('Response is not JSON');
    }

    const postData: PostData = await response.json();

    return <BlogDetailClient slug={slug} postData={postData} />;
  } catch (error) {
    console.error('Error fetching post:', error);

    // Return 404 for missing posts instead of fallback data
    notFound();
  }
}
