import { getAboutMe } from "@/api/aboutMe";
import ContactCard from "@/components/ui/ContactCard";
import SkillTag from "@/components/ui/SkillTag";

interface SkillTag {
    id: number;
    skill: string;
    mainColour: string;
}

export default async function AboutMe() {
    let aboutMeData = null;

    try {
        const response = await getAboutMe();
        aboutMeData = response?.data;
    } catch (error) {
        console.error("Failed to fetch about-me data:", error);
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-4 sm:py-8">
            {/* Subtitle */}
            <div className="text-center mb-8 sm:mb-12 mt-4 sm:mt-0">
                <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto px-4">
                    {aboutMeData?.subHeader || "Get to know the person behind the code"}
                </p>
            </div>

            {/* Main content section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 mb-12 sm:mb-16">
                {/* Left Column - Profile Image */}
                <div className="flex justify-center">
                    <div className="flex justify-center items-center">
                        <div
                            className="w-64 h-64 sm:w-70 sm:h-70 rounded-3xl overflow-hidden float-animation"
                            style={{
                                 background: 'linear-gradient(135deg, #2b61eb 30%, #8e35ea)', // border gradient
    padding: '4px'
                            }}
                        >
                            {/* Profile image */}
                            <div className="w-full h-full overflow-hidden flex items-center justify-center">
                                <img
                                    src={aboutMeData?.headshot?.url ? `${process.env.STRAPI_URL || 'http://localhost:1337'}${aboutMeData.headshot.url}` : "https://headshots-inc.com/wp-content/uploads/2023/02/pure-white-background-for-professional-headshots-1.jpg"}
                                    className="w-full h-full object-cover rounded-3xl"
                                    alt={aboutMeData?.headshot?.alternativeText || "Headshot"}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column - Content */}
                <div className="flex flex-col justify-center lg:justify-start text-center lg:text-left">
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-dark mb-4 sm:mb-6">
                        {aboutMeData?.introHeader || "Hello, I'm Nathan!"}
                    </h2>

                    <div className="space-y-4 mb-6 sm:mb-8">
                        <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
                            {aboutMeData?.topDescription || "I'm a passionate Software Engineering student with a love for creating innovative digital solutions. My journey in tech began with curiosity and has evolved into a dedication to crafting meaningful user experiences through clean, efficient code."}
                        </p>

                        <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
                            {aboutMeData?.bottomDescription || "When I'm not coding, you'll find me exploring new technologies, contributing to open-source projects, or sharing my knowledge through technical writing. I believe in the power of technology to solve real-world problems and make a positive impact."}
                        </p>
                    </div>

                    {/* Tech Stack */}
                    <div className="mb-8">
                        <div className="flex flex-wrap gap-3">
                            {(aboutMeData?.skillTags || []).map((skillTag: SkillTag) => (
                                <SkillTag
                                    key={skillTag.id}
                                    text={skillTag.skill}
                                    mainColour={skillTag.mainColour}
                                    variant="default"
                                    size="md"
                                />
                            ))}
                            {/* Fallback skills if no data */}
                            {(!aboutMeData?.skillTags || aboutMeData.skillTags.length === 0) &&
                                [
                                    { skill: 'React', color: '#61dafb' },
                                    { skill: 'Node.js', color: '#68a063' },
                                    { skill: 'TypeScript', color: '#3178c6' },
                                    { skill: 'Python', color: '#3776ab' },
                                    { skill: 'Vue.js', color: '#4fc08d' },
                                    { skill: 'UI/UX', color: '#ff6b6b' }
                                ].map((tech) => (
                                    <SkillTag
                                        key={tech.skill}
                                        text={tech.skill}
                                        mainColour={tech.color}
                                        variant="default"
                                        size="md"
                                    />
                                ))
                            }
                        </div>
                    </div>
                </div>
            </div>

            {/* Let's Connect Section */}
            <div className="text-center mb-8 sm:mb-12">
                <h3 className="text-2xl sm:text-3xl font-bold text-dark-blue mb-4">
                    Let's Connect
                </h3>
                <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8 px-4">
                    I'm always open to discussing new opportunities and interesting projects
                </p>

                {/* Contact Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-4xl mx-auto">
                    {/* Email Card */}
                    <ContactCard
                        icon={
                            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                            </svg>
                        }
                        title="Email"
                        description={aboutMeData?.email || "nathan@example.com"}
                        buttonText="Send Message"
                        buttonBackground="#ef4444"
                        href={`mailto:${aboutMeData?.email || 'nathan@example.com'}`}
                        iconBackgroundColor="#ef4444"
                    />

                    {/* LinkedIn Card */}
                    <ContactCard
                        icon={
                            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd" />
                            </svg>
                        }
                        title="LinkedIn"
                        description="Connect professionally"
                        buttonText="Connect"
                        buttonBackground="#2563eb"
                        href={aboutMeData?.linkedIn ? `https://${aboutMeData.linkedIn}` : '#'}
                        iconBackgroundColor="#2563eb"
                    />

                    {/* GitHub Card */}
                    <ContactCard
                        icon={
                            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                            </svg>
                        }
                        title="GitHub"
                        description="View my code"
                        buttonText="Follow"
                        buttonBackground="#1f2937"
                        href={aboutMeData?.github || '#'}
                        iconBackgroundColor="#1f2937"
                    />

                    {/* Resume Card */}
                    <ContactCard
                        icon={
                            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        }
                        title="Resume"
                        description="Download PDF"
                        buttonText="Download"
                        buttonBackground="#10b981"
                        href={aboutMeData?.resume?.url ? `${process.env.STRAPI_URL}${aboutMeData.resume.url}` : '#'}
                        iconBackgroundColor="#10b981"
                    />
                </div>
            </div>
        </div>
    )
}