import ProjectSlide from "@/components/project-slide/ProjectSlide";
import ProjectImpact from "@/components/project-impact/ProjectImpact";
import CallToAction from "@/components/call-to-action/CallToAction";
import { PostData } from "@/api/posts";

const STRAPI_URL = process.env.STRAPI_API_URL;
const STRAPI_TOKEN = process.env.STRAPI_TOKEN;

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
          ? (post.img.url.startsWith('http') ? post.img.url : `${process.env.STRAPI_URL}${post.img.url}`)
          : post.img,
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
