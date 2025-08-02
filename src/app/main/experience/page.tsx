import Timeline from "@/components/experience/Timeline";
import { getExperiencePage } from "@/api/experiences";
import TechnicalSkills from "@/components/technical-skills/TechnicalSkills";
import Card from "@/components/experience/Card";

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

        

        {/* Experience Cards Section - Hidden since we're using Timeline now */}
        {/* <div className="space-y-6">
          {pageData.experiences.length > 0 ? (
            pageData.experiences
              .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()) // Sort by newest first
              .map((experience, index) => {
                // Color assignment logic from Timeline component
                const allColors = [
                  '#FF6B35', '#17A2B8', '#DC3545', '#28A745', '#6F42C1',
                  '#20C997', '#E83E8C', '#FFC107', '#6C757D',
                  '#6610f2', '#d63384', '#198754', '#0dcaf0', '#adb5bd'
                ];
                const color = allColors[index % allColors.length];

                return (
                  <Card
                    key={`${experience.type}-${experience.title || experience.school}-${experience.startDate}`}
                    item={experience}
                    color={color}
                    className="max-w-4xl mx-auto"
                  />
                );
              })
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No experience data available</p>
            </div>
          )}
        </div> */}



        {/* Technical Skills Section - only render if we have skill categories */}
        {pageData.skillCategories && pageData.skillCategories.length > 0 && (
          <TechnicalSkills skillCategories={pageData.skillCategories} />
        )}
      </div>
    </div>
  );
}
