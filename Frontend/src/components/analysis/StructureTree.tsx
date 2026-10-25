import React from 'react';
import {
  Folder,
  FolderOpen,
  Server,
  Layout,
  Database,
  TestTube2,
  FileCheck2,
  Workflow
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface StructureTreeProps {
  structure: string[];
}

export const StructureTree: React.FC<StructureTreeProps> = ({ structure }) => {
  const { isDark } = useTheme();

  // Split into Backend and Frontendrepo
  const backendDirs = structure.filter((p) => p.startsWith('Backend'));
  const frontendDirs = structure.filter((p) => p.startsWith('Frontendrepo'));
  const otherDirs = structure.filter((p) => !p.startsWith('Backend') && !p.startsWith('Frontendrepo'));

  return (
    <div
      className={`p-6 rounded-2xl border transition-colors ${
        isDark
          ? 'bg-[#1E2328] border-[#5B6770]/40 text-[#FFF4D6]'
          : 'bg-white border-neutral-200 text-slate-900 shadow-xs'
      }`}
    >
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b ${
        isDark ? 'border-slate-800' : 'border-slate-200'
      }`}>
        <div>
          <h3 className={`text-lg font-bold flex items-center gap-2 ${
            isDark ? 'text-[#FFF4D6]' : 'text-slate-900'
          }`}>
            <Workflow className="w-5 h-5 text-[#F2C14E]" />
            <span>Repository Architectural Structure</span>
          </h3>
          <p className={`text-xs mt-0.5 ${
            isDark ? 'text-slate-300' : 'text-slate-600'
          }`}>
            Recognized architectural layers across backend services, orchestrators, tests, and frontend UI components.
          </p>
        </div>

        <div className={`text-xs font-mono ${
          isDark ? 'text-slate-400' : 'text-slate-500'
        }`}>
          <span>{structure.length} Architectural Directories</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Backend Architecture */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#F2C14E]">
            <Server className="w-4 h-4" />
            <span>Backend Layer (Express, Redis & Prisma)</span>
          </div>

          <div
            className={`p-4 rounded-xl border font-mono text-xs space-y-1.5 max-h-96 overflow-y-auto ${
              isDark
                ? 'bg-slate-900/60 border-slate-800 text-slate-200'
                : 'bg-neutral-50 border-neutral-200 text-slate-700'
            }`}
          >
            {backendDirs.map((dir) => {
              const depth = (dir.match(/\//g) || []).length;
              const name = dir.split('/').pop();
              const isTest = dir.includes('test');
              const isPrisma = dir.includes('prisma');

              return (
                <div
                  key={dir}
                  className={`flex items-center gap-2 py-0.5 transition-colors ${
                    isDark ? 'hover:text-[#F2C14E]' : 'hover:text-amber-700'
                  }`}
                  style={{ paddingLeft: `${depth * 14}px` }}
                >
                  {isTest ? (
                    <TestTube2 className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                  ) : isPrisma ? (
                    <Database className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  ) : depth === 0 ? (
                    <FolderOpen className="w-3.5 h-3.5 text-[#F2C14E] shrink-0" />
                  ) : (
                    <Folder className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  )}
                  <span>{name}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Frontend Architecture */}
        <div className="space-y-3">
          <div className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wider ${
            isDark ? 'text-cyan-300' : 'text-cyan-700'
          }`}>
            <Layout className="w-4 h-4" />
            <span>Frontend Layer (React, Context & Components)</span>
          </div>

          <div
            className={`p-4 rounded-xl border font-mono text-xs space-y-1.5 max-h-96 overflow-y-auto ${
              isDark
                ? 'bg-slate-900/60 border-slate-800 text-slate-200'
                : 'bg-neutral-50 border-neutral-200 text-slate-700'
            }`}
          >
            {frontendDirs.map((dir) => {
              const depth = (dir.match(/\//g) || []).length;
              const name = dir.split('/').pop();
              const isCharts = dir.includes('charts');

              return (
                <div
                  key={dir}
                  className="flex items-center gap-2 py-0.5 hover:text-cyan-400 transition-colors"
                  style={{ paddingLeft: `${depth * 14}px` }}
                >
                  {depth === 0 ? (
                    <FolderOpen className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  ) : isCharts ? (
                    <FileCheck2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  ) : (
                    <Folder className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  )}
                  <span>{name}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
