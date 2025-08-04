import ProjectSlide from "@/components/project-slide/ProjectSlide";
import ProjectImpact from "@/components/project-impact/ProjectImpact";
import CallToAction from "@/components/call-to-action/CallToAction";
import { PostData } from "@/api/posts";
import { getStrapiPosts } from "@/api/strapi";
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
        url: "/projects-og-image.jpg",
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
    images: ["/projects-og-image.jpg"],
  },
  alternates: {
    canonical: "https://nathan.binarybridges.ca/main/projects",
  },
};

// Disable all caching for this page
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Projects() {
  // Fetch project posts using centralized API
  let projectPosts: PostData[] = [];
  try {
    const response = await getStrapiPosts({
      page: 1,
      pageSize: 100,
      type: 'project',
      sortBy: 'latest'
    });

    projectPosts = response.data;
  } catch (error) {
    console.error('Failed to fetch project posts:', error);
  }
  return (
    <div className="max-w-7xl mx-auto px-4">
      {/* Header Section */}
      <div className="text-center mb-8 sm:mb-12">
        <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto px-4">
          A comprehensive showcase of my development journey and technical expertise
        </p>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16">
        {projectPosts.map((project) => (
          <ProjectSlide
            key={project.id}
            title={project.title}
            description={project.description}
            img={project.img}
            tags={project.tags || []}
            type="project"
            links={project.links || {}}
            slug={project.slug}
            date={project.date}
            views={project.views}
            readTime={project.readTime}
            source="projects"
          />
        ))}
      </div>

      {/* Project Impact Section - Controlled by feature flag TODO */}
      {process.env.NEXT_PUBLIC_SHOW_PROJECT_IMPACT === 'true' && <ProjectImpact />}

      {/* Call to Action Section */}
      <CallToAction />
    </div>
  );
}
