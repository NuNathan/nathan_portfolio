'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import SkillTag from "@/components/ui/SkillTag";
import ProjectSlide from "@/components/project-slide/ProjectSlide";
import { PostData } from "@/api/posts";

//TODO: The rich text here does not support very much, this should be made better to have more available types

interface DetailedContent {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  img: string;
  author: {
    name: string;
    title: string;
    avatar: string;
  };
  tags: Array<{ text: string; color: string }>;
  type: 'project' | 'blog';
  date: string;
  views: number;
  readTime: string;
  links?: {
    demo?: string;
    github?: string;
    live?: string;
  };
  slug: string;
  content: Array<{
    type: string;
    heading: string;
    content: string;
  }>;
  relatedProjects: Array<{
    title: string;
    description: string;
    img: string;
    readTime: string;
    slug: string;
  }>;
}

interface BlogDetailClientProps {
  slug: string;
}

// Use PostData from API instead of separate interface
type BlogItem = PostData;

export default function BlogDetailClient({ slug }: BlogDetailClientProps) {
  const [content, setContent] = useState<DetailedContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [relatedItems, setRelatedItems] = useState<BlogItem[]>([]);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Determine the source (Projects or Blog) from URL parameters or referrer
  const source = searchParams.get('from') || 'blog';
  const breadcrumbText = source === 'projects' ? 'Projects' : 'Blog';

  useEffect(() => {
    const loadContent = async () => {
      // Load from API using window.location for baseUrl
      try {
        console.log('[Client] Making client-side API call');
        setLoading(true);
        const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
        const response = await fetch(`${baseUrl}/api/posts/${slug}`);

        if (!response.ok) {
          throw new Error('Content not found');
        }

        const postData = await response.json();

        const transformedContent: DetailedContent = {
          id: postData.id,
          title: postData.title,
          subtitle: postData.description,
          description: postData.description,
          img: postData.img,
          author: {
            name: "Nathan Ramos",
            title: "Software Engineer",
            avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
          },
          tags: postData.tags || [],
          type: postData.type,
          date: postData.date,
          views: postData.views,
          readTime: postData.readTime,
          links: postData.links,
          slug: postData.slug || slug,
          content: [
            {
              type: "text",
              heading: "Overview",
              content: postData.description + "\n\nThis is a detailed article about " + postData.title.toLowerCase() + ". The content would normally be stored in a rich text format and rendered here."
            }
          ],
          relatedProjects: []
        };

        setContent(transformedContent);
        await loadRelatedItems(transformedContent);
      } catch (err) {
        setError('Failed to load content');
        console.error('Error loading content:', err);
      } finally {
        setLoading(false);
      }
    };

    const loadRelatedItems = async (currentContent: DetailedContent) => {
      try {
        // Get current item's tags
        const currentTags = (currentContent.tags || []).map(tag => tag.text);

        if (currentTags.length === 0) {
          setRelatedItems([]);
          return;
        }

        // Build query parameters for Strapi
        const queryParams = new URLSearchParams();
        queryParams.append('populate', '*');
        queryParams.append('pagination[page]', '1');
        queryParams.append('pagination[pageSize]', '2');

        // Add tag filters - exclude current post by slug
        currentTags.forEach(tag => {
          queryParams.append('filters[skillTags][skill][$in]', tag);
        });
        queryParams.append('filters[slug][$ne]', slug);

        // Fetch related posts from API
        const response = await fetch(`/api/posts?${queryParams.toString()}`);

        if (!response.ok) {
          throw new Error('Failed to fetch related posts');
        }

        const data = await response.json();
        setRelatedItems(data.data || []);
      } catch (err) {
        console.error('Error loading related items:', err);
        setRelatedItems([]);
      }
    };

    loadContent();
  }, [slug]);

  const handleBackNavigation = () => {
    if (source === 'projects') {
      router.push('/main/projects');
    } else {
      router.push('/main/blog');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f7fc] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading content...</p>
        </div>
      </div>
    );
  }

  if (error || !content) {
    return (
      <div className="min-h-screen bg-[#f8f7fc] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Content Not Found</h1>
          <p className="text-gray-600 mb-6">The requested content could not be found.</p>
          <button
            onClick={handleBackNavigation}
            className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all duration-200"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f7fc]">
      {/* Breadcrumb Navigation */}
      <div className="max-w-4xl mx-auto px-4 pt-4 sm:pt-8 pb-4">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-6 sm:mb-8">
          <button
            onClick={handleBackNavigation}
            className="hover:text-blue-600 transition-colors duration-200"
          >
            {breadcrumbText}
          </button>
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 111.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"/>
          </svg>
          <span className="font-medium truncate">{content.title}</span>
        </div>
      </div>

      {/* Main Content Card - Everything in one paper */}
      <div className="max-w-4xl mx-auto px-4 pb-8 sm:pb-16">
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {/* Hero Image */}
          <div className="relative h-64 sm:h-80 md:h-96">
            <img
              src={content.img}
              alt={content.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8">
              <div className="flex flex-wrap items-center gap-2 text-white/80 text-xs sm:text-sm mb-3 sm:mb-4">
                <div className="flex items-center gap-1">
                  <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
                  </svg>
                  <span>{content.views.toLocaleString()} views</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
                  </svg>
                  <span>{content.date}</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
                  </svg>
                  <span>{content.readTime} read</span>
                </div>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2 sm:mb-4">
                {content.title}
              </h1>
              <p className="text-sm sm:text-lg md:text-xl text-white/90 max-w-3xl">
                {content.subtitle}
              </p>
            </div>
          </div>

          {/* Content Body */}
          <div className="p-4 sm:p-6 md:p-8">
            {/* Author and Tags Section */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 sm:mb-8">
              <div className="flex items-center gap-3 sm:gap-4 mb-4 md:mb-0">
                <img
                  src={content.author.avatar}
                  alt={content.author.name}
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full"
                />
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm sm:text-base">{content.author.name}</h3>
                  <p className="text-gray-600 text-xs sm:text-sm">{content.author.title}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {content.tags && content.tags.length > 0 && content.tags.map((tag, index) => (
                  <SkillTag
                    key={index}
                    text={tag.text}
                    mainColour={tag.color}
                    variant="blog"
                    size="sm"
                  />
                ))}
              </div>
            </div>

            {/* Article Content */}
            <div className="mb-8">
              {content.content.map((section, index) => (
                <div key={index} className="mb-8 last:mb-0">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    {section.heading}
                  </h2>
                  <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                    {section.content.split('\n').map((paragraph, pIndex) => {
                      if (paragraph.trim() === '') return null;

                      // Handle code blocks
                      if (paragraph.includes('```')) {
                        return (
                          <pre key={pIndex} className="bg-gray-100 p-4 rounded-lg overflow-x-auto my-4">
                            <code>{paragraph.replace(/```\w*\n?/g, '').replace(/```/g, '')}</code>
                          </pre>
                        );
                      }

                      // Handle bullet points
                      if (paragraph.startsWith('•')) {
                        return (
                          <li key={pIndex} className="ml-4 mb-2">
                            {paragraph.substring(1).trim()}
                          </li>
                        );
                      }

                      // Handle bold text
                      if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                        return (
                          <h3 key={pIndex} className="text-lg font-semibold text-gray-900 mt-6 mb-2">
                            {paragraph.replace(/\*\*/g, '')}
                          </h3>
                        );
                      }

                      return (
                        <p key={pIndex} className="mb-4">
                          {paragraph}
                        </p>
                      );
                    })}
                  </div>
                </div>
              ))}
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
                      <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      Live Demo
                    </a>
                  )}
                  {content.links.github && (
                    <a
                      href={content.links.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 sm:px-6 py-2 sm:py-3 bg-gray-800 text-white font-medium rounded-lg hover:bg-gray-700 transition-all duration-200 flex items-center justify-center gap-2 text-sm sm:text-base"
                    >
                      <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd"/>
                      </svg>
                      Source Code
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Social Actions */}
            <div className="border-t pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {/* <button className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-blue-600 transition-colors duration-200">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    <span>42 likes</span>
                  </button> */}
                  {/* <button className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-blue-600 transition-colors duration-200">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                    </svg>
                    <span>Share</span>
                  </button> */}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Items */}
        {relatedItems.length > 0 && (
          <div className="mt-12">
            <h2 className="text-3xl font-bold text-center mb-8 text-gradient-primary">
              Related {content.type === 'project' ? 'Projects' : 'Articles'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {relatedItems.map((item) => (
                <ProjectSlide
                  key={item.id}
                  title={item.title}
                  description={item.description}
                  img={item.img}
                  tags={item.tags}
                  type={item.type}
                  date={item.date}
                  views={item.views}
                  readTime={item.readTime}
                  links={item.links}
                  slug={item.slug}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
