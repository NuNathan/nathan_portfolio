import { toPastelColor, toDarkTextColor } from "@/utils/colours";

interface SkillTagProps {
  text: string;
  mainColour: string;
  size?: 'sm' | 'md';
  darkText?: boolean;
}

export default function SkillTag({
  text,
  mainColour,
  size = 'sm',
  darkText = false
}: SkillTagProps) {
  const sizeClasses = {
    sm: 'px-3 py-1 text-xs',
    md: 'px-4 py-2 text-sm'
  };

  // Ensure mainColour is a valid hex color
  const safeMainColour = mainColour && mainColour.startsWith('#') ? mainColour : '#6366f1';

  // Always use the same style - pastel background with colored text
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
