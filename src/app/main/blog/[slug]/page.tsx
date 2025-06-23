import BlogDetailClient from './BlogDetailClient';

interface BlogDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { slug } = await params;

  // Since we need window for baseUrl determination, we'll let the client component handle all data fetching
  return <BlogDetailClient slug={slug} />;
}

