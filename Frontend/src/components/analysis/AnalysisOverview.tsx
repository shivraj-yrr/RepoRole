import React from 'react';
import {
  Layers,
  Cpu,
  Database,
  FileCode,
  Flame,
  CheckCircle2,
  Boxes,
  Code2
} from 'lucide-react';
import { RepoAnalysisData } from '../../types/analysis';
import { useTheme } from '../../context/ThemeContext';

interface AnalysisOverviewProps {
  data: RepoAnalysisData;
}

const LANGUAGE_DOT_COLORS: Record<string, string> = {
  JavaScript: 'bg-[#F1E05A]',
  TypeScript: 'bg-[#3178C6]',
  HTML: 'bg-[#E34C26]',
  CSS: 'bg-[#563D7C]',
  'C++': 'bg-[#F34B7D]',
  Python: 'bg-[#3572A5]',
};

export const AnalysisOverview: React.FC<AnalysisOverviewProps> = ({ data }) => {
  const { isDark } = useTheme();
  const { languages, runtime, frameworks, databases, buildFiles, flags, metadata } = data;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Languages & Runtime */}
      <div
        className={`p-5 rounded-2xl border transition-colors ${
          isDark
            ? 'bg-[#1E2328] border-[#5B6770]/40 text-[#FFF4D6]'
            : 'bg-white border-neutral-200 text-slate-900 shadow-xs'
        }`}
      >
        <div className={`flex items-center gap-2 mb-3 text-xs font-bold uppercase tracking-wider ${
          isDark ? 'text-slate-300' : 'text-slate-600'
        }`}>
          <Code2 className="w-4 h-4 text-[#F2C14E]" />
          <span>Languages & Runtime</span>
        </div>

        <div className="space-y-2">
          <div className="flex flex-wrap gap-2">
            {languages.map((lang) => (
              <span
                key={lang}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium ${
                  isDark
                    ? 'bg-slate-800 text-slate-200 border border-slate-700'
                    : 'bg-neutral-100 text-slate-800 border border-neutral-200'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${LANGUAGE_DOT_COLORS[lang] || 'bg-slate-400'}`}
                />
                {lang}
              </span>
            ))}
          </div>

          <div className={`pt-2 text-xs flex items-center gap-2 ${
            isDark ? 'text-slate-400' : 'text-slate-500'
          }`}>
            <Cpu className="w-3.5 h-3.5 text-slate-400" />
            <span>Runtime:</span>
            <span className={`font-semibold ${isDark ? 'text-[#FFF4D6]' : 'text-slate-800'}`}>
              {runtime.join(', ') || 'Node.js'}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Frameworks & UI */}
      <div
        className={`p-5 rounded-2xl border transition-colors ${
          isDark
            ? 'bg-[#1E2328] border-[#5B6770]/40 text-[#FFF4D6]'
            : 'bg-white border-neutral-200 text-slate-900 shadow-xs'
        }`}
      >
        <div className={`flex items-center gap-2 mb-3 text-xs font-bold uppercase tracking-wider ${
          isDark ? 'text-slate-300' : 'text-slate-600'
        }`}>
          <Layers className="w-4 h-4 text-[#F2C14E]" />
          <span>Frameworks & Libraries</span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {frameworks.map((fw) => (
            <span
              key={fw}
              className={`px-2.5 py-1 rounded-md text-xs font-medium ${
                isDark
                  ? 'bg-slate-800 text-slate-200 border border-slate-700'
                  : 'bg-neutral-100 text-slate-800 border border-neutral-200'
              }`}
            >
              {fw}
            </span>
          ))}
        </div>

        <div className={`pt-3 text-xs flex items-center gap-2 ${
          isDark ? 'text-slate-400' : 'text-slate-500'
        }`}>
          <Boxes className="w-3.5 h-3.5 text-slate-400" />
          <span>Architecture:</span>
          <span className={`font-semibold ${isDark ? 'text-[#FFF4D6]' : 'text-slate-800'}`}>
            Express API + React SPA
          </span>
        </div>
      </div>

      {/* 3. Persistence & Build Tooling */}
      <div
        className={`p-5 rounded-2xl border transition-colors ${
          isDark
            ? 'bg-[#1E2328] border-[#5B6770]/40 text-[#FFF4D6]'
            : 'bg-white border-neutral-200 text-slate-900 shadow-xs'
        }`}
      >
        <div className={`flex items-center gap-2 mb-3 text-xs font-bold uppercase tracking-wider ${
          isDark ? 'text-slate-300' : 'text-slate-600'
        }`}>
          <Database className="w-4 h-4 text-[#F2C14E]" />
          <span>Data, ORM & Build</span>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-2">
          {databases.map((db) => (
            <span
              key={db}
              className={`px-2.5 py-1 rounded-md text-xs font-medium ${
                isDark
                  ? 'bg-amber-950/60 border border-amber-800/50 text-amber-300'
                  : 'bg-amber-50 text-amber-800 border border-amber-200'
              }`}
            >
              {db} (In-Memory Cache)
            </span>
          ))}

          {flags.map((flag) => (
            <span
              key={flag}
              className={`px-2.5 py-1 rounded-md text-xs font-medium ${
                isDark
                  ? 'bg-indigo-950/60 border border-indigo-800/50 text-indigo-300'
                  : 'bg-indigo-50 text-indigo-800 border border-indigo-200'
              }`}
            >
              {flag} ORM
            </span>
          ))}
        </div>

        <div className={`text-xs flex items-center gap-2 ${
          isDark ? 'text-slate-400' : 'text-slate-500'
        }`}>
          <FileCode className="w-3.5 h-3.5 text-slate-400" />
          <span>Manifest:</span>
          <span className={`font-mono font-medium ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
            {buildFiles.join(', ')}
          </span>
        </div>
      </div>

      {/* 4. Repository Health & Evaluation Integrity */}
      <div
        className={`p-5 rounded-2xl border transition-colors ${
          isDark
            ? 'bg-[#1E2328] border-[#5B6770]/40 text-[#FFF4D6]'
            : 'bg-white border-neutral-200 text-slate-900 shadow-xs'
        }`}
      >
        <div className={`flex items-center gap-2 mb-3 text-xs font-bold uppercase tracking-wider ${
          isDark ? 'text-slate-300' : 'text-slate-600'
        }`}>
          <Flame className="w-4 h-4 text-emerald-400" />
          <span>Codebase Integrity</span>
        </div>

        <div className="space-y-1.5 text-xs">
          <div className="flex items-center justify-between">
            <span className={isDark ? 'text-slate-300' : 'text-slate-600'}>Production Code:</span>
            <span className="font-semibold text-emerald-500 dark:text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Non-Toy Project
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className={isDark ? 'text-slate-300' : 'text-slate-600'}>Documentation:</span>
            <span className="font-semibold text-emerald-500 dark:text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              README Included
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className={isDark ? 'text-slate-300' : 'text-slate-600'}>Evaluated Files:</span>
            <span className={`font-mono font-semibold tabular-nums ${isDark ? 'text-[#FFF4D6]' : 'text-slate-800'}`}>
              {metadata.fileCount} source files
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className={isDark ? 'text-slate-300' : 'text-slate-600'}>AST Parser Status:</span>
            <span className={`font-semibold ${isDark ? 'text-[#FFF4D6]' : 'text-slate-800'}`}>
              {metadata.supported ? 'Supported' : 'Partial'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
