import axios from 'axios';

const STRAPI_URL = process.env.STRAPI_API_URL;
const STRAPI_TOKEN = process.env.STRAPI_TOKEN;

export async function getAboutMe() {
  try {
    const response = await axios.get(`${STRAPI_URL}/about-me?populate=*`, {
      headers: {
        Authorization: `Bearer ${STRAPI_TOKEN}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching about-me:', error);
    return { data: null, meta: {} };
  }
}