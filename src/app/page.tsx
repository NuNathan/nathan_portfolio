'use client';

import { useCallback, useEffect, useRef, useState } from "react";
import Title from "../components/title/Title";
import Circle from "../components/blob/Circle";
import { BouncingCircleProvider } from "@/components/blob/CircleContext";
import { useSearchParams } from 'next/navigation';

export default function Home() {
  const spotlightRef = useRef<HTMLSpanElement | null>(null);
  const params = useSearchParams();
  const from = params.get('from')
  const [hoveringTitle, setHoveringTitle] = useState(false);
  const [hidden, setHidden] = useState({
    projects: from != "projects" || from == null, 
    about: from != "About me" || from == null, 
    experience: from != "Work experience" || from == null, 
    title: from != null
  })

  // onMount
  useEffect(() => {
    setTimeout(() => {
      setHidden({
        projects: false,
        about: false,
        experience:false,
        title: false
      })
    }, 10);
  }, [hidden])

  
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
  }, [hoveringTitle])
  const mouseLeave = useCallback(() => {
    setHoveringTitle(false)
  }, [hoveringTitle])

  return (
    <div className="relative min-h-screen overflow-hidden">
      <span
        ref={spotlightRef}
        className={`pointer-events-none fixed z-50 left-[50%] top-[50%] ${
          hoveringTitle ? "w-[200px] h-[200px] mix-blend-difference" : "w-[0px] h-[0px]"
        } -translate-x-1/2 -translate-y-1/2 rounded-full bg-white transition-all duration-200`}
      />
      <BouncingCircleProvider>
        <div className="relative min-h-screen overflow-hidden">
          <Circle initialX={100} initialY={200} colour="#DE4D86" text="Projects" from={from} hidden={hidden.projects}/>
          <Circle initialX={800} initialY={400} colour="#F29CA3" text="About me" from={from} hidden={hidden.about}/>
          <Circle initialX={1200} initialY={600} colour="#84E6F8" text="Work experience" from={from} hidden={hidden.experience}/>
        </div>
      </BouncingCircleProvider>
      <Title mouseEnter={mouseEnter} mouseLeave={mouseLeave} hidden={hidden.title}/>
    </div>
  );
}
