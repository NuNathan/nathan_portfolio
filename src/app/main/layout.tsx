'use client'

import { usePathname } from "next/navigation"
import './index.css'

export default function MainLayout({
    children
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname()

    let heading;
    let colour;

    switch (pathname) {
        case "/main/projects":
            heading = "Projects"
            colour = "#f8f7fc"
            break
        case "/main/about-me":
            heading = "About Me"
            colour = "#f8f7fc"
            break
        case "/main/experience":
            heading = "Work Experience"
            colour = "#f8f7fc"
            break
        case "/main/blog":
            heading = "Blog & Insights"
            colour = "#f8f7fc"
            break
        default:
            // Handle blog detail pages - they don't need the large heading
            if (pathname.startsWith("/main/blog/")) {
                heading = ""
                colour = "#f8f7fc"
            } else {
                heading = "Err"
                colour = "#f8f7fc"
            }
            break
    }

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