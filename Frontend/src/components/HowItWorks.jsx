import {
  Link,
  Database,
  FileSearch,
  Files,
  Scan,
  BarChart3,
  AlertTriangle,
  Trophy,
} from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      icon: <Link className="h-5 w-5 text-white" />,
      title: "Submit Repository URL",
      desc: "User submits a GitHub repository URL.",
    },
    {
      icon: <Database className="h-5 w-5 text-white" />,
      title: "Fetch Metadata",
      desc: "Backend fetches repository metadata, languages, and folder contents.",
    },
    {
      icon: <FileSearch className="h-5 w-5 text-white" />,
      title: "Scan Manifests",
      desc: "Manifest files are scanned and signals are extracted.",
    },
    {
      icon: <Files className="h-5 w-5 text-white" />,
      title: "Select Sample Files",
      desc: "Sample files are chosen from the repository for deeper analysis.",
    },
    {
      icon: <Scan className="h-5 w-5 text-white" />,
      title: "AST Analysis",
      desc: "Scan AST of sample files and extract signals.",
    },
    {
      icon: <BarChart3 className="h-5 w-5 text-white" />,
      title: "Score Signals",
      desc: "Signals are scored against role weight configurations.",
    },
    {
      icon: <AlertTriangle className="h-5 w-5 text-white" />,
      title: "Detect Toy Repos",
      desc: "Detect if the repo is a Toy Repo.",
    },
    {
      icon: <Trophy className="h-5 w-5 text-white" />,
      title: "Get Role Matched",
      desc: "Top matches returned with score, confidence, and selected files.",
    },
  ];

  return (
    <section className="bg-[#f5f2ef] py-14 px-4 md:px-10">
      {/* Heading */}
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
          How It Works
        </h2>
        <p className="text-gray-600 mt-3">
          From URL to role match in seconds.
        </p>
      </div>

      {/* Timeline */}
      <div className="relative max-w-4xl mx-auto">
        {/* Vertical line */}
        <div className="absolute left-6 md:left-6 top-0 h-full w-[2px] bg-purple-200"></div>

        <div className="space-y-10">
          {steps.map((step, index) => (
            <div key={index} className="flex items-start gap-4">
              {/* Icon */}
              <div className="relative z-10">
                <div className="w-12 h-12 flex items-center justify-center bg-purple-600 rounded-full shadow-md">
                  {step.icon}
                </div>
              </div>

              {/* Card */}
              <div className="flex-1 bg-white border border-gray-200 rounded-2xl p-5 shadow-sm transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.02] hover:shadow-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {step.title}
                </h3>
                <p className="text-gray-600 text-sm">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}