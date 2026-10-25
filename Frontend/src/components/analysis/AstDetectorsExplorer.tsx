import React, { useState, useMemo } from 'react';
import {
  SlidersHorizontal,
  Search,
  CheckCircle,
  AlertTriangle,
  XCircle,
  FileCode,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Cpu
} from 'lucide-react';
import { DetailedSignalItem } from '../../types/analysis';
import { useTheme } from '../../context/ThemeContext';

interface AstDetectorsExplorerProps {
  detailedSignals: Record<string, DetailedSignalItem>;
}

export const AstDetectorsExplorer: React.FC<AstDetectorsExplorerProps> = ({
  detailedSignals,
}) => {
  const { isDark } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedDetectorKey, setExpandedDetectorKey] = useState<string | null>(null);

  const detectorEntries = useMemo(() => Object.entries(detailedSignals), [detailedSignals]);

  // Unique categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    detectorEntries.forEach(([_, item]) => {
      if (item.category) set.add(item.category);
    });
    return Array.from(set).sort();
  }, [detectorEntries]);

  // Filtered detectors
  const filteredDetectors = useMemo(() => {
    return detectorEntries.filter(([key, item]) => {
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesKey = key.toLowerCase().includes(q);
        const matchesName = item.definition.name.toLowerCase().includes(q);
        const matchesRep = item.definition.represents.toLowerCase().includes(q);
        const matchesCat = item.category.toLowerCase().includes(q);
        if (!matchesKey && !matchesName && !matchesRep && !matchesCat) return false;
      }
      return true;
    });
  }, [detectorEntries, selectedCategory, searchQuery]);

  const toggleExpand = (key: string) => {
    setExpandedDetectorKey((prev) => (prev === key ? null : key));
  };

  return (
    <div
      className={`p-6 rounded-2xl border transition-colors ${
        isDark
          ? 'bg-[#1E2328] border-[#5B6770]/40 text-[#FFF4D6]'
          : 'bg-white border-neutral-200 text-slate-900 shadow-xs'
      }`}
    >
      {/* Header */}
      <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b ${
        isDark ? 'border-slate-800' : 'border-slate-200'
      }`}>
        <div>
          <h3 className={`text-lg font-bold flex items-center gap-2 ${
            isDark ? 'text-[#FFF4D6]' : 'text-slate-900'
          }`}>
            <Cpu className="w-5 h-5 text-[#F2C14E]" />
            <span>AST Detector Specifications & Contract Rules</span>
          </h3>
          <p className={`text-xs mt-0.5 ${
            isDark ? 'text-slate-300' : 'text-slate-600'
          }`}>
            Semantic parser contracts verifying true code capabilities rather than raw package names.
          </p>
        </div>

        <div className={`text-xs font-mono tabular-nums ${
          isDark ? 'text-slate-400' : 'text-slate-600'
        }`}>
          Showing <strong className={isDark ? 'text-[#FFF4D6]' : 'text-slate-900'}>{filteredDetectors.length}</strong> of {detectorEntries.length} AST detectors
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-5">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search detector name, AST syntax, or rules..."
            className={`w-full pl-9 pr-3 py-2 text-xs rounded-xl border focus:outline-none focus:ring-1 focus:ring-[#F2C14E] transition-colors ${
              isDark
                ? 'bg-slate-900/80 border-slate-700 text-[#FFF4D6] placeholder-slate-500'
                : 'bg-white border-neutral-300 text-slate-900 placeholder-slate-400'
            }`}
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className={`text-xs px-3 py-2 rounded-xl border focus:outline-none focus:ring-1 focus:ring-[#F2C14E] transition-colors ${
            isDark
              ? 'bg-slate-900/80 border-slate-700 text-[#FFF4D6]'
              : 'bg-white border-neutral-300 text-slate-800'
          }`}
        >
          <option value="all">All Categories ({categories.length})</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Detectors List */}
      <div className="space-y-3">
        {filteredDetectors.map(([key, item]) => {
          const isExpanded = expandedDetectorKey === key;
          const fileCount = Object.keys(item.filePaths || {}).length;

          return (
            <div
              key={key}
              className={`rounded-xl border transition-all ${
                isDark
                  ? 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
                  : 'bg-neutral-50/70 border-neutral-200 hover:border-neutral-300'
              }`}
            >
              <div
                onClick={() => toggleExpand(key)}
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer select-none"
              >
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="font-mono text-xs font-bold text-[#F2C14E]">
                      {key}
                    </span>
                    <span className={`text-[11px] px-2 py-0.5 rounded font-medium ${
                      isDark ? 'bg-slate-800 text-slate-200 border border-slate-700' : 'bg-slate-200 text-slate-700'
                    }`}>
                      {item.category}
                    </span>
                  </div>
                  <p className={`text-xs leading-relaxed ${
                    isDark ? 'text-slate-300' : 'text-slate-600'
                  }`}>
                    {item.definition.represents}
                  </p>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0">
                  <div className={`flex items-center gap-3 text-xs font-mono ${
                    isDark ? 'text-slate-400' : 'text-slate-500'
                  }`}>
                    <span>
                      Hits:{' '}
                      <strong className={`tabular-nums ${
                        isDark ? 'text-[#FFF4D6]' : 'text-slate-900'
                      }`}>
                        {item.occurrences}
                      </strong>
                    </span>
                    <span>
                      Files:{' '}
                      <strong className={`tabular-nums ${
                        isDark ? 'text-[#FFF4D6]' : 'text-slate-900'
                      }`}>
                        {fileCount}
                      </strong>
                    </span>
                  </div>

                  <button
                    type="button"
                    className={`p-1 rounded-md transition-colors ${
                      isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-800'
                    }`}
                    aria-label={isExpanded ? 'Collapse rules' : 'Expand rules'}
                  >
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Expanded Verification Rulebook */}
              {isExpanded && (
                <div className={`px-4 pb-4 pt-2 border-t space-y-3 text-xs ${
                  isDark ? 'border-slate-800/80' : 'border-slate-200'
                }`}>
                  {/* Evidence Rules Matrix */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 pt-1">
                    {/* Valid Evidence */}
                    <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
                      <div className="flex items-center gap-1.5 font-bold mb-1 text-emerald-400">
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Valid Evidence Rule</span>
                      </div>
                      <p className={`text-[11px] leading-relaxed font-mono ${
                        isDark ? 'text-emerald-100' : 'text-emerald-950'
                      }`}>
                        {item.definition.validEvidence}
                      </p>
                    </div>

                    {/* Weak Evidence */}
                    <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300">
                      <div className="flex items-center gap-1.5 font-bold mb-1 text-amber-400">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>Weak Evidence Trap</span>
                      </div>
                      <p className={`text-[11px] leading-relaxed font-mono ${
                        isDark ? 'text-amber-100' : 'text-amber-950'
                      }`}>
                        {item.definition.weakEvidence}
                      </p>
                    </div>

                    {/* Invalid Evidence */}
                    <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300">
                      <div className="flex items-center gap-1.5 font-bold mb-1 text-rose-400">
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Disqualified Evidence</span>
                      </div>
                      <p className={`text-[11px] leading-relaxed font-mono ${
                        isDark ? 'text-rose-100' : 'text-rose-950'
                      }`}>
                        {item.definition.invalidEvidence}
                      </p>
                    </div>
                  </div>

                  {/* File Distribution List */}
                  {fileCount > 0 && (
                    <div className="pt-2">
                      <div className={`text-[11px] font-semibold mb-1.5 ${
                        isDark ? 'text-slate-300' : 'text-slate-600'
                      }`}>
                        Matched Source Files ({fileCount}):
                      </div>
                      <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto">
                        {Object.entries(item.filePaths).map(([path, count]) => (
                          <span
                            key={path}
                            className={`inline-flex items-center gap-1 px-2 py-1 rounded text-[11px] font-mono ${
                              isDark
                                ? 'bg-slate-800 text-slate-200 border border-slate-700'
                                : 'bg-slate-200 text-slate-800'
                            }`}
                          >
                            <span>{path}</span>
                            <span className="text-[#F2C14E] font-bold">({count})</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
