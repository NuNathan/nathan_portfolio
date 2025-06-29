interface CustomButtonProps {
  type: 'filled' | 'outlined' | 'box';
  text: string;
  onClick?: () => void;
  className?: string;
  customBackground?: string; // For custom gradient or solid color
  fontSize?: string; // Custom font size
  fontWeight?: number; // Custom font weight
  altStyle?: boolean;
}

export default function CustomButton({
  type,
  text,
  onClick,
  className = '',
  customBackground,
  fontSize = '0.95rem', // Default to smaller size (14px)
  fontWeight = 400, // Default to lighter weight
  altStyle = false,
}: CustomButtonProps) {

  const baseStyles = `
    px-6 sm:px-8 py-3 sm:py-4
    transition-all duration-300 ease-out cursor-pointer
    inline-flex items-center justify-center
    text-sm sm:text-base

  `;
  const altStyles = `
    py-3 sm:py-4
    transition-all duration-300 ease-out cursor-pointer
    inline-flex items-center justify-center
    w-full
    text-sm sm:text-base
  `;

  const filledStyles = `
    rounded-full
    bg-[linear-gradient(135deg,_#2b61eb_20%,_#8e35ea_100%)]
    text-white
    hover:shadow-lg
    hover:scale-105
    active:scale-95
  `;

  const outlinedStyles = `
    rounded-full
    border-2
    border-[#2b61eb]
    text-[#2b61eb]
    bg-transparent
    hover:bg-[#2b61eb]
    hover:text-white
    hover:shadow-lg
    hover:scale-105
    active:scale-95
  `;

  const boxStyles = `
    rounded-lg
    text-white
    hover:shadow-lg
    hover:scale-105
    active:scale-95
  `;

  const getButtonStyles = () => {
    if (type === 'filled') return filledStyles;
    if (type === 'outlined') return outlinedStyles;
    if (type === 'box') return boxStyles;
    return filledStyles;
  };

  const buttonStyles = getButtonStyles();

  const getButtonStyle = () => {
    const baseStyle = {
      fontWeight: fontWeight,
      fontSize: fontSize,
    };

    if (type === 'box' && customBackground) {
      return {
        ...baseStyle,
        background: customBackground,
      };
    }

    if (type === 'box') {
      // Default box background (same as filled)
      return {
        ...baseStyle,
        background: 'linear-gradient(135deg, #2b61eb 20%, #8e35ea 100%)',
      };
    }

    return baseStyle;
  };

  // If no onClick is provided, render as a div (for use in links)
  if (!onClick) {
    return (
      <div
        className={`${altStyle ? altStyles : baseStyles} ${buttonStyles} ${className}`}
        style={getButtonStyle()}
      >
        {text}
      </div>
    );
  }

  // If onClick is provided, we need to use a Client Component
  // For now, just render as a div since we're in Server Component context
  return (
    <button
      className={`${altStyle ? altStyles : baseStyles} ${buttonStyles} ${className}`}
      style={getButtonStyle()}
      onClick={onClick}
    >
      {text}
    </button>
  );
}
