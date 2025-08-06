import { formatTimelineDate } from '@/utils/dateUtils';
import "./timeline.css";

interface TimelineProps {
  data: {
    experiences: Array<{
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
    }>;
  };
}

export default function Timeline({ data }: TimelineProps) {
  // Handle undefined or null data gracefully
  if (!data || !data.experiences || !Array.isArray(data.experiences)) {
    return (
      <div className="relative max-w-6xl mx-auto">
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No experience data available</p>
        </div>
      </div>
    );
  }

  // Sort all experiences by start date (newest first for vertical stacking)
  const allItems = data.experiences
    .filter(item => item && item.startDate) // Filter out invalid items
    .map(item => ({
      ...item,
      sortDate: new Date(item.startDate).getTime()
    }))
    .sort((a, b) => b.sortDate - a.sortDate); // Sort newest first

  // If no valid items after filtering, show empty state
  if (allItems.length === 0) {
    return (
      <div className="relative max-w-6xl mx-auto">
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No valid experience data found</p>
        </div>
      </div>
    );
  }

  // Use consistent date formatting to avoid hydration mismatches
  const formatDate = formatTimelineDate;

  // Format date range for display
  const formatDateRange = (startDate: string, endDate: string | null) => {
    const start = formatDate(startDate);
    const end = endDate ? formatDate(endDate) : 'Present';
    return `${start} - ${end}`;
  };

  // Get start month name from date string
  const getStartMonthName = (dateString: string) => {
    if (!dateString) return 'Unknown';

    // Handle YYYY-MM format specifically
    if (dateString.match(/^\d{4}-\d{2}$/)) {
      const [year, month] = dateString.split('-');
      const date = new Date(parseInt(year), parseInt(month) - 1, 1);

      if (isNaN(date.getTime())) {
        return 'Unknown';
      }

      return date.toLocaleDateString('en-US', { month: 'short' });
    }

    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return 'Unknown';
    }

    return date.toLocaleDateString('en-US', { month: 'short' });
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

  // Color assignment logic
  const allColors = [
    '#FF6B35', '#17A2B8', '#DC3545', '#28A745', '#6F42C1',
    '#20C997', '#E83E8C', '#FFC107', '#6C757D',
    '#6610f2', '#d63384', '#198754', '#0dcaf0', '#adb5bd'
  ];

  // Group items by year for year markers
  const itemsByYear = allItems.reduce((acc, item) => {
    const year = new Date(item.startDate).getFullYear();
    if (!acc[year]) {
      acc[year] = [];
    }
    acc[year].push(item);
    return acc;
  }, {} as Record<number, typeof allItems>);

  const years = Object.keys(itemsByYear).map(Number).sort((a, b) => b - a); // Sort years newest first

  // Calculate the previous year for the bottom year tag
  const oldestYear = years.length > 0 ? Math.min(...years) : new Date().getFullYear();
  const previousYear = oldestYear - 1;

  return (
    <div className="relative max-w-6xl mx-auto mb-16">
      {/* Main vertical timeline line - positioned at 200px from left on desktop, 30px on mobile */}
      <div className="absolute left-[30px] md:left-[200px] top-0 bottom-0 w-1 md:w-2 bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500 rounded-full"></div>

      {/* Timeline items grouped by year */}
      <div className="space-y-8">
        {years.map((year) => (
          <div key={year} className="relative">
            {/* Year marker */}
            <div className="relative flex items-center mb-8">
              <div className="absolute left-[30px] md:left-[200px] transform -translate-x-1/2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-2 md:px-6 md:py-3 rounded-full font-bold text-sm md:text-lg shadow-lg z-20">
                {year === new Date().getFullYear() ? 'Present' : year}
              </div>
            </div>

            {/* Items for this year */}
            <div className="space-y-6">
              {itemsByYear[year].map((item) => {
                const globalIndex = allItems.findIndex(globalItem => 
                  globalItem.startDate === item.startDate && 
                  globalItem.title === item.title && 
                  globalItem.company === item.company &&
                  globalItem.school === item.school
                );
                const color = allColors[globalIndex % allColors.length];
                const monthName = getStartMonthName(item.startDate);

                return (
                  <div key={`${item.type}-${item.title || item.school}-${item.startDate}`} className="relative flex items-center">
                    {/* Month dot centered on card */}
                    <div
                      className="absolute left-[32px] md:left-[204px] w-2 h-2 md:w-3 md:h-3 bg-white border-2 rounded-full z-10 -ml-1 md:-ml-1.5 mobile-offset"
                      style={{ borderColor: color }}
                    >{/**, marginLeft: '-2px'  */}
                      {/* <div className="absolute inset-0.5 rounded-full" style={{ backgroundColor: color }}></div> */}
                    </div>

                    {/* Month label */}
                    <div className="absolute left-0 w-[20px] md:w-[190px] text-right text-xs md:text-sm text-gray-500 font-medium pr-1 md:pr-2">
                      {monthName}
                    </div>

                    {/* Desktop Card */}
                    <div className="hidden md:block ml-[300px] w-full max-w-2xl">
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
                    <div className="md:hidden ml-[80px] w-full max-w-sm">
                      <div
                        className="bg-white rounded-lg p-3 shadow-md hover:shadow-lg transition-all duration-300 border-l-3"
                        style={{ borderLeftColor: color }}
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

                        <p className="text-gray-600 text-xs leading-relaxed">{item.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {/* Bottom year tag for visual uniformity */}
        <div className="relative">
          <div className="relative flex items-center mb-8">
            <div className="absolute left-[30px] md:left-[200px] transform -translate-x-1/2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-2 md:px-6 md:py-3 rounded-full font-bold text-sm md:text-lg shadow-lg z-20">
              {previousYear}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
