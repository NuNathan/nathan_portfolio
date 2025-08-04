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

