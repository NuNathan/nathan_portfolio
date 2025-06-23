export default function TechnicalSkills() {
  const skills = [
    {
      category: "Frontend",
      icon: "💻",
      color: "from-blue-500 to-cyan-500",
      technologies: ["React", "TypeScript", "Next.js", "Tailwind CSS", "HTML5", "CSS3"]
    },
    {
      category: "Backend",
      icon: "⚙️",
      color: "from-green-500 to-emerald-500",
      technologies: ["Node.js", "Express", "Python", "Django", "PostgreSQL", "MongoDB"]
    },
    {
      category: "Tools & Cloud",
      icon: "🛠️",
      color: "from-purple-500 to-pink-500",
      technologies: ["AWS", "Docker", "Git", "GitHub", "VS Code", "Figma"]
    }
  ];

  return (
    <div className="mt-20">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Technical Skills</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Technologies and tools I work with regularly
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {skills.map((skill, index) => (
          <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className={`w-16 h-16 bg-gradient-to-r ${skill.color} rounded-2xl flex items-center justify-center text-2xl mb-6 mx-auto`}>
              {skill.icon}
            </div>
            
            <h3 className="text-xl font-bold text-gray-900 text-center mb-6">{skill.category}</h3>
            
            <div className="flex flex-wrap gap-2 justify-center">
              {skill.technologies.map((tech, techIndex) => (
                <span 
                  key={techIndex}
                  className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors duration-200"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
