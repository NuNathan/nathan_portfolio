/**
 * Utility functions for consistent date formatting between server and client
 */

/**
 * Format a date string consistently for both server and client rendering
 * Uses UTC to avoid timezone differences that cause hydration mismatches
 */
export function formatDateConsistently(dateString: string | undefined): string | undefined {
  if (!dateString) return undefined;

  try {
    const date = new Date(dateString);

    // Use UTC methods to ensure consistent formatting across server/client
    const year = date.getUTCFullYear();
    const month = date.getUTCMonth();
    const day = date.getUTCDate();

    // Month names for consistent formatting
    const monthNames = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    return `${monthNames[month]} ${day}, ${year}`;
  } catch (error) {
    console.error('Error formatting date:', error);
    return undefined;
  }
}

/**
 * Format a date string for timeline display (e.g., "Jan 2023")
 * Handles YYYY-MM format specifically and uses consistent formatting
 */
export function formatTimelineDate(dateString: string): string {
  if (!dateString) return 'Invalid Date';

  // Month names for consistent formatting
  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  try {
    // Handle YYYY-MM format specifically
    if (dateString.match(/^\d{4}-\d{2}$/)) {
      const [year, month] = dateString.split('-');
      const monthIndex = parseInt(month) - 1; // Month is 0-based

      if (monthIndex >= 0 && monthIndex < 12) {
        return `${monthNames[monthIndex]} ${year}`;
      }
    }

    // Handle other date formats
    const date = new Date(dateString);

    // Check if date is valid
    if (isNaN(date.getTime())) {
      return 'Invalid Date';
    }

    // Use UTC methods to ensure consistent formatting
    const year = date.getUTCFullYear();
    const month = date.getUTCMonth();

    return `${monthNames[month]} ${year}`;
  } catch (error) {
    console.error('Error formatting timeline date:', error);
    return 'Invalid Date';
  }
}
