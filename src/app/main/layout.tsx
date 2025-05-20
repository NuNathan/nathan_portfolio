'use client'

import { usePathname, useRouter } from "next/navigation"
import { IoIosArrowBack } from "react-icons/io"
import './index.css'

export default function MainLayout({
    children
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname()
    console.log(pathname)

    let heading;
    let colour;

    switch (pathname) {
        case "/main/projects":
            heading = "Projects"
            colour = "#FFB3BA"
            break
        case "/main/about-me":
            heading = "About Me"
            colour = "#B5D3FF"
            break
        case "/main/work-experience":
            heading = "Work Experience"
            colour = "#C1F0B5"
            break
        default:
            heading = "Err"
            colour = "white"
            break
    }

    
    const router = useRouter()
    
    return (
        <div className="relative min-h-screen overflow-hidden" style={{ backgroundColor: colour }}>
            <div className="h-[120px] flex items-center justify-center">
                <div style={{width: '55px', height: '55px', borderRadius: '50%', left: '25px'}} className="animateBack absolute" onClick={() => router.push(`/?from=${pathname.slice(6)}`)}>
                    <IoIosArrowBack color="black" size={55} style={{marginRight: '5px'}}/>
                </div>
                <span style={{fontFamily: 'Rubik Doodle Shadow'}} className="text-8xl">
                    {heading}
                </span>
            </div>
            <div className="mx-[25%]">
                {children}
            </div>
        </div>
    )
}