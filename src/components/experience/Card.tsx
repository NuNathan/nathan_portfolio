interface CardProps {
  item: {
    type: 'job' | 'school';
    title?: string;
    company?: string;
    location?: string;
    school?: string;
    degree?: string;
    gpa?: string;
    startDate: string;
    endDate: string | null;
    current: boolean;
    description: string;
  };
  color: string;
  className?: string;
}

export default function Card({ item, color, className = '' }: CardProps) {
  // Format date for display (e.g., "Jan 2023")
  const formatDate = (dateString: string) => {
    if (!dateString) return 'Invalid Date';

    // Handle YYYY-MM format specifically
    if (dateString.match(/^\d{4}-\d{2}$/)) {
      const [year, month] = dateString.split('-');
      const date = new Date(parseInt(year), parseInt(month) - 1, 1); // Month is 0-based in Date constructor

      // Check if date is valid
      if (isNaN(date.getTime())) {
        return 'Invalid Date';
      }

      return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    }

    // Handle other date formats
    const date = new Date(dateString);

    // Check if date is valid
    if (isNaN(date.getTime())) {
      return 'Invalid Date';
    }

    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  // Format date range for display
  const formatDateRange = (startDate: string, endDate: string | null) => {
    const start = formatDate(startDate);
    const end = endDate ? formatDate(endDate) : 'Present';
    return `${start} - ${end}`;
  };

  // Determine the badge color based on work location
  const getLocationBadgeColor = (location: string) => {
    switch (location) {
      case 'Remote':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Hybrid':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'On-site':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <>
      {/* Desktop Card */}
      <div className={`hidden md:block ${className}`}>
        <div
          className="bg-white rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 border-l-4"
          style={{ borderLeftColor: color }}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
              <span className="text-xs font-bold uppercase tracking-wide text-gray-500">
                {item.type === 'school' ? 'Education' : 'Work'}
              </span>
            </div>
            <span className="text-xs text-gray-500 font-medium">
              {formatDateRange(item.startDate, item.endDate)}
            </span>
          </div>

          {item.type === 'school' ? (
            <>
              <h3 className="text-base font-bold text-gray-900 mb-1">{item.school}</h3>
              <p className="text-sm text-gray-700 mb-2">{item.degree}</p>
              <div className="flex items-center space-x-2 mb-2">
                <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-medium border border-purple-200">
                  GPA: {item.gpa}
                </span>
                {item.current && (
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium border border-green-200">
                    Current
                  </span>
                )}
              </div>
            </>
          ) : (
            <>
              <h3 className="text-base font-bold text-gray-900 mb-1">{item.title}</h3>
              <p className="text-sm text-gray-700 mb-2">{item.company}</p>
              <div className="flex items-center space-x-2 mb-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getLocationBadgeColor(item.location || '')}`}>
                  {item.location}
                </span>
                {item.current && (
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium border border-green-200">
                    Current
                  </span>
                )}
              </div>
            </>
          )}

          <p className="text-gray-600 text-xs leading-relaxed">{item.description}</p>
        </div>
      </div>

      {/* Mobile Card */}
      <div className={`md:hidden ${className}`}>
        <div
          className="bg-white rounded-lg p-3 shadow-md hover:shadow-lg transition-all duration-300 border-l-3"
          style={{ borderLeftColor: color, width: 'fit-content' }}
        >
          <div className="flex flex-col gap-1 mb-2">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
              <span className="text-xs font-bold uppercase tracking-wide text-gray-500">
                {item.type === 'school' ? 'Education' : 'Work'}
              </span>
            </div>
            <span className="text-xs text-gray-500 font-medium">
              {formatDateRange(item.startDate, item.endDate)}
            </span>
          </div>

          {item.type === 'school' ? (
            <>
              <h3 className="text-sm font-bold text-gray-900 mb-1 leading-tight">{item.school}</h3>
              <p className="text-xs text-gray-700 mb-2 leading-tight">{item.degree}</p>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-medium border border-purple-200">
                  GPA: {item.gpa}
                </span>
                {item.current && (
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium border border-green-200">
                    Current
                  </span>
                )}
              </div>
            </>
          ) : (
            <>
              <h3 className="text-sm font-bold text-gray-900 mb-1 leading-tight">{item.title}</h3>
              <p className="text-xs text-gray-700 mb-2 leading-tight">{item.company}</p>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getLocationBadgeColor(item.location || '')}`}>
                  {item.location}
                </span>
                {item.current && (
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium border border-green-200">
                    Current
                  </span>
                )}
              </div>
            </>
          )}

          <p className="text-gray-600 text-xs leading-relaxed max-w-[240px]">{item.description}</p>
        </div>
      </div>
    </>
  );
}