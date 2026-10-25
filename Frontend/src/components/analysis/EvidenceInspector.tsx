import React, { useState, useMemo } from 'react';
import {
  Code,
  Search,
  Filter,
  CheckCircle2,
  FileCode,
  Layers,
  ChevronDown,
  ChevronUp,
  Tag
} from 'lucide-react';
import { RoleSignalGroup, SignalEvidence } from '../../types/analysis';
import { useTheme } from '../../context/ThemeContext';

interface EvidenceInspectorProps {
  roleSignals: Record<string, RoleSignalGroup>;
}

export const EvidenceInspector: React.FC<EvidenceInspectorProps> = ({ roleSignals }) => {
  const { isDark } = useTheme();
  const [selectedSignalKey, setSelectedSignalKey] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStrength, setSelectedStrength] = useState<string>('all');

  const signalKeys = useMemo(() => Object.keys(roleSignals), [roleSignals]);

  // Aggregate all evidence items with their parent signal name
  const allEvidence = useMemo(() => {
    const list: Array<SignalEvidence & { signalName: string }> = [];
    Object.entries(roleSignals).forEach(([sigKey, groupVal]) => {
      const group = groupVal as RoleSignalGroup;
      if (group && Array.isArray(group.evidence)) {
        group.evidence.forEach((ev) => {
          list.push({
            ...ev,
            signalName: sigKey,
          });
        });
      }
    });
    return list;
  }, [roleSignals]);

  // Filter evidence based on controls
  const filteredEvidence = useMemo(() => {
    return allEvidence.filter((item) => {
      if (selectedSignalKey !== 'all' && item.signalName !== selectedSignalKey) {
        return false;
      }
      if (selectedStrength !== 'all' && item.strength !== selectedStrength) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesFile = item.filePath.toLowerCase().includes(q);
        const matchesSignal = item.signalName.toLowerCase().includes(q);
        const matchesType = item.sourceType.toLowerCase().includes(q);
        if (!matchesFile && !matchesSignal && !matchesType) return false;
      }
      return true;
    });
  }, [allEvidence, selectedSignalKey, selectedStrength, searchQuery]);

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
            <Code className="w-5 h-5 text-[#F2C14E]" />
            <span>AST Evidence & Verified Call Locations</span>
          </h3>
          <p className={`text-xs mt-0.5 ${
            isDark ? 'text-slate-300' : 'text-slate-600'
          }`}>
            Exact line and column numbers where syntactic evidence was extracted by the AST parser.
          </p>
        </div>

        <div className={`flex items-center gap-2 text-xs font-mono tabular-nums ${
          isDark ? 'text-slate-400' : 'text-slate-600'
        }`}>
          <span>Showing:</span>
          <strong className={`px-2 py-0.5 rounded font-bold ${
            isDark ? 'bg-slate-800 text-[#FFF4D6]' : 'bg-slate-100 text-slate-900'
          }`}>
            {filteredEvidence.length} of {allEvidence.length}
          </strong>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-5">
        {/* Search */}
        <div className="relative flex-1">
          <Search className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 ${
            isDark ? 'text-slate-400' : 'text-slate-400'
          }`} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by file path, signal, or AST type..."
            className={`w-full pl-9 pr-3 py-2 text-xs rounded-xl border focus:outline-none focus:ring-1 focus:ring-[#F2C14E] transition-colors ${
              isDark
                ? 'bg-slate-900/80 border-slate-700 text-[#FFF4D6] placeholder-slate-500'
                : 'bg-white border-neutral-300 text-slate-900 placeholder-slate-400'
            }`}
          />
        </div>

        {/* Signal Category Selector */}
        <div className="flex items-center gap-2">
          <select
            value={selectedSignalKey}
            onChange={(e) => setSelectedSignalKey(e.target.value)}
            className={`text-xs px-3 py-2 rounded-xl border focus:outline-none focus:ring-1 focus:ring-[#F2C14E] transition-colors ${
              isDark
                ? 'bg-slate-900/80 border-slate-700 text-[#FFF4D6]'
                : 'bg-white border-neutral-300 text-slate-800'
            }`}
          >
            <option value="all">All Signals ({signalKeys.length})</option>
            {signalKeys.map((key) => (
              <option key={key} value={key}>
                {key} ({roleSignals[key]?.occurrences || 0})
              </option>
            ))}
          </select>

          {/* Strength Filter */}
          <select
            value={selectedStrength}
            onChange={(e) => setSelectedStrength(e.target.value)}
            className={`text-xs px-3 py-2 rounded-xl border focus:outline-none focus:ring-1 focus:ring-[#F2C14E] transition-colors ${
              isDark
                ? 'bg-slate-900/80 border-slate-700 text-[#FFF4D6]'
                : 'bg-white border-neutral-300 text-slate-800'
            }`}
          >
            <option value="all">All Strengths</option>
            <option value="strong">Strong Evidence</option>
            <option value="medium">Medium Evidence</option>
            <option value="weak">Weak / Syntax Evidence</option>
          </select>
        </div>
      </div>

      {/* Evidence Table */}
      <div className={`overflow-x-auto border rounded-xl ${
        isDark ? 'border-slate-800' : 'border-slate-200'
      }`}>
        <table className="w-full text-left text-xs">
          <thead
            className={`border-b font-semibold uppercase tracking-wider text-[11px] ${
              isDark
                ? 'bg-slate-900/80 border-slate-800 text-slate-300'
                : 'bg-neutral-100 border-neutral-200 text-slate-700'
            }`}
          >
            <tr>
              <th className="py-2.5 px-3">Role Signal</th>
              <th className="py-2.5 px-3">File Location</th>
              <th className="py-2.5 px-3">Line : Col</th>
              <th className="py-2.5 px-3">AST Type</th>
              <th className="py-2.5 px-3">Strength</th>
            </tr>
          </thead>
          <tbody className={`divide-y font-mono text-[11px] ${
            isDark ? 'divide-slate-800/80' : 'divide-slate-200'
          }`}>
            {filteredEvidence.slice(0, 100).map((ev, index) => (
              <tr
                key={ev.id || index}
                className="transition-colors hover:bg-slate-500/5"
              >
                <td className="py-2 px-3 font-semibold text-[#F2C14E] whitespace-nowrap">
                  {ev.signalName}
                </td>
                <td className={`py-2 px-3 font-sans truncate max-w-xs sm:max-w-md ${
                  isDark ? 'text-slate-200' : 'text-slate-800'
                }`}>
                  {ev.filePath}
                </td>
                <td className={`py-2 px-3 tabular-nums whitespace-nowrap ${
                  isDark ? 'text-slate-300' : 'text-slate-600'
                }`}>
                  {ev.line !== null ? `L${ev.line}:${ev.column ?? 0}` : 'Structure'}
                </td>
                <td className="py-2 px-3 whitespace-nowrap">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] uppercase font-semibold ${
                      ev.sourceType === 'call'
                        ? 'bg-blue-500/15 text-blue-400'
                        : ev.sourceType === 'import'
                        ? 'bg-purple-500/15 text-purple-400'
                        : isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {ev.sourceType}
                  </span>
                </td>
                <td className="py-2 px-3 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center gap-1 font-semibold capitalize ${
                      ev.strength === 'strong'
                        ? 'text-emerald-400'
                        : ev.strength === 'medium'
                        ? 'text-amber-400'
                        : isDark ? 'text-slate-400' : 'text-slate-500'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        ev.strength === 'strong'
                          ? 'bg-emerald-400'
                          : ev.strength === 'medium'
                          ? 'bg-amber-400'
                          : 'bg-slate-400'
                      }`}
                    />
                    {ev.strength}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredEvidence.length > 100 && (
        <div className={`mt-3 text-center text-xs ${
          isDark ? 'text-slate-400' : 'text-slate-500'
        }`}>
          Showing first 100 matching evidence items. Use the search or filter above to narrow down.
        </div>
      )}
    </div>
  );
};
