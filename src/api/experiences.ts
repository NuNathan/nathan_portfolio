import axios from 'axios';

const STRAPI_URL = process.env.STRAPI_API_URL;
const STRAPI_TOKEN = process.env.STRAPI_TOKEN;

type ExperienceItem = {
  id: number;
  type: 'job' | 'school';
  startDate: string;
  endDate: string | null;
  current: boolean;
  description: string;
  content: Array<{
    __component: 'experience.job' | 'experience.school';
    id: number;
    title?: string;
    company?: string;
    location?: string;
    school?: string;
    degree?: string;
    gpa?: number;
  }>;
};

type SkillCategory = {
  id: number;
  documentId: string;
  category: string;
  Icon: string;
  color: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
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
};

type ExperiencePageResponse = {
  data: {
    id: number;
    documentId: string;
    subHeader: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    experiences: ExperienceItem[];
    skill_categories: SkillCategory[];
  };
  meta: {};
};

export async function getExperiencePage() {
  try {
    const response = await axios.get(`${STRAPI_URL}/experience-page?populate[experiences][populate]=content&populate[skill_categories][populate]=skills`, {
      headers: {
        Authorization: `Bearer ${STRAPI_TOKEN}`,
      },
    });

    const data: ExperiencePageResponse = response.data;

    if (data?.data) {
      // Transform experiences for Timeline component
      const transformedExperiences = data.data.experiences?.map((item: ExperienceItem) => {
        // Extract content from the nested content array
        const content = item.content?.[0];

        return {
          type: item.type,
          startDate: item.startDate,
          endDate: item.endDate,
          current: item.current,
          description: item.description,
          // Job-specific fields
          title: content?.title,
          company: content?.company,
          location: content?.location,
          // School-specific fields
          school: content?.school,
          degree: content?.degree,
          gpa: content?.gpa?.toString(),
        };
      }) || [];

      // Transform skill categories for TechnicalSkills component
      const transformedSkillCategories = data.data.skill_categories?.map((category: SkillCategory) => ({
        category: category.category,
        icon: category.Icon,
        color: category.color,
        skills: category.skills || [],
      })) || [];

      return {
        subHeader: data.data.subHeader,
        experiences: transformedExperiences,
        skillCategories: transformedSkillCategories,
      };
    }

    return {
      subHeader: "My professional journey through software development and education",
      experiences: [],
      skillCategories: [],
    };
  } catch (error) {
    console.error('Error fetching experience page:', error);
    return {
      subHeader: "My professional journey through software development and education",
      experiences: [],
      skillCategories: [],
    };
  }
}

