import Timeline from "@/components/timeline/Timeline";
import { getExperiences } from "@/api/experiences";
// import experienceData from "@/data/experience.json";

export default async function Experience() {

  let experienceData = {experiences: []};

  // We wrap only the data fetch, not the component render
  try {
    experienceData = await getExperiences();
  } catch (error) {
    console.error("Failed to fetch experience data:", error);
    // Leave experienceData as default object with empty experiences array
  }

  return (
    <div className="min-h-screen bg-[#f6f9fc] px-4 sm:px-6 py-8 sm:py-12 mb-24">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12 sm:mb-16">
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto px-4">
            My professional journey through software development and education
          </p>
        </div>

        {/* Timeline Section */}
        <Timeline data={experienceData} />

        {/* Technical Skills Section TODO*/}
        {/* <TechnicalSkills /> */}
      </div>
    </div>
  );
}
