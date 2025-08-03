import { MetadataRoute } from 'next'
import axios from 'axios'

const STRAPI_URL = process.env.STRAPI_API_URL;
const STRAPI_TOKEN = process.env.STRAPI_TOKEN;

// Function to fetch all blog posts for sitemap
async function getAllBlogPosts() {
  try {
    const queryParams = new URLSearchParams();
    // Use the same pattern as working API calls
    queryParams.append('populate', '*');
    queryParams.append('pagination[pageSize]', '100'); // Get all posts
    queryParams.append('sort[0]', 'updatedAt:desc');

    const response = await axios.get(`${STRAPI_URL}/posts?${queryParams.toString()}`, {
      headers: {
        Authorization: `Bearer ${STRAPI_TOKEN}`,
      },
      timeout: 10000,
    });

    return response.data?.data || [];
  } catch (error) {
    console.error('Error fetching blog posts for sitemap:', error);
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://nathan.binarybridges.ca'
  const currentDate = new Date().toISOString()

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/main/about-me`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/main/projects`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/main/experience`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/main/blog`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ];

  // Dynamic blog posts
  const blogPosts = await getAllBlogPosts();
  const blogPostPages: MetadataRoute.Sitemap = blogPosts
    .filter((post: any) => post.slug && typeof post.slug === 'string') // Only include posts with valid slugs
    .map((post: any) => ({
      url: `${baseUrl}/main/blog/${post.slug}`,
      lastModified: post.updatedAt || post.publishedAt || currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }));

  // Always return at least the static pages, even if blog posts fail
  return [...staticPages, ...blogPostPages];
}
