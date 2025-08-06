'use client';

import { useCallback, useEffect, useState } from "react";
import Circle from "../components/blob/Circle";
import { BouncingCircleProvider } from "@/components/blob/CircleContext";
import Title from "../components/title/Title";
import { HomePageResponse } from "@/api/homePage";

interface HomeClientProps {
  homePageData: HomePageResponse;
}

// Constants for circle generation
const CIRCLE_MARGIN = 150;
const DEFAULT_SCREEN_HEIGHT = 800;
const SPEED_RANGE = { min: 0.3, max: 1.0 };
const RADIUS_RANGE = { min: 40, max: 150 };



// Helper function to generate deterministic positions across full screen
const generateDeterministicCircleProps = (index: number, screenWidth: number) => {
  const screenHeight = typeof window !== 'undefined' ? window.innerHeight : DEFAULT_SCREEN_HEIGHT;

  // Create different seeds for X and Y to ensure independent distribution
  const seedX = index * 9973 + 1009; // Large prime numbers for better distribution
  const seedY = index * 7919 + 2003;
  const seedSpeed = index * 6421 + 3001;

  // Generate pseudo-random values using sine function (deterministic but random-looking)
  const randomX = Math.abs(Math.sin(seedX * 0.0001) * 10000) % 1;
  const randomY = Math.abs(Math.sin(seedY * 0.0001) * 10000) % 1;
  const randomSpeed = Math.abs(Math.sin(seedSpeed * 0.0001) * 10000) % 1;

  // Calculate available space (screen minus margins on both sides)
  const availableWidth = screenWidth - (2 * CIRCLE_MARGIN);
  const availableHeight = screenHeight - (2 * CIRCLE_MARGIN);

  // Distribute across the full available screen space
  const initialX = CIRCLE_MARGIN + (randomX * availableWidth);
  const initialY = CIRCLE_MARGIN + (randomY * availableHeight);

  // Generate speed within defined range
  const speedRange = SPEED_RANGE.max - SPEED_RANGE.min;
  const speedIn = randomSpeed * speedRange + SPEED_RANGE.min;

  return { initialX, initialY, speedIn };
};

export default function HomeClient({ homePageData }: HomeClientProps) {
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



  // Functions to emit title hover events for global spotlight
  const mouseEnter = useCallback(() => {
    window.dispatchEvent(new CustomEvent('titleHover', { detail: { hovering: true } }));
  }, [])
  const mouseLeave = useCallback(() => {
    window.dispatchEvent(new CustomEvent('titleHover', { detail: { hovering: false } }));
  }, [])

  return (
    <>
      <BouncingCircleProvider>
        <div className="relative h-full overflow-hidden">
          {/* Dynamic circles generated from skills data */}
          {skillsData.map((skill, index) => {
            const circleProps = generateDeterministicCircleProps(index, screenWidth);
            // Scale skillLevel to reasonable circle sizes within defined range
            const scaledRadius = Math.min(
              Math.max(skill.skillLevel / 2, RADIUS_RANGE.min),
              RADIUS_RANGE.max
            );

            return (
              <Circle
                key={skill.id}
                initialX={circleProps.initialX}
                initialY={circleProps.initialY}
                radius={scaledRadius}
                text={skill.skill}
                speedIn={circleProps.speedIn}
                colour={skill.mainColour}
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
