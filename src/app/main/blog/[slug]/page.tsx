import BlogDetailClient from './BlogDetailClient';
import { PostData } from '@/api/posts';

interface BlogDetailPageProps {
  params: { slug: string };
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  const response = await fetch(`${baseUrl}/api/posts/${params.slug}`, {
    cache: 'no-store', // Or 'force-cache' if you're okay with caching
  });

  if (!response.ok) {
    throw new Error('Post not found');
  }

  const postData: PostData = await response.json();

  return <BlogDetailClient slug={ params.slug } postData={postData} />;
}