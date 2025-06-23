'use client';

import React, { useEffect, useState, useRef } from 'react';

const NUM_VALUES = 8; // 4 horiz + 4 vert

// Helper to format the radius array
function toBorderRadiusString(values: number[]) {
  return `${values.slice(0, 4).map(v => `${v}%`).join(' ')} / ${values.slice(4).map(v => `${v}%`).join(' ')}`;
}

export default function ResizableBlob({ref}: {ref: any}) {
  const [radiusValues, setRadiusValues] = useState<number[] | null>(null);
  const targetsRef = useRef<number[]>([]);
  const directionsRef = useRef<number[]>([]);

  // Initialize values only on the client
  useEffect(() => {
    const initial = Array(NUM_VALUES)
      .fill(0)
      .map(() => Math.random() * 50 + 25); // 25–75%
    const targets = initial.map(() => Math.random() * 50 + 25);
    const directions = initial.map((val, i) => targets[i] > val ? 1 : -1);

    setRadiusValues(initial);
    targetsRef.current = targets;
    directionsRef.current = directions;

    const interval = setInterval(() => {
      setRadiusValues(prev => {
        if (!prev) return prev;
        const updated = prev.map((val, i) => {
          const target = targetsRef.current[i];
          const direction = directionsRef.current[i];
          const step = 0.3; // Smaller = smoother

          // If close to target, pick a new one
          if (Math.abs(val - target) < step) {
            const newTarget = Math.random() * 50 + 25;
            targetsRef.current[i] = newTarget;
            directionsRef.current[i] = newTarget > val ? 1 : -1;
            return val;
          }

          return val + step * direction;
        });
        return updated;
      });
    }, 30); // frequent small updates

    return () => clearInterval(interval);
  }, []);

  if (!radiusValues) return null;

  return (
    <div
      ref={ref}
      className="-translate-x-1/2 -translate-y-1/2 transition-all duration-200 absolute"
      style={{
        width: '300px',
        height: '300px',
        backgroundColor: '#1e90ff',
        borderRadius: toBorderRadiusString(radiusValues),
        transition: 'border-radius 30ms linear',
        transform: `translate(150px, 150px)`
      }}
    />
  );
}
