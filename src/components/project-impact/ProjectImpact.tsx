interface ImpactStat {
    icon: React.ReactNode;
    value: string;
    label: string;
    color: string;
}

export default function ProjectImpact() {
    const stats: ImpactStat[] = [
        {
            icon: (
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd"/>
                </svg>
            ),
            value: "25+",
            label: "Projects Completed",
            color: "text-blue-500"
        },
        {
            icon: (
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"/>
                </svg>
            ),
            value: "1000+",
            label: "Users Reached",
            color: "text-green-500"
        },
        {
            icon: (
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd"/>
                </svg>
            ),
            value: "4.9",
            label: "Average Rating",
            color: "text-purple-500"
        },
        {
            icon: (
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
                </svg>
            ),
            value: "3",
            label: "Years Experience",
            color: "text-red-500"
        }
    ];

    return (
        <div className="mt-16 mb-8">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gradient-header mb-2">Project Impact</h2>
                <p className="text-gray-600">Measurable results from my development work</p>
            </div>
            
            <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {stats.map((stat, index) => (
                        <div key={index} className="text-center">
                            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gray-50 ${stat.color} mb-4`}>
                                {stat.icon}
                            </div>
                            <div className="text-3xl font-bold text-gray-900 mb-1">
                                {stat.value}
                            </div>
                            <div className="text-sm text-gray-600 font-medium">
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
