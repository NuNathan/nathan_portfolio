'use client';

import { useEffect } from 'react';
import ApiErrorPage from '@/components/error/ApiErrorPage';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Global error boundary caught:', error);
  }, [error]);

  // Check if this looks like an API-related error
  const isApiError = error.message.includes('fetch') || 
                     error.message.includes('network') || 
                     error.message.includes('ECONNREFUSED') ||
                     error.message.includes('timeout') ||
                     error.message.includes('STRAPI');

  if (isApiError) {
    return (
      <ApiErrorPage 
        title="Connection Error"
        message="We're having trouble connecting to our services. This might be a temporary issue."
        showRetry={true}
        showHome={true}
      />
    );
  }

  // For other types of errors, show a generic error page
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-lg w-full bg-white shadow-lg rounded-lg p-8 text-center">
        <div className="mb-6">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100">
            <svg
              className="h-8 w-8 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Something went wrong
        </h1>

        <p className="text-gray-600 mb-8 leading-relaxed">
          An unexpected error occurred. Please try again or return to the homepage.
        </p>

        {process.env.NODE_ENV === 'development' && (
          <details className="text-left mb-6 p-4 bg-gray-50 rounded-lg">
            <summary className="cursor-pointer text-sm font-medium text-gray-700">
              Error details (development only)
            </summary>
            <pre className="mt-2 text-xs text-gray-600 whitespace-pre-wrap overflow-auto">
              {error.message}
              {error.stack && `\n\nStack trace:\n${error.stack}`}
            </pre>
          </details>
        )}

        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
          <button
            onClick={reset}
            className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Try Again
          </button>
          <button
            onClick={() => window.location.href = '/'}
            className="flex-1 bg-gray-200 text-gray-900 px-6 py-3 rounded-md font-medium hover:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
}
