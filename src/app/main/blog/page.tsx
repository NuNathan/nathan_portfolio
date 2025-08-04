import BlogClient from './BlogClient';
import { PostData } from "@/api/posts";
import { formatDateConsistently } from "@/utils/dateUtils";
import axios from 'axios';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Blog - Nathan Campbell's Technical Insights",
  description: "Read Nathan Campbell's blog featuring technical articles, tutorials, and insights on Computer Science, web development, React, Vue, and modern programming practices.",
  keywords: [
    "Nathan Campbell Blog",
    "Computer Science Blog",
    "Web Development Articles",
    "React Tutorials",
    "Vue.js Articles",
    "Programming Insights",
    "Technical Writing",
    "Development Blog",
    "JavaScript Articles",
    "TypeScript Tutorials",
    "Frontend Development",
    "Software Development Tips"
  ],
  openGraph: {
    title: "Blog - Nathan Campbell's Technical Insights",
    description: "Read Nathan Campbell's blog featuring technical articles, tutorials, and insights on Computer Science and web development.",
    url: "https://nathan.binarybridges.ca/main/blog",
    type: "website",
    images: [
      {
        url: "/blog-og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Nathan Campbell - Technical Blog",
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog - Nathan Campbell's Technical Insights",
    description: "Read Nathan Campbell's blog featuring technical articles, tutorials, and insights on Computer Science and web development.",
    images: ["/blog-og-image.jpg"],
  },
  alternates: {
    canonical: "https://nathan.binarybridges.ca/main/blog",
  },
};

const STRAPI_MEDIA_URL = process.env.STRAPI_MEDIA_URL;
const STRAPI_URL = process.env.STRAPI_API_URL;
const STRAPI_TOKEN = process.env.STRAPI_TOKEN;

// Disable all caching for this page
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Blog() {
  // Fetch initial posts server-side (first page, latest first, all types)
  let initialPosts: PostData[] = [];
  let totalPages = 1;
  let totalItems = 0;

  try {
    const queryParams = new URLSearchParams();
    queryParams.append('populate', '*');
    queryParams.append('pagination[page]', '1');
    queryParams.append('pagination[pageSize]', '6');
    queryParams.append('sort[0]', 'completionDate:desc'); // Latest first

    const response = await axios.get(`${STRAPI_URL}/posts?${queryParams.toString()}`, {
      headers: {
        Authorization: `Bearer ${STRAPI_TOKEN}`,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
      timeout: 20000,
    });

    if (response.data && response.data.data) {
      // Transform the data to match our expected format
      initialPosts = response.data.data.map((post: any) => ({
        ...post,
        // Handle img object with url property
        img: post.img && typeof post.img === 'object' && post.img.url
          ? (post.img.url.startsWith('http') ? post.img.url : `${STRAPI_MEDIA_URL}${post.img.url}`)
          : (post.img && typeof post.img === 'string' && !post.img.startsWith('http')
             ? `${STRAPI_MEDIA_URL}${post.img}`
             : post.img),
        // Transform skillTags to tags with correct structure
        tags: post.skillTags && Array.isArray(post.skillTags)
          ? post.skillTags.map((skillTag: any) => ({
              id: skillTag.id,
              text: skillTag.skill,
              color: skillTag.mainColour
            }))
          : [],
        // Transform demo/github/live fields to links object
        links: {
          demo: post.demo || undefined,
          github: post.github || undefined,
          live: post.live || undefined
        },
        // Ensure date field is properly formatted consistently for server/client
        date: formatDateConsistently(post.completionDate),
        // Ensure views field is properly handled
        views: post.views || 0
      }));

      // Get pagination info
      if (response.data.meta && response.data.meta.pagination) {
        totalPages = response.data.meta.pagination.pageCount;
        totalItems = response.data.meta.pagination.total;
      }
    }
  } catch (error) {
    console.error('Failed to fetch initial blog posts:', error);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-4 sm:py-8">
      {/* Header Section */}
      <div className="text-center mb-8 sm:mb-12 mt-4 sm:mt-0">
        <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto px-4">
          Thoughts, tutorials, and insights from my journey in Computer Science
        </p>
      </div>

      {/* Pass server-side data to client component */}
      <BlogClient
        initialPosts={initialPosts}
        initialTotalPages={totalPages}
        initialTotalItems={totalItems}
      />
    </div>
  );
}
