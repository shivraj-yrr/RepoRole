import React, { useState, useMemo } from 'react';
import {
  FileCode,
  Search,
  Check,
  Server,
  Layout,
  TestTube2,
  Settings,
  FileCheck
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface SelectedFilesListProps {
  files: string[];
}

export const SelectedFilesList: React.FC<SelectedFilesListProps> = ({ files }) => {
  const { isDark } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'backend' | 'frontend' | 'test' | 'config'>('all');

  const categorizedFiles = useMemo(() => {
    return files.map((file) => {
      let category: 'backend' | 'frontend' | 'test' | 'config' = 'backend';
      if (file.includes('test') || file.includes('.test.')) {
        category = 'test';
      } else if (file.startsWith('Frontendrepo')) {
        category = 'frontend';
      } else if (file.includes('config') || file.endsWith('.json') || file.includes('prisma')) {
        category = 'config';
      } else {
        category = 'backend';
      }
      return { file, category };
    });
  }, [files]);

  const filteredFiles = useMemo(() => {
    return categorizedFiles.filter(({ file, category }) => {
      if (selectedFilter !== 'all' && category !== selectedFilter) {
        return false;
      }
      if (searchQuery.trim() && !file.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      return true;
    });
  }, [categorizedFiles, selectedFilter, searchQuery]);

  const counts = useMemo(() => {
    return {
      all: files.length,
      backend: categorizedFiles.filter((f) => f.category === 'backend').length,
      frontend: categorizedFiles.filter((f) => f.category === 'frontend').length,
      test: categorizedFiles.filter((f) => f.category === 'test').length,
      config: categorizedFiles.filter((f) => f.category === 'config').length,
    };
  }, [files, categorizedFiles]);

  return (
    <div
      className={`p-6 rounded-2xl border transition-colors ${
        isDark
          ? 'bg-[#1E2328] border-[#5B6770]/40 text-[#FFF4D6]'
          : 'bg-white border-neutral-200 text-slate-900 shadow-xs'
      }`}
    >
      <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b ${
        isDark ? 'border-slate-800' : 'border-slate-200'
      }`}>
        <div>
          <h3 className={`text-lg font-bold flex items-center gap-2 ${
            isDark ? 'text-[#FFF4D6]' : 'text-slate-900'
          }`}>
            <FileCode className="w-5 h-5 text-[#F2C14E]" />
            <span>Key Evaluated Source Files ({files.length})</span>
          </h3>
          <p className={`text-xs mt-0.5 ${
            isDark ? 'text-slate-300' : 'text-slate-600'
          }`}>
            Core source files inspected during static AST analysis, routing pipeline, and scoring engine.
          </p>
        </div>

        <div className={`flex items-center gap-1.5 p-1 rounded-xl text-xs ${
          isDark ? 'bg-slate-900/90' : 'bg-slate-100'
        }`}>
          <button
            type="button"
            onClick={() => setSelectedFilter('all')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
              selectedFilter === 'all'
                ? isDark
                  ? 'bg-slate-800 text-[#FFF4D6] shadow-xs'
                  : 'bg-white text-slate-900 shadow-xs'
                : isDark
                ? 'text-slate-400 hover:text-[#FFF4D6]'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All ({counts.all})
          </button>
          <button
            type="button"
            onClick={() => setSelectedFilter('backend')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
              selectedFilter === 'backend'
                ? isDark
                  ? 'bg-slate-800 text-[#FFF4D6] shadow-xs'
                  : 'bg-white text-slate-900 shadow-xs'
                : isDark
                ? 'text-slate-400 hover:text-[#FFF4D6]'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Backend ({counts.backend})
          </button>
          <button
            type="button"
            onClick={() => setSelectedFilter('frontend')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
              selectedFilter === 'frontend'
                ? isDark
                  ? 'bg-slate-800 text-[#FFF4D6] shadow-xs'
                  : 'bg-white text-slate-900 shadow-xs'
                : isDark
                ? 'text-slate-400 hover:text-[#FFF4D6]'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Frontend ({counts.frontend})
          </button>
          <button
            type="button"
            onClick={() => setSelectedFilter('test')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
              selectedFilter === 'test'
                ? isDark
                  ? 'bg-slate-800 text-[#FFF4D6] shadow-xs'
                  : 'bg-white text-slate-900 shadow-xs'
                : isDark
                ? 'text-slate-400 hover:text-[#FFF4D6]'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Tests ({counts.test})
          </button>
          <button
            type="button"
            onClick={() => setSelectedFilter('config')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
              selectedFilter === 'config'
                ? isDark
                  ? 'bg-slate-800 text-[#FFF4D6] shadow-xs'
                  : 'bg-white text-slate-900 shadow-xs'
                : isDark
                ? 'text-slate-400 hover:text-[#FFF4D6]'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Config ({counts.config})
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative mb-4">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filter files by name or directory path..."
          className={`w-full pl-9 pr-3 py-2 text-xs rounded-xl border focus:outline-none focus:ring-1 focus:ring-[#F2C14E] transition-colors ${
            isDark
              ? 'bg-slate-900/80 border-slate-700 text-[#FFF4D6] placeholder-slate-500'
              : 'bg-white border-neutral-300 text-slate-900 placeholder-slate-400'
          }`}
        />
      </div>

      {/* Files Grid / List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 max-h-96 overflow-y-auto pr-1">
        {filteredFiles.map(({ file, category }) => (
          <div
            key={file}
            className={`flex items-center justify-between p-2.5 rounded-xl border font-mono text-xs ${
              isDark
                ? 'bg-slate-900/50 border-slate-800 hover:border-slate-700 text-slate-200'
                : 'bg-neutral-50/70 border-neutral-200 hover:border-neutral-300 text-slate-800'
            }`}
          >
            <div className="flex items-center gap-2 truncate pr-2">
              {category === 'backend' ? (
                <Server className="w-3.5 h-3.5 text-[#F2C14E] shrink-0" />
              ) : category === 'frontend' ? (
                <Layout className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              ) : category === 'test' ? (
                <TestTube2 className="w-3.5 h-3.5 text-purple-400 shrink-0" />
              ) : (
                <Settings className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              )}
              <span className="truncate" title={file}>
                {file}
              </span>
            </div>

            <span
              className={`text-[10px] px-1.5 py-0.5 rounded font-sans uppercase font-bold shrink-0 ${
                category === 'backend'
                  ? 'bg-amber-500/15 text-[#F2C14E]'
                  : category === 'frontend'
                  ? 'bg-cyan-500/15 text-cyan-400'
                  : category === 'test'
                  ? 'bg-purple-500/15 text-purple-400'
                  : 'bg-slate-500/15 text-slate-400'
              }`}
            >
              {category}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
