// Client-side API utilities for posts

export interface PostTag {
  id: number;
  text: string;
  color: string;
}

export interface PostLinks {
  demo?: string;
  github?: string;
  live?: string;
}

export interface PostData {
  author: any;
  id: number;
  documentId: string;
  title: string;
  description: string;
  img: string;
  tags: PostTag[];
  type: 'project' | 'blog';
  date: string;
  views: number;
  readTime: string;
  links?: PostLinks;
  slug?: string;
  completionDate: string;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
  content?: string; // Rich text content from CKEditor
}

export interface PostsResponse {
  data: PostData[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface PostsQueryParams {
  page?: number;
  pageSize?: number;
  search?: string;
  type?: 'project' | 'blog' | 'all';
  sortBy?: 'latest' | 'oldest' | 'most-viewed' | 'least-viewed';
}

export async function getPosts(params: PostsQueryParams = {}): Promise<PostsResponse> {
  try {
    const {
      page = 1,
      pageSize = 6,
      search = '',
      type = 'all',
      sortBy = 'latest'
    } = params;

    // Build query parameters for our API route
    const queryParams = new URLSearchParams();
    queryParams.append('page', page.toString());
    queryParams.append('pageSize', pageSize.toString());

    if (search.trim()) {
      queryParams.append('search', search.trim());
    }

    if (type !== 'all') {
      queryParams.append('type', type);
    }

    queryParams.append('sortBy', sortBy);

    const response = await fetch(`/api/posts?${queryParams.toString()}`, {
      signal: AbortSignal.timeout(20000), // 20 second timeout
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching posts:', error);

    // Return empty data if API fails
    const emptyData: PostsResponse = {
      data: [],
      meta: {
        pagination: {
          page: params.page || 1,
          pageSize: params.pageSize || 6,
          pageCount: 0,
          total: 0
        }
      }
    };

    return emptyData;
  }
}

// Server-side function to get related posts based on shared tags
export async function getRelatedPosts(currentSlug: string, tags: PostTag[]): Promise<PostData[]> {
  try {
    // If no tags, return empty array
    if (!tags || tags.length === 0) {
      return [];
    }

    // Import axios dynamically for server-side use
    const axios = (await import('axios')).default;

    const STRAPI_URL = process.env.STRAPI_API_URL;
    const STRAPI_TOKEN = process.env.STRAPI_TOKEN;
    const STRAPI_MEDIA_URL = process.env.STRAPI_MEDIA_URL;

    if (!STRAPI_URL || !STRAPI_TOKEN) {
      console.error('Missing Strapi configuration');
      return [];
    }

    // Build query parameters for Strapi
    const queryParams = new URLSearchParams();
    queryParams.append('populate', '*');
    queryParams.append('pagination[page]', '1');
    queryParams.append('pagination[pageSize]', '2'); // Only get 2 related posts

    // Add tag filters - exclude current post by slug
    tags.forEach(tag => {
      queryParams.append('filters[skillTags][skill][$in]', tag.text);
    });
    queryParams.append('filters[slug][$ne]', currentSlug);

    const response = await axios.get(`${STRAPI_URL}/posts?${queryParams.toString()}`, {
      headers: {
        Authorization: `Bearer ${STRAPI_TOKEN}`,
      },
      timeout: 10000,
    });

    const data = response.data;
    if (data.data && Array.isArray(data.data)) {
      // Transform the data to match PostData interface
      const transformedPosts = data.data.map((post: any) => {
        // Handle img object with url property
        if (post.img && typeof post.img === 'object' && post.img.url) {
          const imgUrl = post.img.url;
          post.img = imgUrl.startsWith('http') ? imgUrl : `${STRAPI_MEDIA_URL}${imgUrl}`;
        } else if (post.img && typeof post.img === 'string' && !post.img.startsWith('http')) {
          post.img = `${STRAPI_MEDIA_URL}${post.img}`;
        }

        // Transform skillTags to tags with correct structure
        if (post.skillTags && Array.isArray(post.skillTags)) {
          post.tags = post.skillTags.map((skillTag: any) => ({
            id: skillTag.id,
            text: skillTag.skill,
            color: skillTag.mainColour
          }));
          delete post.skillTags;
        } else {
          post.tags = [];
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

        return post;
      });

      return transformedPosts;
    }

    return [];
  } catch (error) {
    console.error('Error fetching related posts:', error);
    return [];
  }
}