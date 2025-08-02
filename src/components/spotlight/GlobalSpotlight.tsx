'use client';

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

export default function GlobalSpotlight() {
  const spotlightRef = useRef<HTMLSpanElement | null>(null);
  const [hoveringTitle, setHoveringTitle] = useState(false);
  const [hoveringButton, setHoveringButton] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const pathname = usePathname();

  // Check if we're on desktop (768px and above)
  useEffect(() => {
    const checkIsDesktop = () => {
      setIsDesktop(window.innerWidth >= 768);
    };

    checkIsDesktop();
    window.addEventListener('resize', checkIsDesktop);
    return () => window.removeEventListener('resize', checkIsDesktop);
  }, []);

  // Mouse tracking effect
  useEffect(() => {
    if (!isDesktop) return;

    const handleMouseMove = (e: MouseEvent) => {
      const x = e.clientX;
      const y = e.clientY;

      spotlightRef.current?.animate(
        {
          left: `${x+4}px`,
          top: `${y+4}px`,
        },
        { duration: 150, fill: "forwards" }
      );
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isDesktop]);

  // Listen for title hover events from home page
  useEffect(() => {
    const handleTitleHover = (event: CustomEvent) => {
      setHoveringTitle(event.detail.hovering);
    };

    window.addEventListener('titleHover', handleTitleHover as EventListener);
    return () => window.removeEventListener('titleHover', handleTitleHover as EventListener);
  }, []);

  // Listen for button hover events globally
  useEffect(() => {
    if (!isDesktop) return;

    const isClickableElement = (element: HTMLElement): boolean => {
      return (
        element.tagName === 'BUTTON' ||
        element.tagName === 'A' ||
        element.closest('button') !== null ||
        element.closest('a') !== null ||
        element.classList.contains('cursor-pointer') ||
        element.getAttribute('role') === 'button' ||
        element.onclick !== null ||
        // Specifically detect project slides
        element.closest('.group.cursor-pointer') !== null ||
        (element.classList.contains('group') && element.classList.contains('cursor-pointer'))
      );
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (isClickableElement(target)) {
        setHoveringButton(true);
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (isClickableElement(target)) {
        setHoveringButton(false);
      }
    };

    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);

    return () => {
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
    };
  }, [isDesktop]);

  // Don't render on mobile/tablet
  if (!isDesktop) return null;

  // Determine spotlight size and appearance
  const getSpotlightClasses = () => {
    if (hoveringButton) {
      return "w-[50px] h-[50px] border-[1.5px] border-black bg-[rgba(119,63,234,0.2)]";
    }
    if (hoveringTitle && pathname === '/') {
      return "w-[200px] h-[200px] bg-white mix-blend-overlay ";
    }
    return "w-[65px] h-[65px] bg-white/10 border-[1.5px] border-black";
  };



  return (
    <span
      ref={spotlightRef}
      className={`pointer-events-none fixed z-50 ${getSpotlightClasses()} -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-200`}
      // style={{ border: getSpotlightBorder() }}
    />
  );
}
