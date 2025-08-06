import Timeline from "@/components/experience/Timeline";
import { getExperiencePage } from "@/api/experiences";
import { getOGImageUrl } from "@/api/strapi";
import TechnicalSkills from "@/components/technical-skills/TechnicalSkills";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Experience - Nathan Campbell's Professional Journey",
  description: "Discover Nathan Campbell's professional experience, education, and technical skills in Computer Science. View his career timeline, educational background, and expertise in modern web technologies.",
  keywords: [
    "Nathan Campbell Experience",
    "Computer Science Experience",
    "Professional Timeline",
    "Education Background",
    "Technical Skills",
    "Career Journey",
    "Work Experience",
    "Software Development Skills",
    "Programming Experience",
    "Professional Development"
  ],
  openGraph: {
    title: "Experience - Nathan Campbell's Professional Journey",
    description: "Discover Nathan Campbell's professional experience, education, and technical skills in Computer Science.",
    url: "https://nathan.binarybridges.ca/main/experience",
    type: "website",
    images: [
      {
        url: getOGImageUrl("experience-og-image"),
        width: 1200,
        height: 630,
        alt: "Nathan Campbell - Professional Experience",
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Experience - Nathan Campbell's Professional Journey",
    description: "Discover Nathan Campbell's professional experience, education, and technical skills in Computer Science.",
    images: [getOGImageUrl("experience-og-image")],
  },
  alternates: {
    canonical: "https://nathan.binarybridges.ca/main/experience",
  },
};

// Default data structure with proper typing
const defaultPageData: {
  subHeader: string;
  experiences: Array<{
    type: "job" | "school";
    startDate: string;
    endDate: string | null;
    current: boolean;
    description: string;
    title: string | undefined;
    company: string | undefined;
    location: string | undefined;
    school: string | undefined;
    degree: string | undefined;
    gpa: string | undefined;
  }>;
  skillCategories: Array<{
    category: string;
    icon: string;
    color: string;
    skills: Array<{
      id: number;
      documentId: string;
      skill: string;
      mainColour: string;
      skillLevel: number;
      createdAt: string;
      updatedAt: string;
      publishedAt: string;
    }>;
  }>;
} = {
  subHeader: "My professional journey through software development and education",
  experiences: [],
  skillCategories: []
};

export default async function Experience() {
  let pageData = defaultPageData;

  try {
    pageData = await getExperiencePage();
  } catch (error) {
    console.error("Failed to fetch experience page data:", error);
  }

  return (
    <div className="min-h-screen bg-[#f6f9fc] px-4 sm:px-6 py-8 sm:py-12 mb-24">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12 sm:mb-16">
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto px-4">
            {pageData.subHeader}
          </p>
        </div>
        
        {/* Timeline Section */}
        <Timeline data={{ experiences: pageData.experiences }} />

        {/* Technical Skills Section */}
        {pageData.skillCategories && pageData.skillCategories.length > 0 && (
          <TechnicalSkills skillCategories={pageData.skillCategories} />
        )}
      </div>
    </div>
  );
}
