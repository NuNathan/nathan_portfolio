'use client';

import { useEffect } from 'react';

interface BlogDetailClientProps {
  slug: string;
}

// Global set to track which posts are currently being incremented
const incrementingPosts = new Set<string>();

export default function BlogDetailClient({ slug }: BlogDetailClientProps) {
  useEffect(() => {
    // Check if we've already incremented the view for this post in this browser
    const storageKey = `view-incremented-${slug}`;
    const hasViewed = typeof window !== 'undefined' && localStorage.getItem(storageKey);

    if (hasViewed) {
      return;
    }

    // Check if this post is currently being incremented by another instance
    if (incrementingPosts.has(slug)) {
      return;
    }

    // Mark this post as being incremented
    incrementingPosts.add(slug);

    // Function to increment view count
    const incrementView = async () => {
      try {
        const apiUrl = `/api/posts/${slug}/increment-view`;

        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          // Mark this post as viewed in this browser
          if (typeof window !== 'undefined') {
            localStorage.setItem(storageKey, 'true');
          }
        }
      } catch (error) {
        // Silently handle errors
        console.error('Error incrementing view count:', error);
      } finally {
        // Always remove from the incrementing set when done
        incrementingPosts.delete(slug);
      }
    };

    // Call the increment view API when component mounts
    incrementView();
  }, [slug]);

  // This component doesn't render anything visible
  return null;
}
