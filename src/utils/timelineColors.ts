// Timeline color management utilities

// Color palette for timeline items
export const TIMELINE_COLORS = [
  '#FF6B35', '#17A2B8', '#DC3545', '#28A745', '#6F42C1',
  '#20C997', '#E83E8C', '#FFC107', '#6C757D',
  '#6610f2', '#d63384', '#198754', '#0dcaf0', '#adb5bd'
] as const;

// Location badge color mapping
export const LOCATION_BADGE_COLORS = {
  'Remote': 'bg-green-100 text-green-800 border-green-200',
  'Hybrid': 'bg-yellow-100 text-yellow-800 border-yellow-200',
  'On-site': 'bg-blue-100 text-blue-800 border-blue-200',
  'default': 'bg-gray-100 text-gray-800 border-gray-200'
} as const;

// Buffer days for color reuse (prevents colors from being too close together)
const COLOR_BUFFER_DAYS = 32;

interface TimelineItem {
  type: 'job' | 'school';
  title?: string;
  school?: string;
  startDate: string;
  endDate: string | null;
  current?: boolean;
  [key: string]: any;
}

interface ColorAssignment {
  slot: number;
  color: string;
}

interface ActiveColor {
  end: Date;
  color: string;
}

interface ActiveSlot {
  end: Date;
  slot: number;
}

/**
 * Get location badge color classes based on location string
 */
export function getLocationBadgeColor(location: string): string {
  return LOCATION_BADGE_COLORS[location as keyof typeof LOCATION_BADGE_COLORS] || LOCATION_BADGE_COLORS.default;
}

/**
 * Parse date string handling YYYY-MM format
 */
function parseTimelineDate(dateStr: string): Date {
  if (dateStr.match(/^\d{4}-\d{2}$/)) {
    const [year, month] = dateStr.split('-');
    return new Date(parseInt(year), parseInt(month) - 1, 1);
  }
  return new Date(dateStr);
}

/**
 * Generate slot and color assignments for timeline items
 * Ensures no overlapping items have the same color or slot
 */
export function getSlotAndColorAssignments(items: TimelineItem[]): Record<string, ColorAssignment> {
  const now = new Date();
  const activeColors: ActiveColor[] = [];
  const activeSlots: ActiveSlot[] = [];
  const assignments: Record<string, ColorAssignment> = {};

  // Sort items by start date for consistent processing
  const sortedItems = [...items].sort((a, b) =>
    parseTimelineDate(a.startDate).getTime() - parseTimelineDate(b.startDate).getTime()
  );

  for (const item of sortedItems) {
    const start = parseTimelineDate(item.startDate);
    const end = item.endDate ? parseTimelineDate(item.endDate) : now;
    const id = createTimelineItemId(item);

    // Clear expired slots
    for (let i = activeSlots.length - 1; i >= 0; i--) {
      if (activeSlots[i].end < start) {
        activeSlots.splice(i, 1);
      }
    }

    // Find available slot
    const usedSlots = new Set(activeSlots.map(s => s.slot));
    let slot = 0;
    while (usedSlots.has(slot)) {
      slot++;
    }
    activeSlots.push({ end, slot });

    // Clear expired colors (with buffer)
    for (let i = activeColors.length - 1; i >= 0; i--) {
      const releaseDate = new Date(activeColors[i].end);
      releaseDate.setDate(releaseDate.getDate() + COLOR_BUFFER_DAYS);
      if (releaseDate < start) {
        activeColors.splice(i, 1);
      }
    }

    // Find available color
    const usedColors = new Set(activeColors.map(c => c.color));
    const color = TIMELINE_COLORS.find(c => !usedColors.has(c)) || '#000000';
    activeColors.push({ end, color });

    assignments[id] = { slot, color };
  }

  return assignments;
}

/**
 * Create a unique ID for a timeline item (matches existing pattern)
 */
export function createTimelineItemId(item: TimelineItem): string {
  return `${item.type}-${item.title || item.school || 'unknown'}-${item.startDate}`;
}
