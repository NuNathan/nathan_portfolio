import { strapiGet } from '@/utils/api-client';
import { PostData, PostTag } from './posts';
import { formatDateConsistently } from '@/utils/dateUtils';

const STRAPI_MEDIA_URL = process.env.STRAPI_MEDIA_URL;

// Transform image URLs to use STRAPI_MEDIA_URL
export function transformImageUrl(url: string | undefined): string {
  if (!url) return '';
  return url.startsWith('http') ? url : `${STRAPI_MEDIA_URL}${url}`;
}

// Get OG image from Strapi
export function getOGImageUrl(imageName: string): string {
  const imageMap: Record<string, string> = {
    'og-image': 'https://positive-life-875d223e2a.media.strapiapp.com/og_image_997a648fa9.jpg',
    'projects-og-image': 'https://positive-life-875d223e2a.media.strapiapp.com/projects_og_image_e5d2da9ee7.jpg',
    'about-og-image': 'https://positive-life-875d223e2a.media.strapiapp.com/about_og_image_ff561a3243.jpg',
    'experience-og-image': 'https://positive-life-875d223e2a.media.strapiapp.com/experience_og_image_37a1b7d41d.jpg',
    'blog-og-image': 'https://positive-life-875d223e2a.media.strapiapp.com/blog_og_image_b1137d1c40.jpg',
  };

  return imageMap[imageName] || imageMap['og-image'];
}

// Transform post data from Strapi response
export function transformPostData(post: any): PostData {
  // Handle img object with url property or direct string
  let imgUrl = '';
  if (post.img && typeof post.img === 'object' && post.img.url) {
    imgUrl = transformImageUrl(post.img.url);
  } else if (post.img && typeof post.img === 'string') {
    imgUrl = transformImageUrl(post.img);
  }

  // Transform skillTags to tags format
  const tags: PostTag[] = post.skillTags?.map((tag: any) => ({
    id: tag.id,
    text: tag.skill,
    color: tag.mainColour
  })) || [];

  return {
    author: post.author,
    id: post.id,
    documentId: post.documentId,
    title: post.title,
    description: post.description,
    img: imgUrl,
    tags,
    type: post.type,
    date: formatDateConsistently(post.completionDate) || 'Recent',
    views: post.views || 0,
    readTime: post.readTime,
    links: {
      demo: post.demo || undefined,
      github: post.github || undefined,
      live: post.live || undefined
    },
    slug: post.slug,
    completionDate: post.completionDate,
    publishedAt: post.publishedAt,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
    content: post.content,
    seoKeywords: post.seoKeywords || undefined
  };
}

// Get posts with filtering, pagination, and sorting
export async function getStrapiPosts(params: {
  page?: number;
  pageSize?: number;
  search?: string;
  type?: 'project' | 'blog';
  sortBy?: 'latest' | 'oldest' | 'most-viewed' | 'least-viewed';
  populate?: string;
} = {}) {
  const {
    page = 1,
    pageSize = 6,
    search = '',
    type,
    sortBy = 'latest',
    populate = '*'
  } = params;

  // Build query parameters
  const queryParams = new URLSearchParams();
  queryParams.append('populate', populate);
  queryParams.append('pagination[page]', page.toString());
  queryParams.append('pagination[pageSize]', pageSize.toString());

  // Add search filter
  if (search.trim()) {
    queryParams.append('filters[$or][0][title][$containsi]', search.trim());
    queryParams.append('filters[$or][1][description][$containsi]', search.trim());
  }

  // Add type filter
  if (type) {
    queryParams.append('filters[type][$eq]', type);
  }

  // Add sorting
  switch (sortBy) {
    case 'latest':
      queryParams.append('sort[0]', 'completionDate:desc');
      break;
    case 'oldest':
      queryParams.append('sort[0]', 'completionDate:asc');
      break;
    case 'most-viewed':
      queryParams.append('sort[0]', 'views:desc');
      break;
    case 'least-viewed':
      queryParams.append('sort[0]', 'views:asc');
      break;
  }

  const response = await strapiGet(`/posts?${queryParams.toString()}`);

  // Transform the response data
  const transformedData = response.data.data?.map(transformPostData) || [];

  return {
    data: transformedData,
    meta: response.data.meta
  };
}

// Get a single post by slug
export async function getStrapiPostBySlug(slug: string) {
  const queryParams = new URLSearchParams();
  queryParams.append('populate', '*');
  queryParams.append('filters[slug][$eq]', slug);

  const response = await strapiGet(`/posts?${queryParams.toString()}`);

  if (response.data.data && response.data.data.length > 0) {
    return transformPostData(response.data.data[0]);
  }

  return null;
}

// Get related posts based on shared tags
export async function getStrapiRelatedPosts(currentSlug: string, tags: PostTag[]): Promise<PostData[]> {
  if (!tags || tags.length === 0) {
    return [];
  }

  const queryParams = new URLSearchParams();
  queryParams.append('populate', '*');
  queryParams.append('pagination[page]', '1');
  queryParams.append('pagination[pageSize]', '2');

  // Add tag filters - exclude current post by slug
  tags.forEach(tag => {
    queryParams.append('filters[skillTags][skill][$in]', tag.text);
  });
  queryParams.append('filters[slug][$ne]', currentSlug);

  try {
    const response = await strapiGet(`/posts?${queryParams.toString()}`);
    return response.data.data?.map(transformPostData) || [];
  } catch (error) {
    console.error('Error fetching related posts:', error);
    return [];
  }
}

// Health check function
export async function checkStrapiHealth(): Promise<boolean> {
  try {
    const response = await strapiGet('/posts?pagination[pageSize]=1');
    return response.status === 200;
  } catch (error) {
    console.error('Strapi health check failed:', error);
    return false;
  }
}
