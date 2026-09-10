import { Briefcase, Rocket, Zap } from "lucide-react";

export default function ComingSoon() {
  const cards = [
    {
      icon: <Briefcase className="h-6 w-6 text-gray-600" />,
      title: "Recruiter dashboard",
      desc: "A dedicated space for recruiters to browse verified talent and matched repositories.",
    },
    {
      icon: <Rocket className="h-6 w-6 text-gray-600" />,
      title: "Job or internship opportunities",
      desc: "Get matched with open roles based on your repo profile and detected skill set.",
    },
    {
      icon: <Zap className="h-6 w-6 text-gray-600" />,
      title: "Role detection for PY, Java, C & C++ repos",
      desc: "Expanding language support beyond JavaScript to cover Python, Java, and systems code.",
    },
  ];

  return (
    <section className="bg-[#f5f2ef] py-10 px-4 md:px-10">
      {/* Top Badge */}
      <div className="mb-6">
        <span className="bg-purple-600 text-white text-sm px-4 py-1 rounded-full">
          Coming Soon
        </span>
      </div>

      {/* Cards */}
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {cards.map((card, index) => (
          <div
            key={index}
            className="relative bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition"
          >
            {/* Badge inside card */}
            <span className="absolute top-4 right-4 text-xs bg-purple-100 text-purple-600 px-3 py-1 rounded-full font-medium">
              COMING SOON
            </span>

            {/* Icon */}
            <div className="w-12 h-12 flex items-center justify-center bg-gray-100 rounded-xl mb-4">
              {card.icon}
            </div>

            {/* Title */}
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {card.title}
            </h3>

            {/* Description */}
            <p className="text-gray-600 text-sm leading-relaxed">
              {card.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
