'use client';

import { useEffect } from 'react';

interface BlogDetailClientProps {
  slug: string;
}

export default function BlogDetailClient({ slug }: BlogDetailClientProps) {
  useEffect(() => {
    // Function to increment view count
    const incrementView = async () => {
      try {
        const response = await fetch(`http://localhost:1337/api/posts/${slug}/increment-view`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          console.warn(`Failed to increment view for post ${slug}:`, response.status);
        }
      } catch (error) {
        console.warn(`Error incrementing view for post ${slug}:`, error);
      }
    };

    // Call the increment view API when component mounts
    incrementView();
  }, [slug]);

  // This component doesn't render anything visible
  return null;
}
