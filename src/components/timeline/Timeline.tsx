import TimelineCard from './TimelineCard';

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

  // Sort all experiences by start date (oldest first for timeline)
  const allItems = data.experiences
    .filter(item => item && item.startDate) // Filter out invalid items
    .map(item => ({
      ...item,
      sortDate: new Date(item.startDate).getTime()
    }))
    .sort((a, b) => a.sortDate - b.sortDate);

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

  // Find the earliest start date to determine timeline start
  const earliestDate = allItems.length > 0 ? new Date(allItems[0].startDate) : new Date('2020-09-01');
  const startYear = earliestDate.getFullYear();
  const startMonth = earliestDate.getMonth() + 1;

  // Timeline goes to current date (June 2025)
  const endYear = 2025;
  const currentMonth = 6; // June 2025

  const timelineMonths: Array<{
    year: number;
    month: number;
    monthName: string;
    date: Date;
    isCurrentMonth: boolean;
  }> = [];

  // Generate timeline from earliest start date to current
  for (let year = startYear; year <= endYear; year++) {
    const startMonthForYear = year === startYear ? startMonth : 1;
    const endMonthForYear = year === endYear ? currentMonth : 12;

    for (let month = startMonthForYear; month <= endMonthForYear; month++) {
      const date = new Date(year, month - 1, 1);
      timelineMonths.push({
        year,
        month,
        monthName: date.toLocaleDateString('en-US', { month: 'short' }),
        date,
        isCurrentMonth: year === endYear && month === currentMonth
      });
    }
  }

  // Keep chronological order (oldest at bottom, newest at top)
  timelineMonths.reverse();

  // Pre-calculate all card positions to ensure consistent collision detection
  const placedCards: { item: any; top: number; left: number }[] = [];

  // Helper function to calculate bar dimensions (same logic as in TimelineCard)
  const calculateBarDimensions = (item: any) => {
    if (!item || !item.startDate) {
      return { height: 0, top: 0, startIndex: -1, endIndex: -1 };
    }

    const now = new Date();
    // Parse dates properly - handle YYYY-MM format
    const parseDate = (dateStr: string) => {
      if (dateStr.match(/^\d{4}-\d{2}$/)) {
        const [year, month] = dateStr.split('-');
        return new Date(parseInt(year), parseInt(month) - 1, 1);
      }
      return new Date(dateStr);
    };

    const startDate = parseDate(item.startDate);
    const endDate = item.endDate ? parseDate(item.endDate) : now;
    const isCurrentItem = item.current || !item.endDate;

    // Find corresponding month indices in the reversed timeline list
    const startIndex = timelineMonths.findIndex(tm =>
      tm.year === startDate.getFullYear() && tm.month === startDate.getMonth() + 1
    );
    const endIndex = timelineMonths.findIndex(tm =>
      tm.year === endDate.getFullYear() && tm.month === endDate.getMonth() + 1
    );

    if (startIndex === -1 || endIndex === -1) {
      return { height: 0, top: 0, startIndex: -1, endIndex: -1 };
    }

    const height = isCurrentItem ? 120 : 165;
    const topOffset = isCurrentItem ? -20 : -50;

    return { height, top: topOffset, startIndex, endIndex };
  };

  // Helper function to calculate card position
  const getCardPosition = (
    item: any,
    placedCards: { item: any; top: number; left: number }[]
  ) => {
    if (!item || !item.startDate) {
      return { horizontalOffset: 0, verticalOffset: 0 };
    }

    const itemStart = new Date(item.startDate + "-01");
    const cardWidth = 320;
    const spacing = 16;

    // Calculate the bar dimensions to position card at the top of the bar
    const barDimensions = calculateBarDimensions(item);
    // Position card at the top of its associated bar, with a small offset for better visibility
    const verticalOffset = barDimensions.top - 60; // 60px above the bar top

    let horizontalOffset = 0;

    const isCardNearby = (aStart: Date, bStart: Date) => {
      const monthsApart =
        Math.abs(aStart.getFullYear() * 12 + aStart.getMonth() - (bStart.getFullYear() * 12 + bStart.getMonth()));
      return monthsApart <= 3;
    };

    while (true) {
      const overlapping = placedCards.some(({ item: other, left }) => {
        const otherStart = new Date(other.startDate + "-01");
        const timeConflict = isCardNearby(itemStart, otherStart);
        const spaceConflict = Math.abs(left - horizontalOffset) < cardWidth;
        return timeConflict && spaceConflict;
      });

      if (!overlapping) break;
      horizontalOffset += cardWidth + spacing;
    }

    return { horizontalOffset, verticalOffset };
  };

  // Pre-calculate positions for all items that will have cards
  // Process items in chronological order (oldest first) to ensure consistent positioning
  const itemsWithCards = allItems.filter(item => {
    // Find items that start in any month (items that will have cards rendered)
    return timelineMonths.some(tm => {
      const [yearStr, monthStr] = item.startDate.split("-");
      const year = parseInt(yearStr);
      const month = parseInt(monthStr);
      return year === tm.year && month === tm.month;
    });
  });

  // Sort by start date to ensure consistent processing order
  itemsWithCards.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

  // Calculate positions for all cards
  itemsWithCards.forEach(item => {
    const cardPosition = getCardPosition(item, placedCards);
    placedCards.push({
      item,
      top: cardPosition.verticalOffset,
      left: cardPosition.horizontalOffset,
    });
  });

  

  return (
    <div className="relative max-w-6xl mx-auto">
      {/* Main vertical timeline line - positioned at 200px from left on desktop, 30px on mobile */}
      <div className="absolute left-[30px] md:left-[196px] top-0 bottom-0 w-1 md:w-2 bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500 rounded-full"></div>

      {/* Timeline months */}
      <div className="space-y-2 md:space-y-4">
        {timelineMonths.map((timelineMonth, index) => {
          // Show year marker at the start of each year, or for the current month, or at the very bottom if it's not January
          const isYearStart = timelineMonth.month === 1 || (timelineMonth.year === 2025 && timelineMonth.month === 6);
          const isLastMonth = index === timelineMonths.length - 1;
          const shouldShowYearMarker = isYearStart || (isLastMonth && timelineMonth.month !== 1);

          return (
            <div key={`${timelineMonth.year}-${timelineMonth.month}`} className="relative flex items-center min-h-[48px] md:min-h-[64px]">
              {/* Month marker - centered on timeline */}
              <div className="absolute left-[30px] md:left-[200px] transform -translate-x-1/2 w-2 h-2 md:w-3 md:h-3 bg-white border-2 border-blue-500 rounded-full z-10"></div>

              {/* Year label */}
              {shouldShowYearMarker && (
                <div className={`absolute left-[30px] md:left-[200px] transform -translate-x-1/2 ${timelineMonth.isCurrentMonth ? '-translate-y-30/30' : 'translate-y-20/30'} bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-2 md:px-6 md:py-3 rounded-full font-bold text-sm md:text-lg shadow-lg z-20`}>
                  {timelineMonth.isCurrentMonth ? 'Present' : timelineMonth.year}
                </div>
              )}

              {/* Month label - positioned to connect with timeline */}
              <div className="absolute left-0 w-[20px] md:w-[190px] text-right text-xs md:text-sm text-gray-500 font-medium pr-1 md:pr-2">
                {timelineMonth.monthName}
              </div>

              {/* Job/Education items for this month */}
              <TimelineCard
                timelineMonth={timelineMonth}
                allItems={allItems}
                timelineMonths={timelineMonths}
                placedCards={placedCards}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
