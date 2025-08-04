import { strapiGet } from '@/utils/api-client';
import { transformImageUrl } from './strapi';
import { analyzeError, isApiDownError } from '@/utils/error-handling';

export interface SkillTag {
  id: number;
  skill: string;
  skillLevel: number;
  mainColour: string;
}

export interface Resume {
  id: number;
  documentId: string;
  name: string;
  alternativeText: string;
  caption: string;
  size: number;
  url: string;
  previewUrl: string | null;
}

export interface HomePageData {
  id: number;
  documentId: string;
  header: string;
  subHeader: string;
  resume: Resume;
  skillTags: SkillTag[];
}

export interface HomePageResponse {
  data: HomePageData;
  meta: unknown;
}

export async function getHomePage(): Promise<HomePageResponse> {
  try {
    const response = await strapiGet('/home-page?populate=*');

    // Transform the response to include full URLs for file assets
    const data = response.data;
    if (data.data?.resume?.url) {
      data.data.resume.url = transformImageUrl(data.data.resume.url);
    }

    return data;
  } catch (error) {
    const analyzedError = analyzeError(error);
    console.error(`Home page API error (${analyzedError.type}):`, analyzedError.message);

    // If this looks like the API is down, we'll let the page component handle it
    if (isApiDownError(error)) {
      console.warn('API appears to be down, returning fallback data with indicator');
    }
    // Return fallback data if API fails
    return {
      data: {
        id: 1,
        documentId: "fallback",
        header: "Welcome to<br />Nathan's Portfolio",
        subHeader: "Computer Science Student crafting digital experiences<br />with passion and precision",
        resume: {
          id: 1,
          documentId: "fallback-resume",
          name: "Resume.pdf",
          alternativeText: "Resume",
          caption: "Resume",
          size: 0,
          url: "https://positive-life-875d223e2a.media.strapiapp.com/Master_Resume_website_66f649901d.pdf",
          previewUrl: null,
        },
        skillTags: [
          {
            id: 1,
            skill: "React",
            skillLevel: 120,
            mainColour: "#61dafb",
          },
          {
            id: 2,
            skill: "Vue",
            skillLevel: 90,
            mainColour: "#4fc08d",
          },
        ],
      },
      meta: {},
    };
  }
}
