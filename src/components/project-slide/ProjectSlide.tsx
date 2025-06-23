'use client';

import SkillTag from "@/components/ui/SkillTag";
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';

interface ProjectSlideProps {
    title: string;
    description: string;
    img: string;
    tags?: Array<string | {text: string; color: string}>;
    links?: {
        demo?: string;
        github?: string;
        live?: string;
    };
    type?: 'project' | 'blog';
    date?: string;
    views?: number;
    readTime?: string;
    slug?: string;
}

export default function ProjectSlide({
    title,
    description,
    img,
    tags = [],
    links = {},
    type = 'project',
    date,
    views = 0,
    readTime,
    slug
}: ProjectSlideProps) {
    const router = useRouter();
    const pathname = usePathname();

    const handleClick = () => {
        if (slug) {
            // Determine source based on current pathname
            const source = pathname.includes('/projects') ? 'projects' : 'blog';
            router.push(`/main/blog/${slug}?from=${source}`);
        }
    };

    return (
        <div
            className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8 group cursor-pointer flex flex-col h-full"
            onClick={handleClick}
        >
            {/* Project Image */}
            <div className="relative h-48 overflow-hidden">
                <Image
                    src={img}
                    width={640}
                    height={640}
                    alt={title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-90 transition-opacity duration-300 flex items-center justify-center">
                    <div className="text-white text-center">
                        <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        
                        <span className="font-medium">{type === 'project' ? 'View Project' : 'Read Blog'}</span>
                    </div>
                </div>
            </div>

            {/* Project Content */}
            <div className="p-6 flex flex-col h-full">
                {/* Tags - moved above title */}
                {tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                        {tags.map((tag, index) => (
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

                <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>

                <p className="text-gray-600 text-sm leading-relaxed mb-4 flex-grow">{description}</p>

                {/* Launch Demo button - moved above date/view/time section */}
                {type === 'project' && links.demo && links.demo !== '' && links.demo !== '#' && (
                    <div className="mb-4">
                        <a
                            href={links.demo}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium rounded-lg hover:shadow-lg transition-all duration-200">
                                Launch Demo
                            </button>
                        </a>
                    </div>
                )}

                {/* Bottom section with date, views, and read time - now sticks to bottom */}
                <div className="flex items-center gap-4 text-gray-500 text-xs mt-auto">
                    {/* Date */}
                    {date && (
                        <div className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
                            </svg>
                            <span>{date}</span>
                        </div>
                    )}

                    {/* Views */}
                    <div className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
                        </svg>
                        <span>{views.toLocaleString()}</span>
                    </div>

                    {/* Read time */}
                    {readTime && (
                        <div className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
                            </svg>
                            <span>{readTime}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}