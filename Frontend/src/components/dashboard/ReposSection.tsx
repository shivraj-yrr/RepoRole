import React, { useState, useMemo } from 'react';
import {
  FolderGit2,
  Star,
  GitFork,
  ExternalLink,
  Search,
  Code,
  Calendar,
  Layers,
  Sparkles,
  Loader2,
  CheckCircle2,
  FileCode,
  ChevronDown,
  ChevronUp,
  Zap
} from 'lucide-react';
import { DashboardRepo, RoleCard, MatchedSignal } from '../../types/dashboard';
import { useTheme } from '../../context/ThemeContext';

interface ReposSectionProps {
  repos: DashboardRepo[];
  isLoading?: boolean;
  cards?: RoleCard[] | null;
  onAnalyzeRepo?: (repo: DashboardRepo) => void | Promise<void>;
  analyzingRepoId?: string | null;
  onNavigateAnalysis?: (repoUrl?: string) => void;
}

const LANGUAGE_COLORS: Record<string, string> = {
  JavaScript: '#F1E05A',
  TypeScript: '#3178C6',
  'C++': '#F34B7D',
  Python: '#3572A5',
  HTML: '#E34C26',
  CSS: '#563D7C',
  Go: '#00ADD8',
  Rust: '#DEA584',
};

export const ReposSection: React.FC<ReposSectionProps> = ({
  repos,
  isLoading = false,
  cards,
  onAnalyzeRepo,
  analyzingRepoId: externalAnalyzingRepoId,
  onNavigateAnalysis,
}) => {
  const { isDark } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('All');
  const [localAnalyzingId, setLocalAnalyzingId] = useState<string | null>(null);
  const [analyzedRepoIds, setAnalyzedRepoIds] = useState<Set<string>>(new Set());
  const [expandedSignalsRepoId, setExpandedSignalsRepoId] = useState<string | null>(null);

  const activeAnalyzingId = externalAnalyzingRepoId !== undefined ? externalAnalyzingRepoId : localAnalyzingId;

  // Map each repo name to its matched AST signals from role cards
  const repoSignalsMap = useMemo(() => {
    const map = new Map<string, MatchedSignal[]>();
    if (!cards) return map;

    cards.forEach((card) => {
      card.matchedSignals.forEach((sig) => {
        if (sig.repo) {
          const list = map.get(sig.repo) || [];
          // Avoid duplicate signals for the same repo
          if (!list.some((existing) => existing.signal === sig.signal)) {
            list.push(sig);
          }
          map.set(sig.repo, list);
        }
      });
    });

    return map;
  }, [cards]);

  // Handle clicking Analyze on a specific repository
  const handleAnalyzeClick = async (repo: DashboardRepo) => {
    if (activeAnalyzingId) return; // Prevent concurrent requests

    setLocalAnalyzingId(repo.id);

    try {
      if (onAnalyzeRepo) {
        await onAnalyzeRepo(repo);
      }
      setAnalyzedRepoIds((prev) => new Set(prev).add(repo.id));
    } finally {
      setLocalAnalyzingId(null);
    }
  };

  const toggleRepoSignals = (repoId: string) => {
    setExpandedSignalsRepoId((prev) => (prev === repoId ? null : repoId));
  };

  // Derive unique languages
  const languages = useMemo(() => {
    const langs = new Set<string>();
    repos.forEach((r) => {
      if (r.language) langs.add(r.language);
    });
    return ['All', ...Array.from(langs)];
  }, [repos]);

  // Filter repositories based on query & language
  const filteredRepos = useMemo(() => {
    return repos.filter((repo) => {
      const matchesSearch =
        repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (repo.description &&
          repo.description.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesLang =
        selectedLanguage === 'All' || repo.language === selectedLanguage;

      return matchesSearch && matchesLang;
    });
  }, [repos, searchQuery, selectedLanguage]);

  if (isLoading) {
    return (
      <section className="w-full space-y-4">
        <div className="h-8 w-48 bg-[#5B6770]/30 rounded-md animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className={`h-40 rounded-2xl border p-5 animate-pulse ${
                isDark
                  ? 'bg-[#1E2328] border-[#5B6770]/40'
                  : 'bg-white border-[#5B6770]/25'
              }`}
            />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section id="repositories-section" className="w-full space-y-5">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-[#F2C14E]/20 text-[#F2C14E] border border-[#F2C14E]/40">
            <FolderGit2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
              Evaluated Repositories
            </h2>
            <p
              className={`text-xs sm:text-sm ${
                isDark ? 'text-[#FFF4D6]/70' : 'text-[#2A2F35]/70'
              }`}
            >
              Public source code repositories analyzed for role signals
            </p>
          </div>
        </div>

        {/* Search & Language Filters */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Search box */}
          <div className="relative min-w-[200px] sm:min-w-[240px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#5B6770]" />
            <input
              type="text"
              placeholder="Search repositories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-9 pr-3 py-1.5 rounded-xl border text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#F2C14E] transition-colors ${
                isDark
                  ? 'bg-[#2A2F35] border-[#5B6770]/50 text-[#FFF4D6] placeholder-[#FFF4D6]/40'
                  : 'bg-white border-[#5B6770]/30 text-[#2A2F35] placeholder-[#2A2F35]/40'
              }`}
            />
          </div>

          {/* Language filter buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {languages.map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() => setSelectedLanguage(lang)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedLanguage === lang
                    ? 'bg-[#F2C14E] text-[#2A2F35] shadow-xs'
                    : isDark
                    ? 'bg-[#2A2F35] text-[#FFF4D6]/70 hover:bg-[#5B6770]/40'
                    : 'bg-neutral-100 text-[#2A2F35]/70 hover:bg-neutral-200'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Repositories Grid */}
      {filteredRepos.length === 0 ? (
        <div
          className={`w-full rounded-2xl border p-12 text-center space-y-2 ${
            isDark
              ? 'bg-[#1E2328] border-[#5B6770]/40 text-[#FFF4D6]/70'
              : 'bg-white border-[#5B6770]/25 text-[#2A2F35]/70'
          }`}
        >
          <FolderGit2 className="w-10 h-10 mx-auto text-[#5B6770] opacity-50" />
          <p className="font-semibold text-base">No repositories match your criteria</p>
          <p className="text-xs">Try clearing the search query or language filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {filteredRepos.map((repo) => {
            const langColor = repo.language
              ? LANGUAGE_COLORS[repo.language] || '#F2C14E'
              : '#9AA5B1';

            return (
              <div
                key={repo.id}
                id={`repo-card-${repo.name}`}
                className={`rounded-2xl border p-5 flex flex-col justify-between transition-all duration-200 shadow-sm hover:shadow-md group ${
                  isDark
                    ? 'bg-[#1E2328] border-[#5B6770]/40 hover:border-[#F2C14E]/60 text-[#FFF4D6]'
                    : 'bg-white border-[#5B6770]/25 hover:border-[#F2C14E]/60 text-[#2A2F35]'
                }`}
              >
                <div className="space-y-3">
                  {/* Top row: Name & External Link */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <FolderGit2 className="w-4 h-4 text-[#F2C14E] shrink-0" />
                      <a
                        href={repo.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-bold text-base tracking-tight truncate hover:text-[#F2C14E] transition-colors"
                        title={repo.name}
                      >
                        {repo.name}
                      </a>
                    </div>

                    <a
                      href={repo.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`p-1.5 rounded-lg opacity-60 group-hover:opacity-100 transition-all ${
                        isDark ? 'hover:bg-[#2A2F35]' : 'hover:bg-neutral-100'
                      }`}
                      aria-label={`Open ${repo.name} on GitHub`}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>

                  {/* Description */}
                  <p
                    className={`text-xs line-clamp-2 min-h-[32px] ${
                      isDark ? 'text-[#FFF4D6]/70' : 'text-[#2A2F35]/70'
                    }`}
                  >
                    {repo.description || 'No description provided.'}
                  </p>
                </div>

                {/* Bottom Row: Language & Metrics */}
                <div className="pt-4 mt-4 border-t border-[#5B6770]/20 flex items-center justify-between text-xs">
                  {/* Language */}
                  <div className="flex items-center gap-1.5">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: langColor }}
                    />
                    <span
                      className={`font-semibold ${
                        isDark ? 'text-[#FFF4D6]/80' : 'text-[#2A2F35]/80'
                      }`}
                    >
                      {repo.language || 'Plain Text'}
                    </span>
                  </div>

                  {/* Stars & Forks */}
                  <div
                    className={`flex items-center gap-3 ${
                      isDark ? 'text-[#FFF4D6]/70' : 'text-[#2A2F35]/70'
                    }`}
                  >
                    <span className="flex items-center gap-1" title={`${repo.stars} Stars`}>
                      <Star className="w-3.5 h-3.5 text-[#F2C14E]" />
                      <span>{repo.stars}</span>
                    </span>
                    <span className="flex items-center gap-1" title={`${repo.forks} Forks`}>
                      <GitFork className="w-3.5 h-3.5" />
                      <span>{repo.forks}</span>
                    </span>
                  </div>
                </div>

                {/* Action Row: Analyze Repo Button & Signals Status */}
                {(() => {
                  const isAnalyzing = activeAnalyzingId === repo.id;
                  const isAnalyzed = analyzedRepoIds.has(repo.id);
                  const matchedSignals = repoSignalsMap.get(repo.name) || [];
                  const isSignalsExpanded = expandedSignalsRepoId === repo.id;

                  return (
                    <div className="pt-3.5 mt-3.5 border-t border-[#5B6770]/20 flex flex-col gap-2">
                      <div className="flex items-center justify-between gap-2">
                        {/* Signal match info / analysis status */}
                        <div className="flex items-center gap-1.5 min-w-0">
                          {isAnalyzing ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#F2C14E] animate-pulse">
                              <Zap className="w-3.5 h-3.5" />
                              <span className="truncate">Scanning AST tree...</span>
                            </span>
                          ) : isAnalyzed || matchedSignals.length > 0 ? (
                            <button
                              type="button"
                              onClick={() => toggleRepoSignals(repo.id)}
                              className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md transition-colors ${
                                isDark
                                  ? 'bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25 border border-emerald-500/30'
                                  : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                              }`}
                              title="Click to view detected AST signals"
                            >
                              <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                              <span>
                                {matchedSignals.length > 0 ? `${matchedSignals.length} Signals` : 'Analyzed'}
                              </span>
                              {matchedSignals.length > 0 && (
                                isSignalsExpanded ? <ChevronUp className="w-3 h-3 ml-0.5" /> : <ChevronDown className="w-3 h-3 ml-0.5" />
                              )}
                            </button>
                          ) : (
                            <span className={`text-[11px] font-medium ${isDark ? 'text-[#FFF4D6]/50' : 'text-[#2A2F35]/50'}`}>
                              Not yet scanned
                            </span>
                          )}
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-1.5 shrink-0">
                          {onNavigateAnalysis && (repo.name.toLowerCase() === 'reporole' || isAnalyzed || matchedSignals.length > 0) && (
                            <button
                              type="button"
                              onClick={() => onNavigateAnalysis(repo.url)}
                              className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl font-bold text-xs border transition-colors ${
                                isDark
                                  ? 'bg-[#1E2328] hover:bg-[#F2C14E] text-[#FFF4D6] hover:text-[#2A2F35] border-[#F2C14E]/50'
                                  : 'bg-white hover:bg-[#F2C14E] text-[#2A2F35] border-[#F2C14E]/60'
                              }`}
                              title={`View full AST analysis report for ${repo.name}`}
                            >
                              <FileCode className="w-3.5 h-3.5 text-[#F2C14E]" />
                              <span>Report</span>
                            </button>
                          )}

                          {/* Analyze Button */}
                          <button
                            type="button"
                            id={`analyze-repo-${repo.name}`}
                            onClick={() => handleAnalyzeClick(repo)}
                            disabled={activeAnalyzingId === repo.id}
                            className={`inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs transition-all duration-150 shadow-xs focus:outline-none focus:ring-2 focus:ring-[#F2C14E] active:scale-95 ${
                              activeAnalyzingId === repo.id
                                ? 'bg-[#F2C14E]/25 text-[#F2C14E] cursor-wait'
                                : isAnalyzed
                                ? isDark
                                  ? 'bg-[#2A2F35] text-[#FFF4D6] hover:bg-[#F2C14E] hover:text-[#2A2F35] border border-[#5B6770]/40'
                                  : 'bg-neutral-100 text-[#2A2F35] hover:bg-[#F2C14E] border border-[#5B6770]/30'
                                : 'bg-[#F2C14E] text-[#2A2F35] hover:bg-[#FFF4D6] hover:shadow-md'
                            }`}
                            title={`Analyze repository ${repo.name}`}
                            aria-label={`Analyze repository ${repo.name}`}
                          >
                            {activeAnalyzingId === repo.id ? (
                              <>
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                <span>Analyzing...</span>
                              </>
                            ) : isAnalyzed ? (
                              <>
                                <Sparkles className="w-3.5 h-3.5 text-[#F2C14E]" />
                                <span>Re-Analyze</span>
                              </>
                            ) : (
                              <>
                                <Sparkles className="w-3.5 h-3.5" />
                                <span>Analyze</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Expandable Signals Drawer */}
                      {isSignalsExpanded && matchedSignals.length > 0 && (
                        <div
                          className={`mt-2 p-2.5 rounded-xl border text-xs space-y-2 animate-in fade-in duration-150 ${
                            isDark
                              ? 'bg-[#2A2F35] border-[#5B6770]/40'
                              : 'bg-neutral-50 border-[#5B6770]/20'
                          }`}
                        >
                          <div className="flex items-center justify-between pb-1.5 border-b border-[#5B6770]/20 font-bold text-[11px] text-[#F2C14E]">
                            <span>Detected AST Signals</span>
                            <span className="opacity-75">{matchedSignals.length} total</span>
                          </div>
                          <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                            {matchedSignals.map((sig) => (
                              <div
                                key={sig.signal}
                                className={`p-1.5 rounded-lg flex items-center justify-between gap-1 text-[11px] ${
                                  isDark ? 'bg-[#1E2328]' : 'bg-white'
                                }`}
                              >
                                <span className="font-mono font-medium truncate" title={sig.signal}>
                                  {sig.signal}
                                </span>
                                <span className="font-bold text-[#F2C14E] shrink-0">
                                  +{sig.score || sig.points || 0} pts
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default ReposSection;
