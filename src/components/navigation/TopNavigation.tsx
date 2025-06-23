'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

interface TopNavigationProps {
  className?: string;
}

export default function TopNavigation({ className = '' }: TopNavigationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigationItems = [
    { name: 'Nathan', href: '/', isLogo: true },
    { name: 'Projects', href: '/main/projects' },
    { name: 'Experience', href: '/main/experience' },
    { name: 'About', href: '/main/about-me' },
    { name: 'Blog', href: '/main/blog' },
  ];

  const handleNavigation = (href: string, name: string) => {
    // Close mobile menu when navigating
    setIsMobileMenuOpen(false);

    if (name === 'Nathan') {
      router.push('/');
    } else if (name === 'Projects') {
      router.push('/main/projects');
    } else if (name === 'Experience') {
      router.push('/main/experience');
    } else if (name === 'About') {
      router.push('/main/about-me');
    } else if (name === 'Blog') {
      router.push('/main/blog');
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Close mobile menu when pathname changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <>
      {/* Mobile menu backdrop */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-30 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <nav className={`fixed top-0 left-0 z-40 w-screen max-w-screen overflow-hidden ${className}`}>
        <div className="w-full overflow-hidden backdrop-blur-md bg-white/20 border-b border-white/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-hidden">
          <div className="flex justify-center items-center h-16 relative">
            {/* Logo/Brand - positioned absolutely to the left */}
            <div className="absolute left-0">
              <button
                onClick={() => handleNavigation('/', 'Nathan')}
                className="text-2xl font-bold text-gradient-primary hover:opacity-80 transition-opacity duration-200"
              >
                Nathan
              </button>
            </div>

            {/* Navigation Items - centered */}
            <div className="hidden md:block">
              <div className="flex items-center justify-center space-x-8">
                {navigationItems.slice(1).map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <button
                      key={item.name}
                      onClick={() => handleNavigation(item.href, item.name)}
                      onMouseEnter={() => setActiveItem(item.name)}
                      onMouseLeave={() => setActiveItem(null)}
                      className={`px-4 py-2 text-base font-medium rounded-md ${
                        isActive
                          ? 'text-[#2b61eb] bg-light/60 backdrop-blur-sm'
                          : activeItem === item.name
                          ? 'text-gradient-primary bg-light/60 backdrop-blur-sm'
                          : 'text-dark'
                      }`}
                    >
                      {item.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden absolute right-0">
              <button
                onClick={toggleMobileMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-dark hover:text-gradient-primary hover:bg-light/40 transition-colors duration-200"
                aria-label={isMobileMenuOpen ? "Close main menu" : "Open main menu"}
              >
                <svg
                  className="h-6 w-6"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  {isMobileMenuOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      <div className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${
        isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <div className="backdrop-blur-md bg-white/95 border-b border-white/30 shadow-lg">
          <div className="px-4 pt-2 pb-3 space-y-1">
            {navigationItems.slice(1).map((item) => {
              const isActive = pathname === item.href;
              return (
                <button
                  key={item.name}
                  onClick={() => handleNavigation(item.href, item.name)}
                  className={`block w-full text-left px-4 py-3 text-base font-medium rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'text-[#2b61eb] bg-blue-50 border-l-4 border-[#2b61eb]'
                      : 'text-dark hover:text-[#2b61eb] hover:bg-gray-50 hover:translate-x-1'
                  }`}
                >
                  {item.name}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
    </>
  );
}
