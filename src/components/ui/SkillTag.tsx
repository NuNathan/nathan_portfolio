import { toPastelColor } from "@/utils/colours";

interface SkillTagProps {
  text: string;
  mainColour: string;
  variant?: 'default' | 'blog';
  size?: 'sm' | 'md';
}

export default function SkillTag({ 
  text, 
  mainColour, 
  variant = 'default',
  size = 'sm'
}: SkillTagProps) {
  const sizeClasses = {
    sm: 'px-3 py-1 text-xs',
    md: 'px-4 py-2 text-sm'
  };

  if (variant === 'blog') {
    // Blog style tags - colored background with white text
    return (
      <span
        className={`${sizeClasses[size]} rounded-full font-medium text-white inline-block`}
        style={{
          color: mainColour || '#fff',
        backgroundColor: toPastelColor(mainColour || '#FF746C')
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
        color: mainColour || '#fff',
        backgroundColor: toPastelColor(mainColour || '#FF746C')
      }}
    >
      {text}
    </span>
  );
}
