import SkillTag from "@/components/ui/SkillTag";

interface SkillData {
  id: number;
  documentId: string;
  skill: string;
  mainColour: string;
  skillLevel: number;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

interface SkillCategory {
  category: string;
  icon: string;
  color: string;
  skills: SkillData[];
}

interface TechnicalSkillsProps {
  skillCategories?: SkillCategory[];
}

export default function TechnicalSkills({ skillCategories }: TechnicalSkillsProps) {
  // If no skillCategories provided or empty, don't render the component
  if (!skillCategories || skillCategories.length === 0) {
    return null;
  }

  return (
    <div className="mt-20">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Technical Skills</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Technologies and tools I work with regularly
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {skillCategories.map((skillCategory, index) => (
          <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl mb-6 mx-auto"
              style={{
                background: skillCategory.color
              }}
            >
              {skillCategory.icon}
            </div>

            <h3 className="text-xl font-bold text-gray-900 text-center mb-6">{skillCategory.category}</h3>

            <div className="flex flex-wrap gap-2 justify-center">
              {skillCategory.skills.map((skill) => (
                <SkillTag
                  key={skill.id}
                  text={skill.skill}
                  mainColour={skill.mainColour}
                  variant="default"
                  size="sm"
                  darkText={true}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
