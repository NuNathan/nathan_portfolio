'use client';

import { useEffect, useRef, useState } from "react";
import { useBouncingCircles } from "./CircleContext";
import { v4 as uuidv4 } from "uuid";
import { getComplementaryColor, toPastelColor } from "@/utils/colours";

interface Props {
    initialX?: number;
    initialY?: number;
    radius?: number;
    speedIn?: number;
    text: string;
    colour?: string;
}

export default function Circle({
    initialX = 100,
    initialY = 100,
    radius = 100,
    speedIn = 1,
    text,
    colour,
}: Props) {
    //decalre variables
    const { circles } = useBouncingCircles();
    const ref = useRef<HTMLSpanElement | null>(null);
    const id = useRef(uuidv4());
    const pos = useRef({
        x: initialX,
        y: initialY,
        vx: speedIn * (Math.random() > 0.5 ? 1 : -1),
        vy: speedIn * (Math.random() > 0.5 ? 1 : -1),
    });
    const [size] = useState(radius * 2) // Fixed size based on radius


    // On Mount function:
    useEffect(() => {
        // Add self to context
        circles.current.push({ id: id.current, ref, pos: pos.current });

        // On unmount, remove itself from context
        return () => {
            circles.current = circles.current.filter(c => c.id !== id.current);
        };
    }, []);

    useEffect(() => {
        let frameId: number;
        let lastTime = performance.now();

        const animate = (time: number) => {

            const self = ref.current;

            // Throttle animation to 60fps
            const delta = Math.min((time - lastTime) / 16.67, 2) 
            lastTime = time;

            
            if (!self) {
                frameId = requestAnimationFrame(animate);
                return;
            }

            //get screen size for bounds
            const screenW = window.innerWidth;
            const screenH = window.innerHeight;

            // Apply delta to motion
            pos.current.x += pos.current.vx * delta;
            pos.current.y += pos.current.vy * delta;

            // Wall collision
            const radius = size / 2;

            if (pos.current.x - radius < 0) {
                pos.current.x = radius;
                pos.current.vx = Math.abs(pos.current.vx);
            } else if (pos.current.x + radius > screenW) {
                pos.current.x = screenW - radius;
                pos.current.vx = -Math.abs(pos.current.vx);
            }

            // Allow circles to go behind the navigation bar (negative Y values)
            // But bounce off the actual screen boundaries
            if (pos.current.y - radius < 0) {
                pos.current.y = radius;
                pos.current.vy = Math.abs(pos.current.vy);
            } else if (pos.current.y + radius > screenH) {
                pos.current.y = screenH - radius;
                pos.current.vy = -Math.abs(pos.current.vy);
            }


            // Inter-circle collision
            for (const other of circles.current) {
                if (other.id === id.current) continue;

                const dx = pos.current.x - other.pos.x;
                const dy = pos.current.y - other.pos.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                // Use correct combined radius
                const radius1 = size / 2;
                const radius2 = (other.ref.current?.offsetWidth ?? size) / 2;
                const minDist = radius1 + radius2;

                if (dist < minDist && dist > 0.0001) {
                    // Normalize vector between circles
                    const nx = dx / dist;
                    const ny = dy / dist;

                    // Calculate overlap
                    const overlap = minDist - dist;

                    // Push each circle apart equally
                    pos.current.x += (nx * overlap) / 2;
                    pos.current.y += (ny * overlap) / 2;
                    other.pos.x -= (nx * overlap) / 2;
                    other.pos.y -= (ny * overlap) / 2;

                    // Velocities
                    const p1 = pos.current;
                    const p2 = other.pos;

                    // Tangent vector
                    const tx = -ny;
                    const ty = nx;

                    // Project velocities onto tangent and normal
                    const dpTan1 = p1.vx * tx + p1.vy * ty;
                    const dpTan2 = p2.vx * tx + p2.vy * ty;
                    const dpNorm1 = p1.vx * nx + p1.vy * ny;
                    const dpNorm2 = p2.vx * nx + p2.vy * ny;

                    // Equal mass collision: swap normal components
                    const m1n = dpNorm2;
                    const m2n = dpNorm1;

                    p1.vx = tx * dpTan1 + nx * m1n;
                    p1.vy = ty * dpTan1 + ny * m1n;
                    p2.vx = tx * dpTan2 + nx * m2n;
                    p2.vy = ty * dpTan2 + ny * m2n;
                }
            }

            self.style.transform = `translate(${pos.current.x}px, ${pos.current.y}px)`;
            frameId = requestAnimationFrame(animate);
        };

        frameId = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(frameId);
    }, [size]);



  return (
    <span
        ref={ref}
        className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full flex justify-center items-center text-center leading-none transition-all duration-300 ease-out will-change-transform"
        style={{
            width: size,
            height: size,
            background: colour
                ? `linear-gradient(144deg, ${colour} 25%, ${getComplementaryColor(colour)} 100%)`
                : 'linear-gradient(144deg,rgba(105, 116, 221, 1) 25%, #8c34e9 100%)',
            pointerEvents: 'none',
        }}
    >
        <span
            className="text-light"
            style={{
                fontFamily: 'Open Sans',
                fontWeight: '600',
                fontSize: `${size / 8}px`,
                transition: 'font-size 0.3s ease-out',
                color: `${toPastelColor(colour || '#FF746C')}`
            }}
        >
            {text}
        </span>
    </span>
  );
}
