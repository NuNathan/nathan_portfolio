'use client';

import { useState } from 'react';
import ApiErrorPage from '@/components/error/ApiErrorPage';
import ErrorBoundary from '@/components/error/ErrorBoundary';

export default function TestErrorPage() {
  const [showApiError, setShowApiError] = useState(false);
  const [throwError, setThrowError] = useState(false);

  if (showApiError) {
    return (
      <ApiErrorPage
        title="Test API Error"
        message="This is a test of the API error page component with background health checking."
        showRetry={true}
        showHome={true}
      />
    );
  }

  if (throwError) {
    throw new Error('This is a test error to demonstrate the error boundary');
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Error Handling Test Page
          </h1>
          
          <p className="text-gray-600 mb-8">
            Use the buttons below to test different error scenarios:
          </p>

          <div className="space-y-4">
            <button
              onClick={() => setShowApiError(true)}
              className="w-full bg-yellow-600 text-white px-6 py-3 rounded-md font-medium hover:bg-yellow-700 transition-colors"
            >
              Test API Error Page
            </button>

            <button
              onClick={() => setThrowError(true)}
              className="w-full bg-red-600 text-white px-6 py-3 rounded-md font-medium hover:bg-red-700 transition-colors"
            >
              Test Error Boundary
            </button>

            <button
              onClick={() => window.location.href = '/non-existent-page'}
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700 transition-colors"
            >
              Test 404 Page
            </button>

            <button
              onClick={() => window.location.href = '/'}
              className="w-full bg-gray-200 text-gray-900 px-6 py-3 rounded-md font-medium hover:bg-gray-300 transition-colors"
            >
              Back to Home
            </button>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              This page is for testing error handling components.
            </p>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}
