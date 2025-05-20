'use client';

import { useEffect, useRef, useState } from "react";
import { useBouncingCircles } from "./CircleContext";
import { v4 as uuidv4 } from "uuid";
import { useRouter } from "next/navigation";
import { normalize } from "path";

interface Props {
    initialX?: number;
    initialY?: number;
    from: null | string;
    sizeIn?: number;
    speedIn?: number;
    colour?: string;
    text: string;
    hidden: boolean;
}

export default function Circle({
    initialX = 100,
    initialY = 100,
    from,
    speedIn = 1,
    colour = 'white',
    text,
    hidden,
}: Props) {
    const normalize = (str: string) => str.toLowerCase().replace(/[^a-z]/g, '');

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
    const [size, setSize] = useState(normalize(from ?? "") == text.toLowerCase() ? 10000 : 0)
    console.log("HA", normalize(from ?? ""), " : ", normalize(text))
    let basicSize = useRef(0)
    let hoverSize = useRef(0)
    const clicked = useRef(false)
    const router = useRouter();
    const [zoomed, setZoomed] = useState(from == text.toLowerCase())


    // On Mount function:
    useEffect(() => {
        // Add self to context
        circles.current.push({ id: id.current, ref, pos: pos.current });
        basicSize.current = window.innerHeight/2.5
        hoverSize.current = window.innerHeight/2.5 * 1.2

        if(from == text.toLowerCase()) {
            setSize(window.innerWidth*2)
            if(ref.current) {
                ref.current.style.zIndex = "20"
            }
            
            setTimeout(() => {
                setSize(basicSize.current)
                if(ref.current) {
                    ref.current.style.zIndex = "0"
                }
                setZoomed(false)
            }, 250);
        }
        else {
            setSize(window.innerHeight/2.5)
        } 
        

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
            if(clicked.current) return

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

  const onMouseEnter = () => {
    if(clicked.current) return
    setSize(hoverSize.current)
  }

  const onMouseLeave = () => {
    if(clicked.current) return
    setSize(basicSize.current)
  }

  const onClick = () => {
    circles.current = circles.current.filter(c => c.id !== id.current);
    if(ref.current) {
        ref.current.style.zIndex = "20"
        ref.current.innerHTML = ""
    }
    setSize(window.innerWidth*2)
    clicked.current = true
    setTimeout(() => {
        if(text.toLowerCase() == "projects") {
            router.push('/main/projects');
        } else if(text.toLowerCase() == "about me") {
            router.push('/main/about-me');
        } else if(text.toLowerCase() == "work experience") {
            router.push('/main/projects');
        }
    }, 250);
  }

  return (
    <span
        ref={ref}
        className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full flex justify-center items-center text-center leading-none transition-all duration-300 ease-out will-change-transform"
        style={{
            width: size,
            height: size,
            backgroundColor: colour,
        }}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onClick={onClick}
        hidden={hidden}
    >
        <span
            className="text-black"
            style={{
                fontFamily: 'Rubik Doodle Shadow',
                fontSize: `${size / 8}px`,
                transition: 'font-size 0.3s ease-out',
            }}
        >
            {!zoomed ? text : ""}
        </span>
    </span>
  );
}
