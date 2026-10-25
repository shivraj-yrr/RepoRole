import React from 'react';
import {
  Trophy,
  Target,
  Award,
  ChevronRight,
  TrendingUp,
  Percent,
  CheckCircle2
} from 'lucide-react';
import { AnalysisRole } from '../../types/analysis';
import { useTheme } from '../../context/ThemeContext';

interface RoleScoringSectionProps {
  roles: AnalysisRole[];
  selectedRoleId: string;
  onSelectRole: (roleId: string) => void;
}

export const RoleScoringSection: React.FC<RoleScoringSectionProps> = ({
  roles,
  selectedRoleId,
  onSelectRole,
}) => {
  const { isDark } = useTheme();

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className={`text-xl sm:text-2xl font-bold tracking-tight ${
            isDark ? 'text-[#FFF4D6]' : 'text-slate-900'
          }`}>
            Role Alignment & Scoring Engine
          </h2>
          <p className={`text-xs sm:text-sm mt-0.5 ${
            isDark ? 'text-slate-300' : 'text-slate-600'
          }`}>
            Evaluated against AST code contracts, depth bonuses, and production frequency signals.
          </p>
        </div>
        <div className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          <span>Select a role to inspect AST signals & evidence</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {roles.map((role) => {
          const isSelected = role.roleId === selectedRoleId;
          const isRank1 = role.rank === 1;

          return (
            <button
              key={role.roleId}
              type="button"
              onClick={() => onSelectRole(role.roleId)}
              className={`w-full text-left p-5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                isSelected
                  ? isDark
                    ? 'bg-[#1E2328] border-[#F2C14E] shadow-lg shadow-[#F2C14E]/10 ring-1 ring-[#F2C14E]'
                    : 'bg-white border-[#F2C14E] shadow-md shadow-[#F2C14E]/15 ring-1 ring-[#F2C14E]'
                  : isDark
                  ? 'bg-[#1E2328] border-[#5B6770]/40 hover:border-[#5B6770]'
                  : 'bg-white border-neutral-200 hover:border-neutral-300 shadow-xs'
              }`}
            >
              {/* Top Accent Strip for Selected */}
              {isSelected && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-[#F2C14E]" />
              )}

              <div>
                {/* Header: Rank + Level */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider ${
                        isRank1
                          ? 'bg-[#F2C14E]/20 text-[#F2C14E]'
                          : isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {isRank1 ? <Trophy className="w-3 h-3" /> : <Award className="w-3 h-3" />}
                      Rank #{role.rank}
                    </span>
                  </div>

                  <span className={`text-xs font-semibold capitalize ${
                    isDark ? 'text-slate-300' : 'text-slate-600'
                  }`}>
                    Suggested: <strong className={`uppercase tracking-wide ${
                      isDark ? 'text-[#FFF4D6]' : 'text-slate-900'
                    }`}>{role.suggestedLevel}</strong>
                  </span>
                </div>

                {/* Role Title */}
                <h3 className={`text-base sm:text-lg font-bold mb-3 leading-snug ${
                  isDark ? 'text-[#FFF4D6]' : 'text-slate-900'
                }`}>
                  {role.title}
                </h3>

                {/* Score & Progress Bar */}
                <div className="space-y-1.5 mb-4">
                  <div className="flex items-baseline justify-between text-xs">
                    <span className={isDark ? 'text-slate-300' : 'text-slate-600'}>Final Weighted Score</span>
                    <span className="text-xl font-extrabold tabular-nums font-mono text-[#F2C14E]">
                      {role.finalScore.toFixed(1)}
                      <span className={`text-xs font-normal ml-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>/ 100</span>
                    </span>
                  </div>

                  {/* Progress track */}
                  <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-amber-500 to-[#F2C14E] transition-all duration-500"
                      style={{ width: `${Math.min(role.finalScore, 100)}%` }}
                    />
                  </div>
                </div>

                {/* Key Metrics Grid */}
                <div className={`grid grid-cols-2 gap-2 text-xs py-2.5 border-t border-b ${
                  isDark ? 'border-slate-800' : 'border-slate-200'
                }`}>
                  <div>
                    <div className={`text-[11px] flex items-center gap-1 ${
                      isDark ? 'text-slate-400' : 'text-slate-500'
                    }`}>
                      <Target className="w-3 h-3 text-[#F2C14E]" />
                      <span>Raw Score</span>
                    </div>
                    <div className={`font-mono font-semibold tabular-nums mt-0.5 ${
                      isDark ? 'text-[#FFF4D6]' : 'text-slate-900'
                    }`}>
                      {role.rawScore}
                    </div>
                  </div>

                  <div>
                    <div className={`text-[11px] flex items-center gap-1 ${
                      isDark ? 'text-slate-400' : 'text-slate-500'
                    }`}>
                      <Percent className="w-3 h-3 text-emerald-400" />
                      <span>Confidence</span>
                    </div>
                    <div className={`font-mono font-semibold tabular-nums mt-0.5 ${
                      isDark ? 'text-[#FFF4D6]' : 'text-slate-900'
                    }`}>
                      {role.confidence.toFixed(1)}%
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom footer button prompt */}
              <div className={`mt-4 pt-2 flex items-center justify-between text-xs font-semibold ${
                isDark ? 'text-slate-300' : 'text-slate-600'
              }`}>
                <span>{role.matchedSignals.length} Matched Signals</span>
                <span
                  className={`flex items-center gap-0.5 font-bold transition-colors ${
                    isSelected ? 'text-[#F2C14E]' : 'hover:text-[#F2C14E]'
                  }`}
                >
                  {isSelected ? 'Inspecting' : 'Inspect'}
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
