import BlogDetailClient from './BlogDetailClient';
import { PostData } from '@/api/posts';
import { notFound } from 'next/navigation';
import axios from 'axios';
import { Metadata } from 'next';
import StructuredData from '@/components/seo/StructuredData';
import { Suspense } from 'react';

const STRAPI_MEDIA_URL = process.env.STRAPI_MEDIA_URL;
const STRAPI_URL = process.env.STRAPI_API_URL;
const STRAPI_TOKEN = process.env.STRAPI_TOKEN;

// Function to fetch post data for metadata
async function getPostData(slug: string): Promise<PostData | null> {
  try {
    const queryParams = new URLSearchParams();
    queryParams.append('populate', '*');
    queryParams.append('filters[slug][$eq]', slug);

    const response = await axios.get(`${STRAPI_URL}/posts?${queryParams.toString()}`, {
      headers: {
        Authorization: `Bearer ${STRAPI_TOKEN}`,
      },
      timeout: 20000,
    });

    const data = response.data;
    if (data.data && data.data.length > 0) {
      const post = data.data[0];

      // Handle img object with url property
      if (post.img && typeof post.img === 'object' && post.img.url) {
        const imgUrl = post.img.url;
        post.img = imgUrl.startsWith('http') ? imgUrl : `${STRAPI_MEDIA_URL}${imgUrl}`;
      } else if (post.img && typeof post.img === 'string' && !post.img.startsWith('http')) {
        post.img = `${STRAPI_MEDIA_URL}${post.img}`;
      }

      return post;
    }
    return null;
  } catch (error) {
    console.error('Error fetching post data for metadata:', error);
    return null;
  }
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

  // Generate keywords from tags
  const keywords = [
    'Nathan Campbell',
    post.title,
    ...(post.tags?.map((tag: any) => tag.text || tag.skill) || []),
    'Technical Article',
    'Blog Post',
    'Software Engineering',
    'Web Development'
  ];

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
          url: post.img || '/blog-og-image.jpg',
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
      images: [post.img || '/blog-og-image.jpg'],
      creator: '@NRCsme',
    },
    alternates: {
      canonical: postUrl,
    },
  };
}

// Generate static params for all blog posts (for better SEO and performance)
export async function generateStaticParams() {
  try {
    const queryParams = new URLSearchParams();
    // Use the same pattern as your working API calls
    queryParams.append('populate', '*');
    queryParams.append('pagination[pageSize]', '100'); // Get all posts
    queryParams.append('sort[0]', 'updatedAt:desc');

    const response = await axios.get(`${STRAPI_URL}/posts?${queryParams.toString()}`, {
      headers: {
        Authorization: `Bearer ${STRAPI_TOKEN}`,
      },
      timeout: 10000,
    });

    const posts = response.data?.data || [];
    console.log(`Found ${posts.length} posts for static generation`);

    return posts
      .filter((post: any) => post.slug && typeof post.slug === 'string')
      .map((post: any) => {
        console.log(`Generating static page for slug: ${post.slug}`);
        return {
          slug: post.slug,
        };
      });
  } catch (error) {
    console.error('Error generating static params for blog posts:', error);
    console.error('API URL:', `${STRAPI_URL}/posts`);
    if (error && typeof error === 'object' && 'response' in error) {
      console.error('Error details:', (error as any).response?.data);
    } else if (error instanceof Error) {
      console.error('Error message:', error.message);
    }
    // Return empty array to allow build to continue
    return [];
  }
}

// Function to get author headshot from about-me data
async function getAuthorHeadshot(): Promise<string | null> {
  try {
    const response = await axios.get(`${STRAPI_URL}/about-me?populate=headshot`, {
      headers: {
        Authorization: `Bearer ${STRAPI_TOKEN}`,
      },
    });

    const headshot = response.data?.data?.headshot;
    if (headshot && headshot.url) {
      return headshot.url.startsWith('http') ? headshot.url : `${STRAPI_MEDIA_URL}${headshot.url}`;
    }
    return null;
  } catch (error) {
    console.error('Error fetching author headshot:', error);
    return null;
  }
}

export default async function BlogDetailPage(props: unknown) {
  const { slug } = await (props as { params: Promise<{ slug: string }> }).params;

  try {
    // Call Strapi directly from server-side instead of going through Next.js API route
    const queryParams = new URLSearchParams();
    queryParams.append('populate', '*'); // This will include content field and all other fields
    queryParams.append('filters[slug][$eq]', slug);

    const response = await axios.get(`${STRAPI_URL}/posts?${queryParams.toString()}`, {
      headers: {
        Authorization: `Bearer ${STRAPI_TOKEN}`,
      },
      timeout: 20000, // 20 second timeout
    });

    const data = response.data;
    if (data.data && data.data.length > 0) {
      const post = data.data[0];

      // Handle img object with url property
      if (post.img && typeof post.img === 'object' && post.img.url) {
        const imgUrl = post.img.url;
        post.img = imgUrl.startsWith('http') ? imgUrl : `${STRAPI_MEDIA_URL}${imgUrl}`;
      } else if (post.img && typeof post.img === 'string' && !post.img.startsWith('http')) {
        post.img = `${STRAPI_MEDIA_URL}${post.img}`;
      }

      // Handle author avatar
      if (post.author) {
        if (post.author.avatar && typeof post.author.avatar === 'object' && post.author.avatar.url) {
          const avatarUrl = post.author.avatar.url;
          post.author.avatar = avatarUrl.startsWith('http')
            ? avatarUrl
            : `${STRAPI_MEDIA_URL}${avatarUrl}`;
        } else {
          // If no avatar, try to get the headshot from about-me data
          const headshot = await getAuthorHeadshot();
          post.author.avatar = headshot || '';
        }
      }

      // Transform skillTags to tags with correct structure
      if (post.skillTags && Array.isArray(post.skillTags)) {
        post.tags = post.skillTags.map((skillTag: any) => ({
          id: skillTag.id,
          text: skillTag.skill,
          color: skillTag.mainColour
        }));
        delete post.skillTags; // Remove original field
      } else {
        post.tags = []; // Ensure tags is always an array
      }

      // Transform demo/github/live fields to links object
      post.links = {
        demo: post.demo || undefined,
        github: post.github || undefined,
        live: post.live || undefined
      };

      // Clean up original fields
      delete post.demo;
      delete post.github;
      delete post.live;

      // Ensure date field is properly formatted
      if (post.completionDate) {
        const date = new Date(post.completionDate);
        post.date = date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        });
      }

      // Ensure views field is properly handled
      post.views = post.views || 0;

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
          <Suspense fallback={<div className="min-h-screen bg-[#f8f7fc] flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading post...</p>
            </div>
          </div>}>
            <BlogDetailClient slug={slug} postData={postData} />
          </Suspense>
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
