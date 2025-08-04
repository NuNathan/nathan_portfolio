import Link from 'next/link';

interface ActionButtonProps {
  variant: 'primary' | 'secondary' | 'github' | 'success' | 'danger' | 'custom';
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
  customBackground?: string;
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  disabled?: boolean;
  external?: boolean; // For external links
}

export default function ActionButton({
  variant,
  children,
  href,
  onClick,
  className = '',
  customBackground,
  size = 'md',
  fullWidth = false,
  disabled = false,
  external = false,
}: ActionButtonProps) {
  
  // Base styles with enhanced hover effects
  const baseStyles = `
    inline-flex items-center justify-center gap-2
    font-medium rounded-lg
    transition-all duration-300 ease-out
    transform-gpu
    cursor-pointer
    relative overflow-hidden
    ${fullWidth ? 'w-full' : ''}
    ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 hover:shadow-xl active:scale-95'}
  `;

  // Size variants - matching original CustomButton sizes
  const sizeStyles = {
    sm: 'px-4 py-2 text-sm font-medium',
    md: 'px-6 sm:px-6 py-3 sm:py-4 text-sm sm:text-base font-medium', // Original CustomButton size
    lg: 'px-8 sm:px-10 py-4 sm:py-5 text-base sm:text-lg font-semibold'
  };

  // Variant styles with enhanced gradients and hover effects
  const variantStyles = {
    primary: `
      bg-gradient-to-r from-blue-600 to-purple-600 text-white
      hover:from-blue-700 hover:to-purple-700
      hover:shadow-blue-500/25
      before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/20 before:to-transparent 
      before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100
    `,
    secondary: `
      bg-gray-800 text-white
      hover:bg-gray-900
      hover:shadow-gray-500/25
      before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/10 before:to-transparent 
      before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100
    `,
    github: `
      bg-gray-800 text-white
      hover:bg-gray-900
      hover:shadow-gray-500/25
      before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/10 before:to-transparent 
      before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100
    `,
    success: `
      bg-green-600 text-white
      hover:bg-green-700
      hover:shadow-green-500/25
      before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/20 before:to-transparent 
      before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100
    `,
    danger: `
      bg-red-600 text-white
      hover:bg-red-700
      hover:shadow-red-500/25
      before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/20 before:to-transparent 
      before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100
    `,
    custom: `
      hover:shadow-lg
      before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/20 before:to-transparent
      before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100
    `
  };

  const buttonClasses = `${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`;

  const buttonStyle = variant === 'custom' && customBackground 
    ? { background: customBackground }
    : {};

  // Content wrapper to ensure proper z-index over the before pseudo-element
  const content = (
    <span className="relative z-10">
      {children}
    </span>
  );

  // Handle disabled state
  if (disabled) {
    return (
      <div className={buttonClasses} style={buttonStyle}>
        {content}
      </div>
    );
  }

  // Render as link if href is provided
  if (href) {
    if (external || href.startsWith('http') || href.startsWith('mailto:')) {
      return (
        <a
          href={href}
          target={external || href.startsWith('http') ? '_blank' : undefined}
          rel={external || href.startsWith('http') ? 'noopener noreferrer' : undefined}
          className={buttonClasses}
          style={buttonStyle}
        >
          {content}
        </a>
      );
    } else {
      return (
        <Link href={href} className={buttonClasses} style={buttonStyle} prefetch={true}>
          {content}
        </Link>
      );
    }
  }

  // Render as button if onClick is provided
  if (onClick) {
    return (
      <button
        onClick={onClick}
        className={buttonClasses}
        style={buttonStyle}
        disabled={disabled}
      >
        {content}
      </button>
    );
  }

  // Fallback: render as div (for use inside other clickable elements)
  return (
    <div className={buttonClasses} style={buttonStyle}>
      {content}
    </div>
  );
}
