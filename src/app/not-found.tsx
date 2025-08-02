import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-lg w-full bg-white shadow-lg rounded-lg p-8 text-center">
        {/* 404 Icon */}
        <div className="mb-6">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100">
            <svg
              className="h-8 w-8 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33"
              />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          404
        </h1>
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Page Not Found
        </h2>

        {/* Message */}
        <p className="text-gray-600 mb-8 leading-relaxed">
          The page you're looking for doesn't exist or has been moved. 
          Let's get you back on track.
        </p>

        {/* Navigation buttons */}
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
          <Link
            href="/"
            className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-center"
          >
            Go Home
          </Link>
          <Link
            href="/main/projects"
            className="flex-1 bg-gray-200 text-gray-900 px-6 py-3 rounded-md font-medium hover:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 text-center"
          >
            View Projects
          </Link>
        </div>

        {/* Additional navigation */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-4">
            Or explore other sections:
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/main/about-me"
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              About Me
            </Link>
            <Link
              href="/main/experience"
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Experience
            </Link>
            <Link
              href="/main/blog"
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Blog
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
