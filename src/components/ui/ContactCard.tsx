import CustomButton from './CustomButton';
import Link from 'next/link';

interface ContactCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  buttonText: string;
  buttonType?: 'filled' | 'outlined' | 'box';
  buttonBackground?: string;
  href: string; // Make href required since we're only supporting links
  iconBackgroundColor?: string;
}

export default function ContactCard({
  icon,
  title,
  description,
  buttonText,
  buttonType = 'box',
  buttonBackground,
  href,
  iconBackgroundColor = '#2b61eb'
}: ContactCardProps) {
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
      {href.startsWith('http') ? (
        <a href={href} target="_blank" rel="noopener noreferrer">
          <CustomButton
            type={buttonType}
            text={buttonText}
            customBackground={buttonBackground}
            altStyle={true}
          />
        </a>
      ) : (
        <Link href={href} prefetch={true}>
          <CustomButton
            type={buttonType}
            text={buttonText}
            customBackground={buttonBackground}
            altStyle={true}
          />
        </Link>
      )}
    </div>
  );
}