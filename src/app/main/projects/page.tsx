import ProjectSlide from "@/components/project-slide/ProjectSlide";
import ProjectImpact from "@/components/project-impact/ProjectImpact";
import CallToAction from "@/components/call-to-action/CallToAction";
import { PostData } from "@/api/posts";
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

const STRAPI_URL = process.env.STRAPI_API_URL;
const STRAPI_TOKEN = process.env.STRAPI_TOKEN;
const STRAPI_MEDIA_URL = process.env.STRAPI_MEDIA_URL;

export default async function Projects() {
  // Fetch project posts directly from Strapi
  let projectPosts: PostData[] = [];
  try {
    const queryParams = new URLSearchParams();
    queryParams.append('populate', '*');
    queryParams.append('pagination[page]', '1');
    queryParams.append('pagination[pageSize]', '100');
    queryParams.append('sort[0]', 'completionDate:desc');
    queryParams.append('filters[type][$eq]', 'project');

    const response = await fetch(`${STRAPI_URL}/posts?${queryParams.toString()}`, {
      headers: {
        'Authorization': `Bearer ${STRAPI_TOKEN}`,
      },
    });

    if (response.ok) {
      const data = await response.json();

      // Transform the data to match our expected format
      projectPosts = data.data.map((post: any) => ({
        ...post,
        // Transform img object with url property
        img: post.img && typeof post.img === 'object' && post.img.url
          ? (post.img.url.startsWith('http') ? post.img.url : `${STRAPI_MEDIA_URL}${post.img.url}`)
          : (post.img && typeof post.img === 'string' && !post.img.startsWith('http')
             ? `${STRAPI_MEDIA_URL}${post.img}`
             : post.img),
        // Transform skillTags to tags
        tags: post.skillTags ? post.skillTags.map((skillTag: any) => ({
          id: skillTag.id,
          text: skillTag.skill,
          color: skillTag.mainColour
        })) : [],
        // Transform demo/github/live fields to links object
        links: {
          demo: post.demo || undefined,
          github: post.github || undefined,
          live: post.live || undefined
        },
        // Format date
        date: post.completionDate ? new Date(post.completionDate).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        }) : undefined,
        // Ensure views field is properly handled
        views: post.views || 0
      }));
    }
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
