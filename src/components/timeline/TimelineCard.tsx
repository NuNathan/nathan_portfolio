import { formatTimelineDate } from '@/utils/dateUtils';

interface TimelineCardProps {
  timelineMonth: {
    year: number;
    month: number;
    monthName: string;
    date: Date;
    isCurrentMonth: boolean;
    
  };
  allItems: Array<{
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
    sortDate: number;
  }>;
  timelineMonths: Array<{
    year: number;
    month: number;
    monthName: string;
    date: Date;
    isCurrentMonth: boolean;
  }>;
  placedCards: { item: any; top: number; left: number }[];
}

const placedCardPositions: {
    start: Date;
    top: number;
    left: number;
  }[] = [];

export default function TimelineCard({ timelineMonth, allItems, timelineMonths, placedCards }: TimelineCardProps) {
  const now = new Date(); // Current date used for ongoing items

  // Use consistent date formatting to avoid hydration mismatches
  const formatDate = formatTimelineDate;

  // Format date range for display
  const formatDateRange = (startDate: string, endDate: string | null) => {
    const start = formatDate(startDate);
    const end = endDate ? formatDate(endDate) : 'Present';
    return `${start} - ${end}`;
  };

  

  

  // Find items that are active during this month (used for rendering vertical bars)
  const activeItems = allItems.filter(item => {
    if (!item.startDate) return false;

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

    // Check if this timeline month matches the item's date range
    // Item is active if it starts in this month OR if it started before and is still ongoing
    const itemStartYear = startDate.getFullYear();
    const itemStartMonth = startDate.getMonth() + 2; // Convert back to 1-based
    const itemEndYear = endDate.getFullYear();
    const itemEndMonth = endDate.getMonth() + 1; // Convert back to 1-based

    // Item starts in this exact month OR item started before this month and ends in/after this month
    const startsThisMonth = (itemStartYear === timelineMonth.year && itemStartMonth === timelineMonth.month);
    const continuesThisMonth = (
      (itemStartYear < timelineMonth.year || (itemStartYear === timelineMonth.year && itemStartMonth < timelineMonth.month)) &&
      (itemEndYear > timelineMonth.year || (itemEndYear === timelineMonth.year && itemEndMonth >= timelineMonth.month))
    );

    return startsThisMonth || continuesThisMonth;
  });

  // Find items that start in this month (used for rendering cards)
const itemsWithCardsThisMonth = activeItems.filter(item => {
  const [yearStr, monthStr] = item.startDate.split("-");
  const year = parseInt(yearStr);
  const month = parseInt(monthStr) + 1;
  return year === timelineMonth.year && month === timelineMonth.month;
});


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

  // Calculate height and vertical position of the timeline bar for an active item
  const calculateBarDimensions = (item: any) => {
    if (!item.startDate) return { height: 0, top: 0, startIndex: -1, endIndex: -1 };

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
    const isCurrentItem = item.current || !item.endDate; // Goes to present day

    // Find corresponding month indices in the reversed timeline list
    const startIndex = timelineMonths.findIndex(tm =>
      tm.year === startDate.getFullYear() && tm.month === startDate.getMonth() + 1
    );
    const endIndex = timelineMonths.findIndex(tm =>
      tm.year === endDate.getFullYear() && tm.month === endDate.getMonth() + 1
    );

    // If the item doesn't fall into the timeline range
    if (startIndex === -1 || endIndex === -1) {
      return { height: 0, top: 0, startIndex: -1, endIndex: -1 };
    }

    // Calculate duration in months for bar sizing
    const durationInMonths = Math.abs(endIndex - startIndex) + 1; // +1 because indices are inclusive

    // Make bars shorter for current/ongoing items, but ensure minimum height for single-month jobs
    let height = isCurrentItem ? 135 : 165;
    let topOffset = isCurrentItem ? -20 : -50;

    // For single-month jobs (non-current), ensure they have a visible bar
    if (durationInMonths === 1 && !isCurrentItem) {
      height = Math.max(height, 80); // Minimum height for single-month jobs
      topOffset = -30; // Adjust offset for better visibility
    }

    return { height, top: topOffset, startIndex, endIndex };
  };

  // Get pre-calculated position for an item from placedCards

  

  const getCardPosition = (item: any) => {
    const cardWidth = 320;
    const horizontalSpacing = 24;

    const placedCard = placedCards.find(pc =>
      pc.item.startDate === item.startDate &&
      pc.item.title === item.title &&
      pc.item.company === item.company &&
      pc.item.school === item.school
    );

    const start = new Date(item.startDate);

    const baseTop = placedCard?.top ?? -300;
    let left = placedCard?.left ?? 0;

    function areDatesWithinThreeMonths(date1: string | number | Date, date2: string | number | Date) {
      const d1 = new Date(date1);
      const d2 = new Date(date2);

      const year1 = d1.getFullYear();
      const month1 = d1.getMonth();

      const year2 = d2.getFullYear();
      const month2 = d2.getMonth();

      const monthsApart = Math.abs((year2 - year1) * 12 + (month2 - month1));
      return monthsApart <= 3;
    }

    for (let attempt = 0; attempt < 100; attempt++) {
      const isOverlapping = placedCardPositions.some(prev => {
        const within3Months = areDatesWithinThreeMonths(start, prev.start);
        const horizontallyClose = Math.abs(prev.left - left) < cardWidth + horizontalSpacing;
        const result = within3Months && horizontallyClose;
        return result;
      });

      if (!isOverlapping) break;
      left += cardWidth + horizontalSpacing;
    }

    placedCardPositions.push({ start, top: baseTop, left });

    return {
      horizontalOffset: left,
      verticalOffset: baseTop,
    };
  };








  const getSlotAndColorAssignments = (items: typeof allItems) => {
  const now = new Date();
  const allColors = [
    '#FF6B35', '#17A2B8', '#DC3545', '#28A745', '#6F42C1',
    '#20C997', '#E83E8C', '#FFC107', '#6C757D',
    '#6610f2', '#d63384', '#198754', '#0dcaf0', '#adb5bd'
  ];

  const activeColors: { end: Date; color: string }[] = [];
  const activeSlots: { end: Date; slot: number }[] = [];
  const assignments: Record<string, { slot: number; color: string }> = {};

  const sorted = [...items].sort((a, b) =>
    new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  );

  for (const item of sorted) {
    const id = `${item.type}-${item.title || item.school || 'unknown'}-${item.startDate}`;
    // Parse dates properly - handle YYYY-MM format
    const parseDate = (dateStr: string) => {
      if (dateStr.match(/^\d{4}-\d{2}$/)) {
        const [year, month] = dateStr.split('-');
        return new Date(parseInt(year), parseInt(month) - 1, 1);
      }
      return new Date(dateStr);
    };

    const start = parseDate(item.startDate);
    const end = item.endDate ? parseDate(item.endDate) : now;

    // Clear expired slots
    for (let i = activeSlots.length - 1; i >= 0; i--) {
      if (activeSlots[i].end < start) activeSlots.splice(i, 1);
    }

    const usedSlots = new Set(activeSlots.map(s => s.slot));
    let slot = 0;
    while (usedSlots.has(slot)) slot++;
    activeSlots.push({ end, slot });

    // Clear expired colors
    const BUFFER_DAYS = 32;

    for (let i = activeColors.length - 1; i >= 0; i--) {
      const releaseDate = new Date(activeColors[i].end);
      releaseDate.setDate(releaseDate.getDate() + BUFFER_DAYS);
      if (releaseDate < start) {
        activeColors.splice(i, 1); // Color is safely reusable
      }
    }

    const usedColors = new Set(activeColors.map(c => c.color));
    const color = allColors.find(c => !usedColors.has(c)) || '#000000';
    activeColors.push({ end, color });

    assignments[id] = { slot, color };
  }

  return assignments;
};

const slotMap = getSlotAndColorAssignments(allItems);

  return (
    <>
      {/* Render vertical bars for all items active this month */}
      {activeItems.map((item) => {
        const barDimensions = calculateBarDimensions(item);
        if (barDimensions.height <= 0) return null;

        const id = `${item.type}-${item.title || item.school || 'unknown'}-${item.startDate}`;
        const assignment = slotMap[id];

        if (!assignment) {
          console.warn("Missing assignment for:", id, item);
          return null; // or fallback visual
        }

        const { slot, color } = assignment;
        const barWidth = 12;
        const barOffset = 20 + slot * 16;

        return (
          <div key={`bar-container-${id}`}>
            {/* Desktop bar */}
            <div
              key={`bar-${id}-desktop`}
              className="absolute z-10 hidden md:block"
              style={{
                left: `${200 + barOffset}px`,
                height: `${barDimensions.height}px`,
                top: `${barDimensions.top}px`,
                width: `${barWidth}px`,
                backgroundColor: color,
                borderRadius: '6px',
              }}
            />
            {/* Mobile bar - positioned to the right of timeline, 50% wider and shorter */}
            <div
              key={`bar-${id}-mobile`}
              className="absolute z-10 md:hidden"
              style={{
                left: `${35 + slot * 6}px`, // Moved to right of timeline with more spacing
                height: `${item.current ? Math.max(barDimensions.height * 0.76, 16) : Math.max(barDimensions.height * 0.7, 12)}px`, // Current bars slightly longer
                top: `${item.current ? barDimensions.top : barDimensions.top + 16}px`, // Non-current bars positioned lower
                width: `4.5px`, // 50% wider (3px * 1.5 = 4.5px)
                backgroundColor: color,
                borderRadius: '2px',
              }}
            />
          </div>
        );
      })}

      {/* Render cards and connection lines for items that start this month */}
      {itemsWithCardsThisMonth.map((item) => {
        const id = `${item.type}-${item.title || item.school || 'unknown'}-${item.startDate}`;
        const assignment = slotMap[id];

        // Get pre-calculated card position
        const cardPosition = getCardPosition(item);

        if (!assignment) {
          console.warn("Missing assignment for:", id, item);
          return null; // or fallback visual
        }

        const { slot, color } = assignment;

        return (
          <div key={`card-${id}`}>
            {/* Desktop connection line */}
            <svg
              className="absolute z-15 hidden md:block"
              style={{
                left: `${200 + 20 + slot * 16 + 12}px`,
                top: `${cardPosition.verticalOffset + 110}px`, // Position line to connect card center to bar
                width: `${80 + cardPosition.horizontalOffset}px`,
                height: '2px',
              }}
            >
              <path
                d={`M 0 1 L ${80 + cardPosition.horizontalOffset} 1`}
                stroke={color}
                strokeWidth="2"
                fill="none"
              />
            </svg>

            {/* Mobile connection line - connects from new bar position */}
            <svg
              className="absolute z-15 md:hidden"
              style={{
                left: `${35 + slot * 6 + 4.5}px`, // start from the right edge of the mobile bar
                top: `${cardPosition.verticalOffset + 80}px`,
                width: `${(75 + cardPosition.horizontalOffset / 1.6) - (35 + slot * 6 + 4.5)}px`, // dynamic width to reach the card
                height: '1px',
              }}
            >
              <path
                d={`M 0 0.5 L ${(75 + cardPosition.horizontalOffset / 1.6) - (35 + slot * 6 + 4.5)} 0.5`}
                stroke={color}
                strokeWidth="1"
                fill="none"
              />
            </svg>

            {/* Desktop positioning */}
            <div
              className="absolute w-80 z-20 hidden md:block"
              style={{
                left: `${200 + 100 + cardPosition.horizontalOffset}px`,
                top: `${cardPosition.verticalOffset + 60}px`,
              }}
            >
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

            {/* Mobile positioning - slightly bigger cards with content-based width */}
            <div
              className="absolute z-20 md:hidden"
              style={{
                left: `${75 + (cardPosition.horizontalOffset/1.6)}px`, // Positioned after the repositioned bars
                top: `${cardPosition.verticalOffset + 60}px`,
                maxWidth: 'calc(100vw - 70px)', // Responsive to screen width
                minWidth: '220px', // Slightly bigger minimum width
              }}
            >
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
          </div>
        );
      })}
    </>
  );
}
