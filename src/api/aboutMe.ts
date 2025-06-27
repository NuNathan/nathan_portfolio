import axios from 'axios';

const STRAPI_URL = process.env.STRAPI_API_URL;
const STRAPI_TOKEN = process.env.STRAPI_TOKEN;
const STRAPI_MEDIA_URL = process.env.STRAPI_MEDIA_URL;

export async function getAboutMe() {
  try {
    const response = await axios.get(`${STRAPI_URL}/about-me?populate=*`, {
      headers: {
        Authorization: `Bearer ${STRAPI_TOKEN}`,
      },
    });

    // Transform image URLs to use STRAPI_MEDIA_URL
    const data = response.data;
    if (data.data) {
      // Handle headshot image
      if (data.data.headshot && typeof data.data.headshot === 'object' && data.data.headshot.url) {
        const headshotUrl = data.data.headshot.url;
        data.data.headshot.url = headshotUrl.startsWith('http') ? headshotUrl : `${STRAPI_MEDIA_URL}${headshotUrl}`;
      }

      // Handle resume file
      if (data.data.resume && typeof data.data.resume === 'object' && data.data.resume.url) {
        const resumeUrl = data.data.resume.url;
        data.data.resume.url = resumeUrl.startsWith('http') ? resumeUrl : `${STRAPI_MEDIA_URL}${resumeUrl}`;
      }
    }

    return data;
  } catch (error) {
    console.error('Error fetching about-me:', error);
    return { data: null, meta: {} };
  }
}