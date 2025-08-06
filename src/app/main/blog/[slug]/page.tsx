import BlogDetailServer from './BlogDetailServer';
import BlogDetailClient from './BlogDetailClient';
import { PostData } from '@/api/posts';
import { getOGImageUrl, getStrapiPostBySlug } from '@/api/strapi';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import StructuredData from '@/components/seo/StructuredData';

// Version 2.1 - Fixed hydration issues

// Disable all caching for this page
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Helper functions
async function getPostData(slug: string): Promise<PostData | null> {
  try {
    return await getStrapiPostBySlug(slug);
  } catch (error) {
    console.error('Error fetching post data for metadata:', error);
    return null;
  }
}

function generateKeywords(post: PostData): string[] {
  if (post.seoKeywords) {
    return [
      'Nathan Campbell',
      ...post.seoKeywords.split(',').map(k => k.trim()).filter(k => k.length > 0),
      'Technical Article',
      'Blog Post'
    ];
  }

  return [
    'Nathan Campbell',
    post.title,
    ...(post.tags?.map((tag: any) => tag.text || tag.skill) || []),
    'Technical Article',
    'Blog Post',
    'Software Engineering',
    'Web Development'
  ];
}

// Generate metadata for individual blog posts
export async function generateMetadata(props: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await props.params;
  const post = await getPostData(slug);

  if (!post) {
    return {
      title: 'Post Not Found | Nathan Campbell',
      description: 'The requested blog post could not be found.',
    };
  }

  // Extract text content from rich text for description
  const cleanDescription = post.description || 'Read this technical article by Nathan Campbell';
  const postDate = post.completionDate ? new Date(post.completionDate).toISOString() : new Date().toISOString();
  const postUrl = `https://nathan.binarybridges.ca/main/blog/${slug}`;

  const keywords = generateKeywords(post);

  return {
    title: `${post.title} | Nathan Campbell`,
    description: cleanDescription,
    keywords,
    authors: [{ name: 'Nathan Campbell' }],
    creator: 'Nathan Campbell',
    publisher: 'Nathan Campbell',
    openGraph: {
      title: post.title,
      description: cleanDescription,
      url: postUrl,
      type: 'article',
      publishedTime: postDate,
      modifiedTime: post.updatedAt || postDate,
      authors: ['Nathan Campbell'],
      section: 'Technology',
      tags: post.tags?.map((tag: any) => tag.text || tag.skill) || [],
      images: [
        {
          url: post.img || getOGImageUrl('og-image'),
          width: 1200,
          height: 630,
          alt: post.title,
        }
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: cleanDescription,
      images: [post.img || getOGImageUrl('og-image')],
      creator: '@NRCsme',
    },
    alternates: {
      canonical: postUrl,
    },
  };
}

// Disable static generation since we want no caching
export async function generateStaticParams() {
  // Return empty array to force dynamic rendering for all blog posts
  return [];
}

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

export default async function BlogDetailPage(props: unknown) {
  const { slug } = await (props as { params: Promise<{ slug: string }> }).params;

  try {
    // Get post data using centralized API
    const post = await getStrapiPostBySlug(slug);

    if (post) {
      // Handle author avatar - if no avatar, try to get the headshot from about-me data
      if (post.author && (!post.author.avatar || post.author.avatar === '')) {
        const headshot = await getAuthorHeadshot();
        post.author.avatar = headshot || '';
      }

      const postData: PostData = post;

      // Prepare structured data for the article
      const structuredData = {
        type: 'article' as const,
        data: {
          title: post.title,
          description: post.description,
          publishedDate: post.completionDate || post.publishedAt,
          modifiedDate: post.updatedAt,
          image: post.img,
          url: `https://nathan.binarybridges.ca/main/blog/${slug}`,
          tags: post.tags?.map((tag: any) => tag.text || tag.skill),
          wordCount: post.content ? post.content.split(' ').length : 500
        }
      };

      return (
        <>
          <StructuredData type={structuredData.type} data={structuredData.data} />
          <BlogDetailClient slug={slug} />
          <BlogDetailServer slug={slug} postData={postData} />
        </>
      );
    }

    // If no data found, return 404
    notFound();
  } catch (error) {
    console.error('Error fetching post:', error);
    // Return 404 for missing posts instead of fallback data
    notFound();
  }
}
