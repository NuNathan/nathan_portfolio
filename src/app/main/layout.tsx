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

    switch (pathname) {
        case "/main/projects":
            heading = "Projects"
            break
        default:
            heading = "Err"
            break
    }

    
    const router = useRouter()
    
    return (
        <div className="relative min-h-screen overflow-hidden" style={{ backgroundColor: '#FFB3BA' }}>
            <div className="h-[75px] flex items-center justify-center">
                <div style={{width: '55px', height: '55px', borderRadius: '50%', left: '5px'}} className="animateBack absolute" onClick={() => router.push('/?from=projects')}>
                    <IoIosArrowBack color="black" size={55} style={{marginRight: '5px'}}/>
                </div>
                <span>
                    {heading}
                </span>
            </div>
            {children}
        </div>
    )
}