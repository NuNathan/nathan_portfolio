import { strapiGet } from '@/utils/api-client';
import { transformImageUrl } from './strapi';

export async function getAboutMe() {
  try {
    const response = await strapiGet('/about-me?populate=*');

    // Transform image URLs to use STRAPI_MEDIA_URL
    const data = response.data;
    if (data.data) {
      // Handle headshot image
      if (data.data.headshot && typeof data.data.headshot === 'object' && data.data.headshot.url) {
        data.data.headshot.url = transformImageUrl(data.data.headshot.url);
      }

      // Handle resume file
      if (data.data.resume && typeof data.data.resume === 'object' && data.data.resume.url) {
        data.data.resume.url = transformImageUrl(data.data.resume.url);
      }
    }

    return data;
  } catch (error) {
    console.error('Error fetching about-me:', error);
    return { data: null, meta: {} };
  }
}