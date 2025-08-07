'use client';

import { trackResumeDownload, trackSocialLinkClick } from '@/api/strapi';
import ActionButton from './ActionButton';

interface TrackedContactCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  buttonText: string;
  buttonVariant?: 'primary' | 'secondary' | 'github' | 'success' | 'danger' | 'custom';
  buttonBackground?: string;
  href: string;
  iconBackgroundColor?: string;
  trackingType?: 'resume' | 'email' | 'linkedin' | 'github';
  location?: 'homepage' | 'about-page';
}

export default function TrackedContactCard({
  icon,
  title,
  description,
  buttonText,
  buttonVariant = 'custom', // eslint-disable-line @typescript-eslint/no-unused-vars
  buttonBackground,
  href,
  iconBackgroundColor = '#2b61eb',
  trackingType,
  location = 'about-page'
}: TrackedContactCardProps) {
  
  const handleClick = () => {
    // Track the interaction based on the type
    if (trackingType === 'resume') {
      trackResumeDownload(location);
    } else if (trackingType && ['email', 'linkedin', 'github'].includes(trackingType)) {
      trackSocialLinkClick(trackingType as 'email' | 'linkedin' | 'github', 'about-page');
    }
  };

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 group">
      <div
        className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 transform transition-transform duration-300 group-hover:scale-110"
        style={{ backgroundColor: iconBackgroundColor }}
      >
        {icon}
      </div>
      <h4 className="font-semibold text-dark mb-2 text-sm sm:text-base">{title}</h4>
      <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">{description}</p>
      <ActionButton
        variant="custom"
        href={href}
        customBackground={buttonBackground}
        fullWidth={true}
        size="md"
        external={href.startsWith('http') || href.startsWith('mailto:')}
        className="text-white"
        onClick={handleClick}
      >
        {buttonText}
      </ActionButton>
    </div>
  );
}
