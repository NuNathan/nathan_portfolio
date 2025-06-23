import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { PostData, PostsResponse } from '@/api/posts';

const STRAPI_PUBLIC_URL = process.env.STRAPI_URL;
const STRAPI_URL = process.env.STRAPI_API_URL;
const STRAPI_TOKEN = process.env.STRAPI_TOKEN;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  // Get query parameters
  const page = parseInt(searchParams.get('page') || '1');
  const pageSize = parseInt(searchParams.get('pageSize') || '6');
  const search = searchParams.get('search') || '';
  const type = searchParams.get('type') || 'all';
  const sortBy = searchParams.get('sortBy') || 'latest';

  // Get related posts parameters
  const skillTagFilters = searchParams.getAll('filters[skillTags][skill][$in]');
  const excludeSlug = searchParams.get('filters[slug][$ne]');

  try {

    // Build Strapi query parameters
    const queryParams = new URLSearchParams();
    
    // Pagination
    queryParams.append('populate', '*');
    queryParams.append('pagination[page]', page.toString());
    queryParams.append('pagination[pageSize]', pageSize.toString());
    
    // Sorting
    let sortField = 'completionDate';
    let sortOrder = 'desc';
    
    switch (sortBy) {
      case 'latest':
        sortField = 'completionDate';
        sortOrder = 'desc';
        break;
      case 'oldest':
        sortField = 'completionDate';
        sortOrder = 'asc';
        break;
      case 'most-viewed':
        sortField = 'views';
        sortOrder = 'desc';
        break;
      case 'least-viewed':
        sortField = 'views';
        sortOrder = 'asc';
        break;
    }
    
    queryParams.append('sort[0]', `${sortField}:${sortOrder}`);
    
    // Type filter
    if (type !== 'all') {
      queryParams.append('filters[type][$eq]', type);
    }

    // SkillTags filter for related posts
    if (skillTagFilters.length > 0) {
      skillTagFilters.forEach(tag => {
        queryParams.append('filters[skillTags][skill][$in]', tag);
      });
    }

    // Exclude specific slug (for related posts)
    if (excludeSlug) {
      queryParams.append('filters[slug][$ne]', excludeSlug);
    }

    // Search filter - search in title and description (server-side)
    // We'll add client-side tag filtering after getting the results
    if (search.trim()) {
      const searchTerm = search.trim();
      // Use Strapi's $or operator to search across multiple fields
      queryParams.append('filters[$or][0][title][$containsi]', searchTerm);
      queryParams.append('filters[$or][1][description][$containsi]', searchTerm);
    }

    const response = await axios.get(`${STRAPI_URL}/posts?${queryParams.toString()}`, {
      headers: {
        Authorization: `Bearer ${STRAPI_TOKEN}`,
      },
    });

    // Transform the response to include full URLs for image assets
    const data = response.data;
    if (data.data && Array.isArray(data.data)) {
      data.data = data.data.map((post: any) => {
        // Handle img object with url property
        if (post.img && typeof post.img === 'object' && post.img.url) {
          const imgUrl = post.img.url;
          post.img = imgUrl.startsWith('http') ? imgUrl : `${STRAPI_PUBLIC_URL}${imgUrl}`;
        } else if (post.img && typeof post.img === 'string' && !post.img.startsWith('http')) {
          post.img = `${STRAPI_PUBLIC_URL}${post.img}`;
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

        return post;
      });

      // Client-side tag filtering if search term is provided
      if (search.trim()) {
        const searchTerm = search.trim().toLowerCase();
        data.data = data.data.filter((post: any) => {
          // Check if already matched by title/description (server-side search)
          const titleMatch = post.title?.toLowerCase().includes(searchTerm);
          const descMatch = post.description?.toLowerCase().includes(searchTerm);

          // Check tags (client-side search)
          const tagMatch = post.tags && Array.isArray(post.tags) &&
            post.tags.some((tag: any) =>
              tag.text?.toLowerCase().includes(searchTerm)
            );

          return titleMatch || descMatch || tagMatch;
        });

        // Update pagination meta to reflect filtered results
        data.meta.pagination.total = data.data.length;
        data.meta.pagination.pageCount = Math.ceil(data.data.length / pageSize);
      }
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching posts:', error);

    // Return empty data if API fails
    const emptyData: PostsResponse = {
      data: [],
      meta: {
        pagination: {
          page: page,
          pageSize: pageSize,
          pageCount: 0,
          total: 0
        }
      }
    };

    return NextResponse.json(emptyData);
  }
}
