// components/blob/BouncingCircleContext.tsx
'use client';

import { createContext, useContext, useRef } from 'react';

type Circle = {
  id: string;
  ref: React.RefObject<HTMLSpanElement>;
  pos: { x: number; y: number; xDir: number; yDir: number };
};

const CircleContext = createContext<{
  circles: React.RefObject<Circle[]>;
}>({
  circles: { current: [] },
});

export const BouncingCircleProvider = ({ children }: { children: React.ReactNode }) => {
  const circles = useRef<Circle[]>([]);
  return (
    <CircleContext.Provider value={{ circles }}>
      {children}
    </CircleContext.Provider>
  );
};

export const useBouncingCircles = () => useContext(CircleContext);
