import BlogDetailClient from './BlogDetailClient';
import { PostData } from '@/api/posts';

export default async function BlogDetailPage(props: unknown) {
  // @ts-ignore - treating unknown as any to extract params
  const { slug } = await props.params;

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  const response = await fetch(`${baseUrl}/api/posts/${slug}`, {
    cache: 'no-store',
  });

  const postData: PostData = await response.json();

  return <BlogDetailClient slug={slug} postData={postData} />;
}
