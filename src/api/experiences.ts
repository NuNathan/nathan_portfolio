import axios from 'axios';

const STRAPI_URL = process.env.STRAPI_API_URL;
const STRAPI_TOKEN = process.env.STRAPI_TOKEN;

export async function getExperiences() {
  try {
    const response = await axios.get(`${STRAPI_URL}/experiences?populate=*`, {
      headers: {
        Authorization: `Bearer ${STRAPI_TOKEN}`,
      },
    });

    // Transform the API data to match Timeline component expectations
    if (response.data?.data && Array.isArray(response.data.data)) {
      const transformedExperiences = response.data.data.map((item: any) => {
        // Extract content based on type
        const content = item.content?.[0] || {};

        // Base experience object
        const baseExperience = {
          type: item.type,
          startDate: item.startDate,
          endDate: item.endDate,
          current: item.current,
          description: item.description,
        };

        // Add type-specific fields
        if (item.type === 'job') {
          return {
            ...baseExperience,
            title: content.title,
            company: content.company,
            location: content.location,
          };
        } else if (item.type === 'school') {
          return {
            ...baseExperience,
            school: content.school,
            degree: content.degree,
            gpa: content.gpa?.toString(), // Convert to string as expected by Timeline
          };
        }

        return baseExperience;
      });

      return { experiences: transformedExperiences };
    }

    return { experiences: [] };
  } catch (error) {
    console.error('Error fetching experiences:', error);
    return { experiences: [] }; // Return consistent structure
  }
}