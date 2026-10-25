import React, { useState } from 'react';
import {
  Sparkles,
  Layers,
  FileCode,
  Flame,
  ChevronDown,
  ChevronUp,
  FileText,
  Activity,
  CheckCircle2
} from 'lucide-react';
import { AnalysisRole, MatchedRoleSignal } from '../../types/analysis';
import { useTheme } from '../../context/ThemeContext';

interface RoleSignalsDetailProps {
  role: AnalysisRole;
}

const SIGNAL_FRIENDLY_NAMES: Record<string, string> = {
  express_routing: 'Express Routing & Route Handlers',
  express_middleware: 'Express Middleware Registration',
  token_authentication: 'JWT Token Authentication & Verification',
  state_management: 'React State Management & Context',
  testing: 'Vitest Unit & Integration Test Suites',
  error_handling: 'Defensive Error Handling (try / catch)',
};

export const RoleSignalsDetail: React.FC<RoleSignalsDetailProps> = ({ role }) => {
  const { isDark } = useTheme();
  const [expandedSignalName, setExpandedSignalName] = useState<string | null>(null);

  const toggleExpand = (signalName: string) => {
    setExpandedSignalName((prev) => (prev === signalName ? null : signalName));
  };

  return (
    <div
      className={`p-6 rounded-2xl border transition-colors ${
        isDark
          ? 'bg-[#1E2328] border-[#5B6770]/40 text-[#FFF4D6]'
          : 'bg-white border-neutral-200 text-slate-900 shadow-xs'
      }`}
    >
      {/* Title & Role Info */}
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b ${
        isDark ? 'border-slate-800' : 'border-slate-200'
      }`}>
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-[#F2C14E] mb-1">
            Active Role Signal Evaluation
          </div>
          <h3 className={`text-xl font-bold flex items-center gap-2 ${
            isDark ? 'text-[#FFF4D6]' : 'text-slate-900'
          }`}>
            <span>{role.title}</span>
            <span className={`text-xs px-2 py-0.5 rounded font-mono font-medium ${
              isDark ? 'bg-slate-800 text-slate-200' : 'bg-slate-100 text-slate-700'
            }`}>
              Rank #{role.rank}
            </span>
          </h3>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <div>
            <span className={isDark ? 'text-slate-300' : 'text-slate-600'}>Total Score:</span>{' '}
            <strong className="font-mono text-base font-bold text-[#F2C14E] tabular-nums">
              {role.finalScore.toFixed(1)}
            </strong>
          </div>
          <div>
            <span className={isDark ? 'text-slate-300' : 'text-slate-600'}>Confidence:</span>{' '}
            <strong className="font-mono text-base font-bold text-emerald-400 tabular-nums">
              {role.confidence.toFixed(1)}%
            </strong>
          </div>
        </div>
      </div>

      {/* Signal Cards Grid */}
      <div className="space-y-3">
        {role.matchedSignals.map((sig) => {
          const isExpanded = expandedSignalName === sig.signal;
          const friendlyName = SIGNAL_FRIENDLY_NAMES[sig.signal] || sig.signal;
          const fileEntries = Object.entries(sig.filePaths || {});

          return (
            <div
              key={sig.signal}
              className={`rounded-xl border transition-all ${
                isDark
                  ? 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  : 'bg-neutral-50/70 border-neutral-200 hover:border-neutral-300'
              }`}
            >
              {/* Signal Header Bar */}
              <div
                onClick={() => toggleExpand(sig.signal)}
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer select-none"
              >
                <div className="flex items-start sm:items-center gap-3">
                  <div className="p-2 rounded-lg bg-[#F2C14E]/15 text-[#F2C14E] shrink-0 mt-0.5 sm:mt-0">
                    <Activity className="w-4 h-4" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`font-bold text-sm sm:text-base ${
                        isDark ? 'text-[#FFF4D6]' : 'text-slate-900'
                      }`}>
                        {friendlyName}
                      </span>
                      <span className={`font-mono text-[11px] ${
                        isDark ? 'text-slate-400' : 'text-slate-500'
                      }`}>
                        ({sig.signal})
                      </span>
                    </div>

                    <div className={`flex flex-wrap items-center gap-x-3 gap-y-1 text-xs mt-1 ${
                      isDark ? 'text-slate-300' : 'text-slate-600'
                    }`}>
                      <span>
                        Occurrences: <strong className={`font-mono font-semibold tabular-nums ${
                          isDark ? 'text-[#FFF4D6]' : 'text-slate-900'
                        }`}>{sig.occurrences}</strong>
                      </span>
                      <span>·</span>
                      <span>
                        Files: <strong className={`font-mono font-semibold tabular-nums ${
                          isDark ? 'text-[#FFF4D6]' : 'text-slate-900'
                        }`}>{sig.distribution}</strong>
                      </span>
                      <span>·</span>
                      <span>
                        Strength: <strong className="text-amber-500 dark:text-amber-400 font-semibold">{sig.strength === 3 ? 'High (3/3)' : 'Standard (2/3)'}</strong>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Score & Expand Button */}
                <div className={`flex items-center justify-between sm:justify-end gap-4 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 ${
                  isDark ? 'border-slate-800' : 'border-slate-200'
                }`}>
                  <div className="text-right">
                    <div className={`text-xs font-medium ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Weighted Points</div>
                    <div className="font-mono font-bold text-base text-[#F2C14E] tabular-nums">
                      +{sig.weightedPoints.toFixed(1)}
                      {sig.depthBonus > 0 && (
                        <span className="text-[11px] font-normal text-emerald-400 ml-1">
                          (+{sig.depthBonus.toFixed(1)} bonus)
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    className={`p-1 rounded-md transition-colors ${
                      isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-800'
                    }`}
                    aria-label={isExpanded ? 'Collapse signal files' : 'Expand signal files'}
                  >
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Expanded File Distribution Panel */}
              {isExpanded && (
                <div className={`px-4 pb-4 pt-1 border-t ${
                  isDark ? 'border-slate-800/80' : 'border-slate-200'
                }`}>
                  <div className={`text-xs font-semibold mb-2 flex items-center gap-1.5 ${
                    isDark ? 'text-slate-300' : 'text-slate-600'
                  }`}>
                    <FileCode className="w-3.5 h-3.5 text-slate-400" />
                    <span>Distribution Across {fileEntries.length} Source Files:</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {fileEntries.map(([filePath, count]) => (
                      <div
                        key={filePath}
                        className={`flex items-center justify-between px-3 py-2 rounded-lg font-mono text-[11px] ${
                          isDark
                            ? 'bg-slate-950/70 text-slate-200 border border-slate-800/60'
                            : 'bg-white text-slate-800 border border-neutral-200'
                        }`}
                      >
                        <span className="truncate pr-2" title={filePath}>
                          {filePath}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-[#F2C14E]/20 text-[#F2C14E] font-bold tabular-nums shrink-0">
                          {Number(count)} hit{Number(count) > 1 ? 's' : ''}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Math breakdown footnote */}
                  <div className={`mt-3 text-[11px] flex items-center gap-2 ${
                    isDark ? 'text-slate-300' : 'text-slate-600'
                  }`}>
                    <Sparkles className="w-3 h-3 text-[#F2C14E]" />
                    <span>
                      Scoring calculation: Base points ({sig.points}) + Depth bonus ({sig.depthBonus}) = {sig.weightedPoints} pts
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
