'use client';

import { useCallback, useEffect, useRef, useState } from "react";
import Circle from "../components/blob/Circle";
import { BouncingCircleProvider } from "@/components/blob/CircleContext";
import Title from "../components/title/Title";
import { HomePageResponse } from "@/api/homePage";

interface HomeClientProps {
  homePageData: HomePageResponse;
}

// Helper function to generate random positions and speeds
const generateRandomCircleProps = (index: number, total: number, screenWidth: number) => {
  const margin = 150; // Keep circles away from edges
  const screenHeight = typeof window !== 'undefined' ? window.innerHeight : 800; // Fallback for SSR

  // Generate random position within screen bounds
  const initialX = Math.random() * (screenWidth - 2 * margin) + margin;
  const initialY = Math.random() * (screenHeight - 2 * margin) + margin;

  // Generate random speed between 0.3 and 1.0
  const speedIn = Math.random() * 0.7 + 0.3;

  return { initialX, initialY, speedIn };
};

export default function HomeClient({ homePageData }: HomeClientProps) {
  const spotlightRef = useRef<HTMLSpanElement | null>(null);
  const [hoveringTitle, setHoveringTitle] = useState(false);
  const [screenWidth, setScreenWidth] = useState(1200); // Default fallback

  // Extract skill tags from home page data
  const skillsData = homePageData.data.skillTags;

  // onMount
  useEffect(() => {
    // Set initial screen width
    setScreenWidth(window.innerWidth);

    // Handle window resize
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // Track spotlight
    const handleMouseMove = (e: MouseEvent) => {
      const x = e.clientX;
      const y = e.clientY;

      spotlightRef.current?.animate(
        {
          left: `${x}px`,
          top: `${y}px`,
        },
        { duration: 150, fill: "forwards" }
      );
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Functions to make spotlight appear
  const mouseEnter = useCallback(() => {
    setHoveringTitle(true)
  }, [])
  const mouseLeave = useCallback(() => {
    setHoveringTitle(false)
  }, [])

  return (
    <>
      <span
        ref={spotlightRef}
        className={`pointer-events-none fixed z-50 left-[50%] top-[50%] ${
          hoveringTitle ? "w-[200px] h-[200px] mix-blend-overlay" : "w-[0px] h-[0px]"
        } -translate-x-1/2 -translate-y-1/2 rounded-full bg-white transition-all duration-200`}
      />
      <BouncingCircleProvider>
        <div className="relative h-full overflow-hidden">
          {/* Dynamic circles generated from skills data */}
          {skillsData.map((skill, index) => {
            const circleProps = generateRandomCircleProps(index, skillsData.length, screenWidth);
            // Scale down the skillLevel to reasonable circle sizes (max 150px radius)
            const scaledRadius = Math.min(Math.max(skill.skillLevel / 2, 40), 150);
            return (
              <Circle
                key={skill.id}
                initialX={circleProps.initialX}
                initialY={circleProps.initialY}
                radius={scaledRadius}
                text={skill.skill}
                speedIn={circleProps.speedIn}
              />
            );
          })}
        </div>
      </BouncingCircleProvider>
      <Title
        mouseEnter={mouseEnter}
        mouseLeave={mouseLeave}
        hidden={false}
        header={homePageData.data.header}
        subHeader={homePageData.data.subHeader}
        resumeUrl={homePageData.data.resume?.url}
      />
    </>
  );
}
