import axios from 'axios';

const STRAPI_PUBLIC_URL = process.env.STRAPI_URL;
const STRAPI_URL = process.env.STRAPI_API_URL;
const STRAPI_TOKEN = process.env.STRAPI_TOKEN;

export interface SkillTag {
  id: number;
  skill: string;
  skillLevel: number;
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
  meta: {};
}

export async function getHomePage(): Promise<HomePageResponse> {
  try {
    const response = await axios.get(`${STRAPI_URL}/home-page?populate=*`, {
      headers: {
        Authorization: `Bearer ${STRAPI_TOKEN}`,
      },
    });

    // Transform the response to include full URLs for file assets
    const data = response.data;
    if (data.data?.resume?.url && !data.data.resume.url.startsWith('http')) {
      data.data.resume.url = `${STRAPI_PUBLIC_URL}${data.data.resume.url}`;
    }

    return data;
  } catch (error) {
    console.error('Error fetching home-page:', error);
    // Return fallback data if API fails
    return {
      data: {
        id: 1,
        documentId: "fallback",
        header: "Welcome to<br />Nathan's Portfolio",
        subHeader: "Software Engineering Student crafting digital experiences<br />with passion and precision",
        resume: {
          id: 1,
          documentId: "fallback-resume",
          name: "Resume.pdf",
          alternativeText: "Resume",
          caption: "Resume",
          size: 0,
          url:  `${window.location.origin}/main/about-me`,
          previewUrl: null,
        },
        skillTags: [
          {
            id: 1,
            skill: "React",
            skillLevel: 120,
          },
          {
            id: 2,
            skill: "Vue",
            skillLevel: 90,
          },
        ],
      },
      meta: {},
    };
  }
}
