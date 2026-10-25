import React, { useState } from 'react';
import {
  ArrowLeft,
  ExternalLink,
  RefreshCw,
  Copy,
  Check,
  FileCode2,
  Sparkles,
  GitBranch
} from 'lucide-react';
import { RepoDetails, AnalysisMetadata } from '../../types/analysis';
import { useTheme } from '../../context/ThemeContext';

interface AnalysisHeaderProps {
  repo: RepoDetails;
  metadata: AnalysisMetadata;
  onNavigateHome: () => void;
  onNavigateDashboard: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  onExportJson: () => void;
}

export const AnalysisHeader: React.FC<AnalysisHeaderProps> = ({
  repo,
  metadata,
  onNavigateHome,
  onNavigateDashboard,
  onRefresh,
  isRefreshing,
  onExportJson,
}) => {
  const { isDark } = useTheme();
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col gap-4 pb-6 border-b border-[#5B6770]/20">
      {/* Breadcrumb & Navigation Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 font-medium">
          <button
            type="button"
            onClick={onNavigateHome}
            className="hover:text-[#F2C14E] transition-colors cursor-pointer"
          >
            Home
          </button>
          <span>/</span>
          <button
            type="button"
            onClick={onNavigateDashboard}
            className="hover:text-[#F2C14E] transition-colors cursor-pointer"
          >
            Dashboard
          </button>
          <span>/</span>
          <span className={`font-semibold truncate max-w-[180px] sm:max-w-none ${
            isDark ? 'text-[#FFF4D6]' : 'text-slate-900'
          }`}>
            {repo.name}
          </span>
          <span>/</span>
          <span className="text-[#F2C14E] font-semibold">Analysis Report</span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onNavigateDashboard}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors ${
              isDark
                ? 'bg-[#1E2328] hover:bg-[#1E2328]/80 border-[#5B6770]/40 text-[#FFF4D6]'
                : 'bg-white hover:bg-neutral-50 border-neutral-300 text-[#2A2F35]'
            }`}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Back to Dashboard</span>
            <span className="sm:hidden">Dashboard</span>
          </button>

          <button
            type="button"
            onClick={handleCopyLink}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors ${
              isDark
                ? 'bg-[#1E2328] hover:bg-[#1E2328]/80 border-[#5B6770]/40 text-[#FFF4D6]'
                : 'bg-white hover:bg-neutral-50 border-neutral-300 text-[#2A2F35]'
            }`}
            title="Copy Report Link"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Copy className="w-3.5 h-3.5 text-slate-400" />
            )}
            <span className="hidden sm:inline">{copied ? 'Copied' : 'Share'}</span>
          </button>

          <button
            type="button"
            onClick={onExportJson}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors ${
              isDark
                ? 'bg-[#1E2328] hover:bg-[#1E2328]/80 border-[#5B6770]/40 text-[#FFF4D6]'
                : 'bg-white hover:bg-neutral-50 border-neutral-300 text-[#2A2F35]'
            }`}
            title="Export AST Analysis Data JSON"
          >
            <FileCode2 className="w-3.5 h-3.5 text-[#F2C14E]" />
            <span className="hidden sm:inline">Export JSON</span>
          </button>

          <button
            type="button"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#F2C14E] text-[#2A2F35] hover:bg-[#F2C14E]/90 transition-all shadow-xs disabled:opacity-50"
            title="Re-run AST signal evaluation"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`}
            />
            <span>{isRefreshing ? 'Analyzing...' : 'Re-Analyze'}</span>
          </button>
        </div>
      </div>

      {/* Main Title & Repo Meta Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-2">
        <div>
          <div className="flex items-center gap-3">
            <h1 className={`text-2xl sm:text-3xl font-extrabold tracking-tight font-sans ${
              isDark ? 'text-[#FFF4D6]' : 'text-[#2A2F35]'
            }`}>
              {repo.name}
            </h1>
            <a
              href={repo.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-1 text-xs transition-colors ${
                isDark ? 'text-slate-400 hover:text-[#F2C14E]' : 'text-slate-500 hover:text-[#F2C14E]'
              }`}
              title="Open GitHub Repository"
            >
              <span>github.com/{repo.owner}/{repo.name}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
          <p className={`mt-1.5 text-xs sm:text-sm flex flex-wrap items-center gap-x-2 gap-y-1 ${
            isDark ? 'text-slate-300' : 'text-slate-600'
          }`}>
            <span>Owner: <strong className={`font-semibold ${isDark ? 'text-[#FFF4D6]' : 'text-slate-900'}`}>{repo.owner}</strong></span>
            <span>·</span>
            <span>Files: <strong className={`tabular-nums font-mono font-semibold ${isDark ? 'text-[#FFF4D6]' : 'text-slate-900'}`}>{metadata.fileCount}</strong></span>
            <span>·</span>
            <span>Type: <strong className={`font-semibold ${isDark ? 'text-[#FFF4D6]' : 'text-slate-900'}`}>{metadata.isMonorepo ? 'Monorepo' : 'Single Package'}</strong></span>
            <span>·</span>
            <span>Status: <strong className="text-emerald-500 dark:text-emerald-400 font-semibold">Production Validated</strong></span>
          </p>
        </div>

        {/* Quick Top Signal Flag */}
        <div className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border text-xs ${
          isDark
            ? 'bg-[#1E2328] border-[#5B6770]/40 text-[#FFF4D6]'
            : 'bg-white border-neutral-200 text-slate-800'
        }`}>
          <div className="p-1.5 rounded-lg bg-[#F2C14E]/20 text-[#F2C14E]">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className={`text-[11px] font-medium ${isDark ? 'text-slate-300' : 'text-slate-500'}`}>Primary AST Alignment</div>
            <div className="font-bold text-sm text-[#F2C14E]">Full Stack JavaScript Developer</div>
          </div>
        </div>
      </div>
    </div>
  );
};
