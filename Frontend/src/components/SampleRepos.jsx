import React, { useState } from "react";

const reposList = [
  { name: "facebook/react", icon: "⚛️" },
  { name: "vercel/next.js", icon: "▲" },
  { name: "expressjs/express", icon: "🚂" },
  { name: "nodejs/node", icon: "🟢" },
  { name: "mongodb/node-mongodb-native", icon: "🍃" },
  { name: "nestjs/nest", icon: "🐱" },
];
 
const SampleRepos = () => {
  const [activeIndex, setActiveIndex] = useState(null); 
  return (
  <div className="bg-[#f5f3ef] py-6 px-4">
      
      {/* Heading */}
      <div className="text-center">
        <h2 className="text-3xl md:text-5xl font-bold text-gray-900">
          Sample Repositories
        </h2>

        <p className="mt-4 text-gray-600 text-sm md:text-lg">
          Try analyzing these popular MERN stack repositories.
        </p>
      </div>

      {/* Buttons */}
      <div className="mt-10 flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
        
        {reposList.map((repo, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)} 
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl border shadow-sm transition-all duration-200
              
              ${
                activeIndex === index
                  ? "bg-purple-500 text-white border-purple-500 shadow-md"
                  : "bg-white text-gray-800 border-gray-200 hover:shadow-md"
              }
            `}
          >
            <span className="text-lg">{repo.icon}</span>
            <span className="text-sm md:text-base font-medium">
              {repo.name}
            </span>
          </button>
        ))}

      </div>
    </div>
  );
};

export default SampleRepos;