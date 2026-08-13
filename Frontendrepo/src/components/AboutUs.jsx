import { FaGithub, FaInstagram } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { FiFileText } from "react-icons/fi";

export default function AboutUs() {
  return (
    <section className="bg-[#f3efe9] py-12 px-4 md:px-10">
      
      <div className="max-w-6xl mx-auto bg-[#f7f4ef] border border-gray-200 rounded-3xl p-8 md:p-12 shadow-sm">
        
        {/* Avatar (Top Left) */}
        <div className="mb-6">
          <img
            src="https://avatars.githubusercontent.com/u/169514510?v=4"
            alt="Shivraj"
            className="w-28 h-28 md:w-32 md:h-32 rounded-full border-[6px] border-gray-200 object-cover"
          />
        </div>

        {/* Content */}
        <div className="max-w-4xl">
          
          {/* Name */}
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            Shivraj
          </h2>

          {/* Role */}
          <p className="text-purple-600 font-medium mt-1">
            Full-stack Developer · Builder of RepoRole
          </p>

          {/* Description */}
          <p className="text-gray-600 mt-4 text-sm md:text-base leading-relaxed">
            Hi, I'm Shivraj — a full-stack developer building real-world tools with React & Node.js.
            I built RepoSense, a GitHub repository analyzer, and I'm especially interested in backend
            systems and turning code into meaningful career signals.
          </p>

          {/* Buttons */}
          <div className="flex flex-wrap gap-3 mt-6">
            
            {/* GitHub */}
            <a
              href="https://github.com/shivraajjjjj/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 bg-[#f3f1ed] hover:bg-gray-200 transition text-sm text-black"
            >
              <FaGithub className="h-4 w-4 text-black" />
              GitHub
            </a>

            {/* Email */}
            <a
              href="mailto:shivraj@example.com"
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 bg-[#f3f1ed] hover:bg-gray-200 transition text-sm text-black"
            >
              <MdEmail className="h-4 w-4 text-black" />
              Email
            </a>

            {/* Instagram */}
            <a
              href="#"
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 bg-[#f3f1ed] hover:bg-gray-200 transition text-sm text-black"
            >
              <FaInstagram className="h-4 w-4 text-black" />
              Instagram
            </a>

            {/* Privacy */}
            <a
              href="#"
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 bg-[#f3f1ed] hover:bg-gray-200 transition text-sm text-black"
            >
              <FiFileText className="h-4 w-4 text-black" />
              Privacy Policy
            </a>

          </div>
        </div>
      </div>
    </section>
  );
}