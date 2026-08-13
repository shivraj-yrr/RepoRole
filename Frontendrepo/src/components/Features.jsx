import React from "react";

const features = [
  {
    title: "Role detection for MERN Repos",
    desc: "Automatically identify developer roles by analyzing MERN stack contributions and patterns.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2l9 4-9 4-9-4 9-4z" />
        <path d="M3 10l9 4 9-4" />
        <path d="M3 18l9 4 9-4" />
      </svg>
    ),
  },
  {
    title: "AST based analyze for repository",
    desc: "Deep code inspection using Abstract Syntax Trees to understand structure and complexity.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M6 3v12" />
        <circle cx="18" cy="6" r="3" />
        <circle cx="6" cy="18" r="3" />
        <path d="M18 9v6a3 3 0 0 1-3 3H9" />
      </svg>
    ),
  },
  {
    title: "Toy Repo detection",
    desc: "Smart filtering distinguishes real projects from beginner practice repositories.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    ),
  },
  {
    title: "Personal dashboard",
    desc: "Track your repo insights, role matches, and analytics in one clean view.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
      </svg>
    ),
  },
];

const Features = () => {
  return (
    <div className="bg-[#f5f3ef] py-20 px-4">
      
      {/* Heading */}
      <div className="text-center">
        <h2 className="text-3xl md:text-5xl font-bold text-gray-900">
          Features
        </h2>
        <p className="mt-4 text-gray-600 text-sm md:text-lg">
          Everything you need to turn code into career clarity.
        </p>
      </div>

      {/* Cards */}
      <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-2 max-w-6xl mx-auto">
        
        {features.map((item, index) => (
          <div
            key={index}
            className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 hover:shadow-xl"
          >
            <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-gradient-to-r from-purple-600 to-purple-400 mb-5">
              {item.icon}
            </div>

            <h3 className="text-lg font-semibold text-gray-900">
              {item.title}
            </h3>

            <p className="mt-3 text-gray-600 text-sm">
              {item.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Features;