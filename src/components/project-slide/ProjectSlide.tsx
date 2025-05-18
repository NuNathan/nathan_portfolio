export default function ProjectSlide({right = true}) {
    return (
        <div className={right ? "flex gap-30" : "flex"}>
            {!right ? 
                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSNfWG6tDP4bS-WMe-IDOV1eSvmzREsDImDWw&s"/>
            :
                ""
            }
            
            <div>
                <div>
                    <span>
                        Personal website
                    </span>
                    <span>
                        iksdafjhdsla fdjskal fjds dks dkdsf dsfjkfds;ldf sdfjkdsfa;fdjkldf; fdsjfjfkf f fk fjdsak alks jdfksa sa ajskdfa ajfkfd s 
                    </span>
                </div>
            </div>
            {right ? 
                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSNfWG6tDP4bS-WMe-IDOV1eSvmzREsDImDWw&s"/>
            :
                ""
            }
        </div>
    )
}