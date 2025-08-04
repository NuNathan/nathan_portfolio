import { toPastelColor, toDarkTextColor } from "@/utils/colours";

interface SkillTagProps {
  text: string;
  mainColour: string;
  variant?: 'default' | 'blog';
  size?: 'sm' | 'md';
  darkText?: boolean;
}

export default function SkillTag({
  text,
  mainColour,
  variant = 'default',
  size = 'sm',
  darkText = false
}: SkillTagProps) {
  const sizeClasses = {
    sm: 'px-3 py-1 text-xs',
    md: 'px-4 py-2 text-sm'
  };

  // Ensure mainColour is a valid hex color
  const safeMainColour = mainColour && mainColour.startsWith('#') ? mainColour : '#6366f1';

  if (variant === 'blog') {
    // Blog style tags - colored background with white text
    return (
      <span
        className={`${sizeClasses[size]} rounded-full font-medium text-white inline-block`}
        style={{
          color: safeMainColour,
          backgroundColor: toPastelColor(safeMainColour)
        }}
      >
        {text}
      </span>
    );
  }

  // Default style tags - pastel background with colored text (like about-me page)
  return (
    <span
      className={`${sizeClasses[size]} rounded-full font-medium inline-block`}
      style={{
        color: darkText ? toDarkTextColor(safeMainColour) : safeMainColour,
        backgroundColor: toPastelColor(safeMainColour)
      }}
    >
      {text}
    </span>
  );
}
