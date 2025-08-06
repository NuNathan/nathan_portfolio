import { MetadataRoute } from 'next'
import axios from 'axios'

// Configuration
const STRAPI_URL = process.env.STRAPI_API_URL;
const STRAPI_TOKEN = process.env.STRAPI_TOKEN;
const BASE_URL = 'https://nathan.binarybridges.ca';
const MAX_POSTS_FOR_SITEMAP = 100;

// Type for blog post data
interface BlogPost {
  slug?: string;
  updatedAt?: string;
  publishedAt?: string;
}

// Function to fetch all blog posts for sitemap
async function getAllBlogPosts(): Promise<BlogPost[]> {
  if (!STRAPI_URL || !STRAPI_TOKEN) {
    console.warn('Sitemap: Missing Strapi configuration, skipping blog posts');
    return [];
  }

  try {
    const queryParams = new URLSearchParams({
      'populate': '*',
      'pagination[pageSize]': MAX_POSTS_FOR_SITEMAP.toString(),
      'sort[0]': 'updatedAt:desc'
    });

    const response = await axios.get(`${STRAPI_URL}/posts?${queryParams.toString()}`, {
      headers: {
        Authorization: `Bearer ${STRAPI_TOKEN}`,
      },
      timeout: 10000,
    });

    const posts = response.data?.data || [];
    console.log(`Sitemap: Successfully fetched ${posts.length} blog posts`);
    return posts;
  } catch (error) {
    console.error('Error fetching blog posts for sitemap:', error);
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const currentDate = new Date().toISOString();

  // Static pages configuration
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${BASE_URL}/main/about-me`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/main/projects`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/main/experience`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/main/blog`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ];

  // Dynamic blog posts
  const blogPosts = await getAllBlogPosts();
  const blogPostPages: MetadataRoute.Sitemap = blogPosts
    .filter((post): post is BlogPost & { slug: string } =>
      Boolean(post.slug && typeof post.slug === 'string')
    )
    .map((post) => ({
      url: `${BASE_URL}/main/blog/${post.slug}`,
      lastModified: post.updatedAt || post.publishedAt || currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }));

  console.log(`Sitemap: Generated ${staticPages.length} static pages and ${blogPostPages.length} blog post pages`);

  return [...staticPages, ...blogPostPages];
}
