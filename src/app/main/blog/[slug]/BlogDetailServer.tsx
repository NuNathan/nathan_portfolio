import SkillTag from "@/components/ui/SkillTag";
import ActionButton from "@/components/ui/ActionButton";
import { PostData } from "@/api/posts";
import { getStrapiRelatedPosts } from "@/api/strapi";
import ProjectSlide from "@/components/project-slide/ProjectSlide";
import Image from 'next/image';
import Link from 'next/link';

interface BlogDetailServerProps {
  slug: string;
  postData: PostData;
}

// Server-side only version to avoid hydration issues
export default async function BlogDetailServer({ slug, postData }: BlogDetailServerProps) {
  // Simple breadcrumb - always go back to blog
  const breadcrumbText = 'Blog';
  const backUrl = '/main/blog';

  // Transform postData to content format
  const content = {
    id: postData.id,
    title: postData.title,
    subtitle: postData.description,
    description: postData.description,
    img: postData.img,
    author: {
      name: postData.author?.name || 'Nathan Campbell',
      title: postData.author?.title || 'Software Engineering Student',
      avatar: postData.author?.avatar || '/default-avatar.jpg'
    },
    tags: postData.tags || [],
    type: postData.type,
    date: postData.date || 'Recent',
    views: postData.views || 0,
    readTime: postData.readTime || '5 min read',
    links: postData.links,
    slug: postData.slug || slug,
    content: postData.content || `<p>${postData.description}</p>`,
  };

  // Fetch related posts based on shared tags
  const relatedPosts = await getStrapiRelatedPosts(slug, postData.tags || []);

  return (
    <div className="min-h-screen bg-[#f8f7fc]">
      {/* Breadcrumb Navigation */}
      <div className="max-w-4xl mx-auto px-4 pt-4 sm:pt-8 pb-4">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-6 sm:mb-8">
          <Link
            href={backUrl}
            className="hover:text-blue-600 transition-colors duration-200"
            prefetch={true}
          >
            {breadcrumbText}
          </Link>
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 111.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"/>
          </svg>
          <span className="font-medium truncate">{content.title}</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 pb-8 sm:pb-12">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Header Image */}
          <div className="relative h-64 sm:h-80 lg:h-96">
            <Image
              src={content.img}
              alt={content.title}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Content */}
          <div className="p-6 sm:p-8 lg:p-12">
            {/* Tags */}
            {content.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {content.tags.map((tag, index) => (
                  <SkillTag
                    key={index}
                    text={typeof tag === 'string' ? tag : tag.text}
                    mainColour={typeof tag === 'string' ? '#6366f1' : tag.color}
                    size="sm"
                  />
                ))}
              </div>
            )}

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
              {content.title}
            </h1>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm text-gray-600 mb-8 sm:mb-12">
              <div className="flex items-center gap-4">
                <Image
                  src={content.author.avatar}
                  alt={content.author.name}
                  width={48}
                  height={48}
                  className="rounded-full object-cover w-12 h-12"
                />
                <div className="flex flex-col justify-center">
                  <p className="font-medium text-gray-900 leading-tight" style={{marginBottom: 0, lineHeight: 1}}>{content.author.name}</p>
                  <p className="text-gray-600 leading-tight" style={{marginBottom: 0, fontSize: '0.85rem'}}>{content.author.title}</p>
                </div>
              </div>

              {/* Date */}
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
                </svg>
                <span>{content.date}</span>
              </div>

              {/* Views */}
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                  <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
                </svg>
                <span>{content.views} views</span>
              </div>

              {/* Read time */}
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
                </svg>
                <span>{content.readTime}</span>
              </div>
            </div>

            {/* Rich Text Content */}
            <div
              className="mb-8 sm:mb-12"
              dangerouslySetInnerHTML={{ __html: content.content }}
              style={{
                fontSize: '1.125rem',
                lineHeight: '1.75',
                color: '#374151'
              }}
            />
            <style dangerouslySetInnerHTML={{
              __html: `
                .mb-8 h1 {
                  font-size: 2.25rem;
                  font-weight: 700;
                  line-height: 1.2;
                  margin-bottom: 1.5rem;
                  margin-top: 2rem;
                  color: #111827;
                }
                .mb-8 h2 {
                  font-size: 1.875rem;
                  font-weight: 700;
                  line-height: 1.3;
                  margin-bottom: 1.25rem;
                  margin-top: 1.75rem;
                  color: #111827;
                }
                .mb-8 h3 {
                  font-size: 1.5rem;
                  font-weight: 600;
                  line-height: 1.4;
                  margin-bottom: 1rem;
                  margin-top: 1.5rem;
                  color: #111827;
                }
                .mb-8 p {
                  font-size: 1.125rem;
                  line-height: 1.75;
                  margin-bottom: 1rem;
                  color: #374151;
                }
              `
            }} />

            {/* Action Buttons for Projects */}
            {content.type === 'project' && content.links && (
              <div className="mb-6 sm:mb-8">
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  {content.links.demo && (
                    <ActionButton
                      variant="primary"
                      href={content.links.demo}
                      external={true}
                      size="md"
                    >
                      Live Demo
                    </ActionButton>
                  )}
                  {content.links.github && (
                    <ActionButton
                      variant="github"
                      href={content.links.github}
                      external={true}
                      size="md"
                    >
                      View Code
                    </ActionButton>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Content Section */}
        <div className="mt-12 sm:mt-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">
            Related Content
          </h2>

          {relatedPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {relatedPosts.map((post) => (
                <ProjectSlide
                  key={post.id}
                  title={post.title}
                  description={post.description}
                  img={post.img}
                  tags={post.tags}
                  type={post.type}
                  date={post.date}
                  views={post.views}
                  readTime={post.readTime}
                  links={post.links}
                  slug={post.slug}
                  source="blog"
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">Check out more posts on the blog page.</p>
              <ActionButton
                variant="primary"
                href="/main/blog"
                size="md"
              >
                View All Posts
              </ActionButton>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
