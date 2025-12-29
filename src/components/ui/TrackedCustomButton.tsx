'use client';

import { trackResumeDownload } from '@/api/strapi';

interface TrackedCustomButtonProps {
  type: 'filled' | 'outlined' | 'box';
  text: string;
  href?: string;
  onClick?: () => void;
  className?: string;
  customBackground?: string;
  fontSize?: string;
  fontWeight?: number;
  altStyle?: boolean;
  trackingType?: 'resume';
  location?: 'homepage' | 'about-page';
}

export default function TrackedCustomButton({
  type,
  text,
  href,
  onClick,
  className = '',
  customBackground,
  fontSize = '0.95rem', // Default to smaller size (14px)
  fontWeight = 400, // Default to lighter weight
  altStyle = false,
  trackingType,
  location = 'homepage'
}: TrackedCustomButtonProps) {
  
  const handleClick = () => {
    // Track the interaction if it's a resume download
    if (trackingType === 'resume') {
      trackResumeDownload(location);
    }
    
    // Call the original onClick if provided
    if (onClick) {
      onClick();
    }
  };

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
    text-white
    hover:shadow-lg
    hover:scale-105
    active:scale-95
  `;

  const outlinedStyles = `
    rounded-full
    border-2
    border-[var(--color-dark-blue)]
    text-[var(--color-dark-blue)]
    bg-transparent
    hover:bg-[var(--color-dark-blue)]
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
        background: 'var(--gradient-primary)',
      };
    }

    if (type === 'filled') {
      // Use gradient from globals.css
      return {
        ...baseStyle,
        background: 'var(--gradient-primary)',
      };
    }

    return baseStyle;
  };

  // If no onClick is provided, render as a div (for use in links) but still handle tracking
  if (!onClick) {
    return (
      <div
        className={`${altStyle ? altStyles : baseStyles} ${buttonStyles} ${className}`}
        style={getButtonStyle()}
        onClick={handleClick}
      >
        {text}
      </div>
    );
  }

  // Render as link if href is provided
  if (href) {
    return (
      <a
        href={href}
        target={href.startsWith('http') ? '_blank' : undefined}
        rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
        className={`${altStyle ? altStyles : baseStyles} ${buttonStyles} ${className}`}
        style={getButtonStyle()}
        onClick={handleClick}
      >
        {text}
      </a>
    );
  }

  // Render as button
  return (
    <button
      className={`${altStyle ? altStyles : baseStyles} ${buttonStyles} ${className}`}
      style={getButtonStyle()}
      onClick={handleClick}
    >
      {text}
    </button>
  );
}
