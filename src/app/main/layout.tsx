'use client'

import { usePathname } from "next/navigation"
import './index.css'

export default function MainLayout({
    children
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname()

    // Route configuration - easier to maintain
    const routes = {
        "/main/projects": "Projects",
        "/main/about-me": "About Me",
        "/main/experience": "Work Experience",
        "/main/blog": "Blog & Insights"
    } as const;

    const colour = "#f8f7fc";

    // Get heading based on current route
    const getHeading = () => {
        if (routes[pathname as keyof typeof routes]) {
            return routes[pathname as keyof typeof routes];
        }
        // Blog detail pages don't need the large heading
        if (pathname.startsWith("/main/blog/")) {
            return "";
        }
        return "Err";
    };

    const heading = getHeading();

    return (
        <div className="relative min-h-screen pt-16" style={{ backgroundColor: colour }}>
            {heading && (
                <div className="flex items-center justify-center -mb-8 overflow-visible px-4">
                    <span
                        style={{fontFamily: 'Open Sans', fontWeight: '700', lineHeight: '1.3',}}
                        className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-gradient-header leading-none text-center"
                    >
                        {heading}
                    </span>
                </div>
            )}
            <div className={pathname === "/main/projects" || pathname.startsWith("/main/blog/") ? "py-8" : "mx-4 sm:mx-8 md:mx-[10%] lg:mx-[15%]"}>
                {children}
            </div>
        </div>
    )
}