import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const STRAPI_PUBLIC_URL = process.env.STRAPI_URL;
const STRAPI_URL = process.env.STRAPI_API_URL;
const STRAPI_TOKEN = process.env.STRAPI_TOKEN;

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  try {
    // Build Strapi query parameters
    const queryParams = new URLSearchParams();
    queryParams.append('populate[skillTags]', 'true');
    queryParams.append('populate[img]', 'true');
    queryParams.append('populate[author][populate]', 'avatar');
    queryParams.append('filters[slug][$eq]', slug);


    const response = await axios.get(`${STRAPI_URL}/posts?${queryParams.toString()}`, {
      headers: {
        Authorization: `Bearer ${STRAPI_TOKEN}`,
      },
    });

    const data = response.data;
    console.log(JSON.stringify(data, null, 2));
    if (data.data && data.data.length > 0) {
      const post = data.data[0];

      // Handle img object with url property
      if (post.img && typeof post.img === 'object' && post.img.url) {
        const imgUrl = post.img.url;
        post.img = imgUrl.startsWith('http') ? imgUrl : `${STRAPI_PUBLIC_URL}${imgUrl}`;
      } else if (post.img && typeof post.img === 'string' && !post.img.startsWith('http')) {
        post.img = `${STRAPI_PUBLIC_URL}${post.img}`;
      }

      if (post.author?.avatar && typeof post.author.avatar === 'object' && post.author.avatar.url) {
        const avatarUrl = post.author.avatar.url;
        post.author.avatar = avatarUrl.startsWith('http')
          ? avatarUrl
          : `${STRAPI_PUBLIC_URL}${avatarUrl}`;
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

      return NextResponse.json(post);
    }

    // If no data found in Strapi, fall through to fallback data
  } catch (error) {
    console.error('Error fetching post by slug:', error);
    // Fall through to fallback data
  }

  // Return 404 if no post found
  return NextResponse.json({ error: 'Post not found' }, { status: 404 });
}
