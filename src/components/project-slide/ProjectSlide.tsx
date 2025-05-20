export default function ProjectSlide({right = true, img = "", title = "", description = ""}) {
    return (
        <div className={right ? "flex gap-30" : "flex"}>
            {!right ? 
                <img src={img}/>
            :
                ""
            }
            
            <div>
                <div className="flex flex-col justify-center align-middle">
                    <span className="text-right">
                        {title}
                    </span>
                    <span className="text-right">
                        {description}
                    </span>
                </div>
            </div>
            {right ? 
                <img src={img}/>
            :
                ""
            }
        </div>
    )
}