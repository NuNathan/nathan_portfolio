'use client';

import { useEffect } from 'react';

export default function GlobalErrorHandler() {
  useEffect(() => {
    // Only run in browser
    if (typeof window === 'undefined') return;

    // Global error handler for unhandled JavaScript errors
    const handleError = (event: ErrorEvent) => {
      // Log error in development only
      if (process.env.NODE_ENV === 'development') {
        console.error('Global JavaScript error:', {
          message: event.message,
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
          error: event.error
        });
      }
      
      // Prevent the error from breaking the page for users
      event.preventDefault();
      return true;
    };

    // Global handler for unhandled promise rejections
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      // Log error in development only
      if (process.env.NODE_ENV === 'development') {
        console.error('Unhandled promise rejection:', event.reason);
      }
      
      // Prevent the error from breaking the page for users
      event.preventDefault();
    };

    // Add event listeners
    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    // Cleanup
    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  // This component doesn't render anything
  return null;
}
