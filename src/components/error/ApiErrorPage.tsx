'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface ApiErrorPageProps {
  title?: string;
  message?: string;
  showRetry?: boolean;
  showHome?: boolean;
}

export default function ApiErrorPage({
  title = "Service Temporarily Unavailable",
  message = "We're experiencing technical difficulties connecting to our services. Please try again in a few moments.",
  showRetry = true,
  showHome = true
}: ApiErrorPageProps) {
  const router = useRouter();
  const [attemptCount, setAttemptCount] = useState(1);
  const [isServiceDown, setIsServiceDown] = useState(false);

  const handleRetry = () => {
    window.location.reload();
  };

  const handleGoHome = () => {
    router.push('/');
  };

  // Background health check every 10 seconds with retry counter
  useEffect(() => {
    const checkStatus = async () => {
      try {
        const response = await fetch('/api/health-check', {
          method: 'GET',
          signal: AbortSignal.timeout(5000)
        });

        if (response.ok) {
          // Services are back online, reload the page
          window.location.reload();
        } else {
          // Failed attempt, increment counter
          setAttemptCount(prev => {
            const newCount = prev + 1;
            if (newCount > 3) {
              setIsServiceDown(true);
            }
            return newCount;
          });
        }
      } catch (error) {
        // Failed attempt, increment counter
        setAttemptCount(prev => {
          const newCount = prev + 1;
          if (newCount > 3) {
            setIsServiceDown(true);
          }
          return newCount;
        });
      }
    };

    // Check every 10 seconds
    const interval = setInterval(checkStatus, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-lg w-full bg-white shadow-lg rounded-lg p-8 text-center">
        {/* Icon */}
        <div className="mb-6">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-yellow-100">
            <svg
              className="h-8 w-8 text-yellow-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          {title}
        </h1>

        {/* Message */}
        <p className="text-gray-600 mb-8 leading-relaxed">
          {message}
        </p>

        {/* Status indicator */}
        <div className={`mb-8 p-4 rounded-lg border ${
          isServiceDown
            ? 'bg-red-50 border-red-200'
            : 'bg-yellow-50 border-yellow-200'
        }`}>
          {isServiceDown ? (
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <span className="text-base font-semibold text-red-700">
                  Strapi cloud is down
                </span>
              </div>
              <p className="text-sm text-red-600 font-normal">
                Please contact the system administrator
              </p>
            </div>
          ) : (
            <div className="flex items-center justify-center space-x-2">
              <div className="animate-pulse h-2 w-2 bg-yellow-500 rounded-full"></div>
              <span className="text-sm text-yellow-700">
                {`Checking service status (${Math.min(attemptCount, 3)}/3)...`}
              </span>
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
          {showRetry && (
            <button
              onClick={handleRetry}
              className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Try Again
            </button>
          )}
          {showHome && (
            <button
              onClick={handleGoHome}
              className="flex-1 bg-gray-200 text-gray-900 px-6 py-3 rounded-md font-medium hover:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Go to Homepage
            </button>
          )}
        </div>

        {/* Additional info */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            If this problem persists, please contact support or try again later.
          </p>
        </div>
      </div>
    </div>
  );
}
