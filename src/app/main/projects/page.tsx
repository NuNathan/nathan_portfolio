import ProjectsClient from './ProjectsClient';
import ProjectImpact from "@/components/project-impact/ProjectImpact";
import CallToAction from "@/components/call-to-action/CallToAction";
import { PostData } from "@/api/posts";
import { getStrapiPosts, getOGImageUrl } from "@/api/strapi";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Projects - Nathan Campbell's Development Portfolio",
  description: "Explore Nathan Campbell's software development projects showcasing expertise in React, Vue, Next.js, and modern web technologies. View live demos, source code, and technical implementations.",
  keywords: [
    "Nathan Campbell Projects",
    "Software Development Portfolio",
    "React Projects",
    "Vue Projects",
    "Next.js Applications",
    "Web Development",
    "Frontend Projects",
    "Full Stack Development",
    "JavaScript Projects",
    "TypeScript Projects",
    "Open Source",
    "Live Demos"
  ],
  openGraph: {
    title: "Projects - Nathan Campbell's Development Portfolio",
    description: "Explore Nathan Campbell's software development projects showcasing expertise in React, Vue, Next.js, and modern web technologies.",
    url: "https://nathan.binarybridges.ca/main/projects",
    type: "website",
    images: [
      {
        url: getOGImageUrl("projects-og-image"),
        width: 1200,
        height: 630,
        alt: "Nathan Campbell - Projects Portfolio",
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Projects - Nathan Campbell's Development Portfolio",
    description: "Explore Nathan Campbell's software development projects showcasing expertise in React, Vue, Next.js, and modern web technologies.",
    images: [getOGImageUrl("projects-og-image")],
  },
  alternates: {
    canonical: "https://nathan.binarybridges.ca/main/projects",
  },
};

// Disable all caching for this page
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Constants
const PROJECT_FETCH_CONFIG = {
  page: 1,
  pageSize: 12,
  type: 'project' as const,
  sortBy: 'latest' as const
};

export default async function Projects() {
  // Fetch initial projects server-side (first page, latest first)
  let initialProjects: PostData[] = [];
  let totalPages = 1;
  let totalItems = 0;

  try {
    const response = await getStrapiPosts(PROJECT_FETCH_CONFIG);
    initialProjects = response.data;
    totalPages = response.meta.pagination.pageCount;
    totalItems = response.meta.pagination.total;
  } catch (error) {
    console.error('Failed to fetch initial project posts:', error);
  }
  return (
    <div className="max-w-7xl mx-auto px-4">
      {/* Header Section */}
      <div className="text-center mb-8 sm:mb-12">
        <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto px-4">
          A comprehensive showcase of my development journey and technical expertise
        </p>
      </div>

      {/* Projects with Search and Pagination */}
      <ProjectsClient
        initialProjects={initialProjects}
        initialTotalPages={totalPages}
        initialTotalItems={totalItems}
      />

      {/* Project Impact Section - Controlled by feature flag TODO */}
      {process.env.NEXT_PUBLIC_SHOW_PROJECT_IMPACT === 'true' && <ProjectImpact />}

      {/* Call to Action Section */}
      <CallToAction />
    </div>
  );
}
