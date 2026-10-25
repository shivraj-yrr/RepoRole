import React, { useState } from 'react';
import {
  Sparkles,
  Award,
  ChevronDown,
  ChevronUp,
  FileCode,
  Layers,
  Zap,
  CheckCircle,
  Loader2,
  FolderGit2
} from 'lucide-react';
import { RoleCard, MatchedSignal } from '../../types/dashboard';
import { useTheme } from '../../context/ThemeContext';

interface RoleCardsSectionProps {
  cards: RoleCard[] | null;
  isLoading: boolean;
  error?: string | null;
}

export const RoleCardsSection: React.FC<RoleCardsSectionProps> = ({
  cards,
  isLoading,
  error,
}) => {
  const { isDark } = useTheme();
  const [expandedSignalId, setExpandedSignalId] = useState<string | null>(null);

  const toggleSignal = (signalKey: string) => {
    setExpandedSignalId((prev) => (prev === signalKey ? null : signalKey));
  };

  return (
    <section id="role-evaluations-section" className="w-full space-y-5">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-[#F2C14E]/20 text-[#F2C14E] border border-[#F2C14E]/40">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
              Engineering Role Matches
            </h2>
            <p
              className={`text-xs sm:text-sm ${
                isDark ? 'text-[#FFF4D6]/70' : 'text-[#2A2F35]/70'
              }`}
            >
              Evaluated via deep AST parsing and code signal analysis
            </p>
          </div>
        </div>

        {cards && cards.length > 0 && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#F2C14E] text-[#2A2F35] shadow-xs self-start sm:self-center">
            <Award className="w-3.5 h-3.5" />
            {cards.length} {cards.length === 1 ? 'Role Matched' : 'Roles Matched'}
          </span>
        )}
      </div>

      {/* Loading state for /card while /me is already rendered */}
      {isLoading && (
        <div
          id="card-loading-state"
          className={`w-full rounded-2xl border p-8 flex flex-col items-center justify-center text-center gap-4 animate-in fade-in duration-300 ${
            isDark
              ? 'bg-[#1E2328] border-[#5B6770]/40 text-[#FFF4D6]'
              : 'bg-white border-[#5B6770]/25 text-[#2A2F35]'
          }`}
        >
          <div className="relative">
            <div className="w-12 h-12 rounded-full border-4 border-[#F2C14E]/20 border-t-[#F2C14E] animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center text-[#F2C14E]">
              <Zap className="w-5 h-5 animate-pulse" />
            </div>
          </div>
          <div className="space-y-1.5 max-w-md">
            <h3 className="font-bold text-lg">Synthesizing Role Signals...</h3>
            <p
              className={`text-xs sm:text-sm ${
                isDark ? 'text-[#FFF4D6]/70' : 'text-[#2A2F35]/70'
              }`}
            >
              Deep AST evaluation from the repository analysis endpoint is computing matched code patterns and confidence scores.
            </p>
          </div>
        </div>
      )}

      {/* Error state */}
      {!isLoading && error && (
        <div
          className={`w-full rounded-xl border p-4 text-xs sm:text-sm flex items-center gap-3 ${
            isDark
              ? 'bg-amber-950/30 border-amber-800/50 text-amber-200'
              : 'bg-amber-50 border-amber-200 text-amber-900'
          }`}
        >
          <Zap className="w-5 h-5 shrink-0 text-amber-500" />
          <span>{error}</span>
        </div>
      )}

      {/* Rendered Role Cards */}
      {!isLoading && cards && cards.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {cards.map((card, idx) => {
            const levelLabel = card.suggestedLevel || card.level || 'junior';
            const scorePercentage = Math.min(100, Math.max(0, card.finalScore));

            return (
              <div
                key={card.roleId || `role-${idx}`}
                id={`role-card-${card.roleId}`}
                className={`rounded-2xl border p-6 flex flex-col justify-between transition-all duration-200 shadow-md relative overflow-hidden ${
                  isDark
                    ? 'bg-[#1E2328] border-[#5B6770]/50 text-[#FFF4D6]'
                    : 'bg-white border-[#5B6770]/25 text-[#2A2F35]'
                }`}
              >
                <div>
                  {/* Top Bar: Title & Level Badge */}
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        {card.rank && (
                          <span className="w-6 h-6 rounded-full bg-[#F2C14E] text-[#2A2F35] font-extrabold text-xs flex items-center justify-center shrink-0">
                            #{card.rank}
                          </span>
                        )}
                        <h3 className="text-xl font-extrabold tracking-tight">
                          {card.title}
                        </h3>
                      </div>
                      <p
                        className={`text-xs font-mono uppercase tracking-wider ${
                          isDark ? 'text-[#FFF4D6]/60' : 'text-[#2A2F35]/60'
                        }`}
                      >
                        ID: {card.roleId}
                      </p>
                    </div>

                    {/* Suggested Level Pill */}
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#F2C14E]/20 text-[#F2C14E] border border-[#F2C14E]/40 shrink-0">
                      {levelLabel}
                    </span>
                  </div>

                  {/* Score & Confidence Overview */}
                  <div
                    className={`grid grid-cols-3 gap-3 p-3.5 rounded-xl mb-5 text-center ${
                      isDark ? 'bg-[#2A2F35]/70' : 'bg-[#FFF4D6]/50'
                    }`}
                  >
                    <div>
                      <div className="text-xl sm:text-2xl font-extrabold text-[#F2C14E]">
                        {card.finalScore.toFixed(1)}%
                      </div>
                      <div
                        className={`text-[11px] font-semibold uppercase tracking-wider ${
                          isDark ? 'text-[#FFF4D6]/60' : 'text-[#2A2F35]/60'
                        }`}
                      >
                        Final Score
                      </div>
                    </div>
                    <div>
                      <div className="text-xl sm:text-2xl font-extrabold">
                        {card.rawScore || 'N/A'}
                      </div>
                      <div
                        className={`text-[11px] font-semibold uppercase tracking-wider ${
                          isDark ? 'text-[#FFF4D6]/60' : 'text-[#2A2F35]/60'
                        }`}
                      >
                        Raw Score
                      </div>
                    </div>
                    <div>
                      <div className="text-xl sm:text-2xl font-extrabold text-[#F2C14E]">
                        {card.confidence !== undefined ? `${card.confidence.toFixed(1)}%` : 'N/A'}
                      </div>
                      <div
                        className={`text-[11px] font-semibold uppercase tracking-wider ${
                          isDark ? 'text-[#FFF4D6]/60' : 'text-[#2A2F35]/60'
                        }`}
                      >
                        Confidence
                      </div>
                    </div>
                  </div>

                  {/* Visual Progress Bar */}
                  <div className="mb-5 space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className={isDark ? 'text-[#FFF4D6]/70' : 'text-[#2A2F35]/70'}>
                        Role Proficiency Match
                      </span>
                      <span className="text-[#F2C14E] font-bold">
                        {scorePercentage.toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full h-2.5 rounded-full bg-[#5B6770]/30 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#F2C14E] to-[#F5B838] rounded-full transition-all duration-500"
                        style={{ width: `${scorePercentage}%` }}
                      />
                    </div>
                  </div>

                  {/* Matched Signals Section */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 text-[#F2C14E]">
                        <Layers className="w-3.5 h-3.5" />
                        Matched AST Signals ({card.matchedSignals?.length || 0})
                      </span>
                      <span
                        className={`text-[11px] ${
                          isDark ? 'text-[#FFF4D6]/60' : 'text-[#2A2F35]/60'
                        }`}
                      >
                        Click signal to view file paths
                      </span>
                    </div>

                    <div className="space-y-2.5">
                      {card.matchedSignals?.map((signal: MatchedSignal, sigIdx: number) => {
                        const signalKey = `${card.roleId}-${signal.signal}-${sigIdx}`;
                        const isExpanded = expandedSignalId === signalKey;
                        const fileCount = signal.filePaths
                          ? Object.keys(signal.filePaths).length
                          : 0;

                        return (
                          <div
                            key={signalKey}
                            className={`rounded-xl border transition-all duration-150 overflow-hidden ${
                              isDark
                                ? 'bg-[#2A2F35]/50 border-[#5B6770]/40'
                                : 'bg-neutral-50 border-[#5B6770]/20'
                            }`}
                          >
                            {/* Signal summary button */}
                            <button
                              type="button"
                              onClick={() => toggleSignal(signalKey)}
                              className="w-full p-3 flex items-center justify-between text-left focus:outline-none focus:ring-1 focus:ring-[#F2C14E]"
                            >
                              <div className="flex items-center gap-2.5 flex-wrap">
                                <span className="font-bold text-sm tracking-tight capitalize">
                                  {signal.signal.replace(/_/g, ' ')}
                                </span>

                                {signal.repo && (
                                  <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md bg-[#5B6770]/20 font-mono">
                                    <FolderGit2 className="w-3 h-3 text-[#F2C14E]" />
                                    {signal.repo}
                                  </span>
                                )}

                                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#F2C14E]/20 text-[#F2C14E]">
                                  Score: {signal.score} pts
                                </span>
                              </div>

                              <div className="flex items-center gap-3 shrink-0 ml-2">
                                <span
                                  className={`text-xs ${
                                    isDark ? 'text-[#FFF4D6]/70' : 'text-[#2A2F35]/70'
                                  }`}
                                >
                                  {fileCount} {fileCount === 1 ? 'file' : 'files'}
                                </span>
                                {isExpanded ? (
                                  <ChevronUp className="w-4 h-4 text-[#F2C14E]" />
                                ) : (
                                  <ChevronDown className="w-4 h-4" />
                                )}
                              </div>
                            </button>

                            {/* Expanded Signal Details & AST File Locations */}
                            {isExpanded && (
                              <div
                                className={`px-3.5 pb-3.5 pt-1 border-t space-y-3 ${
                                  isDark
                                    ? 'border-[#5B6770]/30 bg-[#1E2328]/60'
                                    : 'border-[#5B6770]/15 bg-white'
                                }`}
                              >
                                {/* Metrics breakdown */}
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-center text-xs">
                                  <div className="p-2 rounded-lg bg-[#5B6770]/10">
                                    <span className="font-extrabold text-[#F2C14E]">
                                      {signal.occurrences ?? 0}
                                    </span>
                                    <p className="text-[10px] uppercase opacity-75">Occurrences</p>
                                  </div>
                                  <div className="p-2 rounded-lg bg-[#5B6770]/10">
                                    <span className="font-extrabold text-[#F2C14E]">
                                      {signal.distribution ?? 0}
                                    </span>
                                    <p className="text-[10px] uppercase opacity-75">Distribution</p>
                                  </div>
                                  <div className="p-2 rounded-lg bg-[#5B6770]/10">
                                    <span className="font-extrabold text-[#F2C14E]">
                                      {signal.depthBonus ?? 0}
                                    </span>
                                    <p className="text-[10px] uppercase opacity-75">Depth Bonus</p>
                                  </div>
                                  <div className="p-2 rounded-lg bg-[#5B6770]/10">
                                    <span className="font-extrabold text-[#F2C14E]">
                                      {signal.strength ?? 1}
                                    </span>
                                    <p className="text-[10px] uppercase opacity-75">Strength</p>
                                  </div>
                                </div>

                                {/* File paths listing */}
                                {signal.filePaths && Object.keys(signal.filePaths).length > 0 && (
                                  <div className="space-y-1.5 pt-1">
                                    <p className="text-[11px] font-semibold uppercase tracking-wider flex items-center gap-1 opacity-75">
                                      <FileCode className="w-3 h-3 text-[#F2C14E]" />
                                      Evidence AST Locations:
                                    </p>
                                    <div className="max-h-40 overflow-y-auto space-y-1 pr-1 font-mono text-xs">
                                      {Object.entries(signal.filePaths).map(([path, count]) => (
                                        <div
                                          key={path}
                                          className={`flex items-center justify-between p-1.5 rounded-md ${
                                            isDark
                                              ? 'bg-[#2A2F35]/70 text-[#FFF4D6]'
                                              : 'bg-neutral-100 text-[#2A2F35]'
                                          }`}
                                        >
                                          <span className="truncate pr-2" title={path}>
                                            {path}
                                          </span>
                                          <span className="shrink-0 px-1.5 py-0.2 rounded bg-[#F2C14E]/20 text-[#F2C14E] font-bold text-[10px]">
                                            {count}x
                                          </span>
                                        </div>
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
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default RoleCardsSection;
