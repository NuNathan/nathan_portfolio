import Timeline from "@/components/timeline/Timeline";
import { getExperiencePage } from "@/api/experiences";
import TechnicalSkills from "@/components/technical-skills/TechnicalSkills";

export default async function Experience() {
  let pageData: {
    subHeader: string;
    experiences: Array<{
      type: 'job' | 'school';
      startDate: string;
      endDate: string | null;
      current: boolean;
      description: string;
      // Job-specific fields
      title?: string;
      company?: string;
      location?: string;
      // School-specific fields
      school?: string;
      degree?: string;
      gpa?: string;
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

  // We wrap only the data fetch, not the component render
  try {
    pageData = await getExperiencePage();
  } catch (error) {
    console.error("Failed to fetch experience page data:", error);
    // Leave pageData as default object with empty arrays
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

        {/* Technical Skills Section - only render if we have skill categories */}
        {pageData.skillCategories && pageData.skillCategories.length > 0 && (
          <TechnicalSkills skillCategories={pageData.skillCategories} />
        )}
      </div>
    </div>
  );
}
