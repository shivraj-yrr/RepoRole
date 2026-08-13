import React from "react";
import { useLocation } from "react-router-dom";

import {
  Code2,
  Server,
  Layers3,
  Database,
  FileText,
  Sparkles,
  Folder,
  Trophy,
} from "lucide-react";
import { FaCheckCircle } from "react-icons/fa";
/* ICON MAP */
const iconMap = {
  code: Code2,
  server: Server,
  layers: Layers3,
  database: Database,
  file: FileText,
  sparkles: Sparkles,
};

/* MAIN COMPONENT */
const AnalyzePage = () => {
  const { state } = useLocation();

  if (!state) {
    return <div className="p-10 text-center">No data found</div>;
  }

  const {
    repo,
    languages = [],
    frameworks = [],
    runtime = [],
    databases = [],
    buildFiles = [],
    structure = [],
    roles = [],
    selectedFiles = [],
    metadata = {},
  } = state;

  const bestRole = roles?.[0];

  return (
    <div className="p-6 md:p-10">

   
{/* HEADER */}
<div className="mb-6">

  {/* Analysis Result + BADGES */}
  <div className="flex items-center justify-between gap-4 mb-2">

    {/* Analysis Result - Left */}
    <p className="text-gray-500 text-sm whitespace-nowrap">
      Analysis Result
    </p>

    {/* Badges - Right */}
    <div className="flex flex-wrap items-center justify-end gap-2">
      <span className="whitespace-nowrap bg-green-100 text-green-600 px-3 py-2 rounded-xl text-sm font-medium flex items-center gap-2 shadow-sm">
  <FaCheckCircle className="text-green-600 text-sm" />
  Supported
</span>

      <span className="whitespace-nowrap bg-purple-600 text-white px-3 py-2 rounded-full text-xs font-medium">
        Production-grade
      </span>

      <span className="whitespace-nowrap bg-gray-200 text-gray-700 px-3 py-2 rounded-full text-xs">
        README
      </span>

      <span className="whitespace-nowrap bg-gray-200 text-gray-700 px-3 py-2 rounded-full text-xs">
        {metadata?.fileCount || 0} files
      </span>
    </div>

  </div>

  {/* Repo Title */}
  <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
    {repo?.owner || "user"}/
    <span className="text-purple-500">{repo?.name}</span>
  </h1>

  {/* URL with GitHub Icon - New Line */}
  <div className="flex items-center gap-2 mt-2 text-sm text-gray-500 break-all">

    {/* GitHub SVG Icon */}
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-4 h-4"
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M12 .5C5.65.5.5 5.65.5 12a11.5 11.5 0 008 10.94c.6.1.82-.26.82-.58v-2.02c-3.25.7-3.94-1.57-3.94-1.57-.55-1.4-1.34-1.78-1.34-1.78-1.1-.76.08-.75.08-.75 1.22.08 1.86 1.25 1.86 1.25 1.08 1.85 2.84 1.32 3.53 1 .1-.78.42-1.32.76-1.62-2.6-.3-5.34-1.3-5.34-5.78 0-1.28.46-2.33 1.22-3.15-.12-.3-.53-1.52.12-3.18 0 0 1-.32 3.3 1.2a11.5 11.5 0 016 0c2.3-1.52 3.3-1.2 3.3-1.2.65 1.66.24 2.88.12 3.18.76.82 1.22 1.87 1.22 3.15 0 4.5-2.74 5.48-5.35 5.78.43.37.82 1.1.82 2.22v3.3c0 .32.22.7.83.58A11.5 11.5 0 0023.5 12C23.5 5.65 18.35.5 12 .5z" />
    </svg>

    <span>{repo?.url}</span>
  </div>

</div>



      {/* BEST ROLE */}
<div className="bg-[#f5f3f7] border-2 border-purple-200 rounded-2xl p-6 md:p-8 shadow-sm">

  {/* Header */}
  <div className="flex items-center gap-2 text-black-500 font-medium text-sm mb-3">
    <Trophy className="w-5 h-5 text-yellow-500" />
    <span>BEST ROLE MATCH</span>
  </div>

  {/* Title */}
  <h2 className="text-xl md:text-3xl font-bold text-gray-900 mt-1">
    {bestRole?.title || "No role detected"}
  </h2>

  {/* Scores */}
  <div className="grid md:grid-cols-3 gap-6 mt-6">

    {/* Final Score */}
    <div>
      <p className="text-gray-500 mb-2">Final Score</p>
      <p className="text-3xl font-bold text-[#0f172a] mb-3">
        {bestRole?.finalScore || "0/100"}
      </p>

      <div className="w-full h-2 bg-purple-200 rounded-full">
        <div
          className="h-2 bg-purple-700 rounded-full"
          style={{
            width: `${Math.min(
              parseFloat(bestRole?.finalScore || 0),
              100
            )}%`,
          }}
        />
      </div>
    </div>

    {/* Confidence */}
    <div>
      <p className="text-gray-500 mb-2">Confidence</p>
      <p className="text-3xl font-bold text-[#0f172a] mb-3">
        {bestRole?.confidence || 0}%
      </p>

      <div className="w-full h-2 bg-purple-200 rounded-full">
        <div
          className="h-2 bg-purple-700 rounded-full"
          style={{
            width: `${Math.min(bestRole?.confidence || 0, 100)}%`,
          }}
        />
      </div>
    </div>

    {/* Raw Score */}
    <div>
      <p className="text-gray-500 mb-2">Raw Score</p>
      <p className="text-3xl font-bold text-[#0f172a]">
        {bestRole?.rawScore || "0/100"}
      </p>
    </div>

  </div>
</div>

      {/* INFO CARDS */}
      <div className="mt-6 grid md:grid-cols-3 gap-6">
        <InfoCard title="Languages" items={languages} icon="code" />
        <InfoCard title="Runtime" items={runtime} icon="server" />
        <InfoCard title="Frameworks" items={frameworks} icon="layers" />
        <InfoCard title="Databases" items={databases} icon="database" />
        <InfoCard title="Detected Tools" items={state.tools || []} icon="sparkles" />
        <InfoCard title="Build Files" items={buildFiles} icon="file" />
      </div>

      {/* ROLE MATCHES */}
      <div className="mt-10">
        <div className="flex justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Role Matches
          </h2>
          <span className="text-sm text-gray-500">
            {roles.length} roles ranked
          </span>
        </div>

        <div className="space-y-6">
          {roles.map((role, index) => (
            <div key={role.roleId} className="bg-white rounded-2xl border p-5 shadow-sm">

              <div className="flex justify-between">
                <div>
                  <span className="bg-yellow-100 text-yellow-700 px-2 py-1 text-xs rounded-full">
                    #{index + 1}
                  </span>

                  <h3 className="mt-2 font-semibold text-gray-900 text-lg">
                    {role.title}
                  </h3>
                </div>

                <span className="text-sm text-gray-500">
                  {role.matchedSignals?.length || 0} signals
                </span>
              </div>

              <div className="mt-4">
                <p className="text-sm text-gray-500">Final Score</p>
                <Progress value={role.finalScore} />
              </div>

              <div className="mt-4">
                <p className="text-sm text-gray-500">Confidence</p>
                <Progress value={role.confidence} />
              </div>

              <p className="text-sm text-gray-500 mt-2">
                Raw: {role.rawScore}
              </p>

              {/* ✅ ADDED MATCHED SIGNALS DROPDOWN */}
              <details className="mt-3">
                <summary className="cursor-pointer text-sm text-purple-600 font-medium">
                  View matched signals
                </summary>

                <ul className="mt-2 text-sm text-gray-600 space-y-1">
                  {role.matchedSignals?.map((s, i) => (
                    <li key={i} className="flex justify-between">
                      <span>{s.signal}</span>
                      <span className="text-purple-500">
                        +{s.score}
                      </span>
                    </li>
                  ))}
                </ul>
              </details>

            </div>
          ))}
        </div>
      </div>

      {/* SELECTED FILES */}
      <div className="mt-10 bg-white border rounded-2xl p-5 shadow-sm">
        <h3 className="font-semibold text-gray-900 mb-3">Selected Files</h3>

        {selectedFiles.length ? (
          selectedFiles.map((file, i) => (
            <p key={i} className="flex items-center gap-2 text-sm text-gray-600">
               {file}
            </p>
          ))
        ) : (
          <p className="text-gray-400 text-sm">No files</p>
        )}
      </div>
        {/* STRUCTURE */}
      <div className="mt-10 bg-white border rounded-2xl p-5 shadow-sm">
        <div className="flex justify-between mb-3">
          <h3 className="font-semibold text-gray-900">
            Repository Structure
          </h3>
          <span className="text-sm text-gray-500">
            {structure.length} folders
          </span>
        </div>

        {structure.length ? (
          structure.map((path, i) => {
            const depth = path.split("/").length - 1;

            return (
              <p
                key={i}
                className="flex items-center gap-2 text-sm text-gray-600"
                style={{ marginLeft: depth * 12 }}
              >
                <Folder size={16} /> {path}
              </p>
            );
          })
        ) : (
          <p className="text-gray-400 text-sm">No structure</p>
        )}
      </div>

    </div>
  );
};

   


/* PROGRESS BAR */
const Progress = ({ value = 0 }) => (
  <div className="w-full h-2 bg-purple-200 rounded-full">
    <div
      className="h-2 bg-purple-700 rounded-full"
      style={{ width: `${Math.min(value || 0, 100)}%` }}
    />
  </div>
);

/* INFO CARD */
const InfoCard = ({ title, items, icon }) => {
  const Icon = iconMap[icon];

  return (
    <div className="bg-white border rounded-2xl p-5 shadow-sm">
      <div className="flex items-center gap-3 mb-4 text-purple-500">
        <Icon className="w-6 h-6" />
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      </div>

      <div className="flex flex-wrap gap-2">
        {items?.length ? (
          items.map((item, i) => (
            <span
              key={i}
              className="bg-purple-500 text-white px-3 py-1 rounded-xl text-sm"
            >
              {item}
            </span>
          ))
        ) : (
          <p className="text-gray-400 text-sm">None</p>
        )}
      </div>
    </div>
  );
};

export default AnalyzePage;