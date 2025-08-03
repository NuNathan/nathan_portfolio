'use client';

import { useEffect, useState } from 'react';
import SkillTag from "@/components/ui/SkillTag";
import RichTextRenderer from "@/components/ui/RichTextRenderer";
import { PostData } from "@/api/posts";
import Image from 'next/image';
import Link from 'next/link';

interface BlogDetailClientProps {
  slug: string;
  postData: PostData;
}

// Minimal version without any useSearchParams
export default function BlogDetailClientNew({ slug, postData }: BlogDetailClientProps) {
  const [loadingRelated, setLoadingRelated] = useState(true);

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
    date: postData.date,
    views: postData.views,
    readTime: postData.readTime,
    links: postData.links,
    slug: postData.slug || slug,
    content: postData.content || `<p>${postData.description}</p>`,
  };

  useEffect(() => {
    // Simulate loading related items
    setTimeout(() => {
      setLoadingRelated(false);
    }, 1000);
  }, []);

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
                    variant="blog"
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
              <div className="flex items-center gap-2">
                <Image
                  src={content.author.avatar}
                  alt={content.author.name}
                  width={32}
                  height={32}
                  className="rounded-full"
                />
                <div>
                  <p className="font-medium text-gray-900">{content.author.name}</p>
                  <p className="text-xs">{content.author.title}</p>
                </div>
              </div>
              <span>•</span>
              <span>{content.date}</span>
              <span>•</span>
              <span>{content.views} views</span>
              <span>•</span>
              <span>{content.readTime}</span>
            </div>

            {/* Rich Text Content */}
            <div className="prose prose-lg max-w-none mb-8 sm:mb-12">
              <RichTextRenderer content={content.content} />
            </div>

            {/* Action Buttons for Projects */}
            {content.type === 'project' && content.links && (
              <div className="mb-6 sm:mb-8">
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  {content.links.demo && (
                    <a
                      href={content.links.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 text-sm sm:text-base"
                    >
                      Live Demo
                    </a>
                  )}
                  {content.links.github && (
                    <a
                      href={content.links.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 sm:px-6 py-2 sm:py-3 bg-gray-800 text-white font-medium rounded-lg hover:bg-gray-900 transition-all duration-200 flex items-center justify-center gap-2 text-sm sm:text-base"
                    >
                      View Code
                    </a>
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
          
          {loadingRelated ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading related content...</p>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600">No related content available.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
