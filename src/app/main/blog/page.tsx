import BlogClient from './BlogClient';
import { PostData } from "@/api/posts";
import { getOGImageUrl, getStrapiPosts } from "@/api/strapi";
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
        url: getOGImageUrl("blog-og-image"),
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
    images: [getOGImageUrl("blog-og-image")],
  },
  alternates: {
    canonical: "https://nathan.binarybridges.ca/main/blog",
  },
};

// Disable all caching for this page
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Blog() {
  // Fetch initial posts server-side (first page, latest first, all types)
  let initialPosts: PostData[] = [];
  let totalPages = 1;
  let totalItems = 0;

  try {
    const response = await getStrapiPosts({
      page: 1,
      pageSize: 12,
      sortBy: 'latest'
    });

    initialPosts = response.data;
    totalPages = response.meta.pagination.pageCount;
    totalItems = response.meta.pagination.total;
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
