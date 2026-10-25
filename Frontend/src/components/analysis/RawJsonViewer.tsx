import React, { useState } from 'react';
import { Copy, Check, Download, FileJson } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface RawJsonViewerProps {
  data: unknown;
  repoName: string;
}

export const RawJsonViewer: React.FC<RawJsonViewerProps> = ({ data, repoName }) => {
  const { isDark } = useTheme();
  const [copied, setCopied] = useState(false);

  const jsonString = JSON.stringify(data, null, 2);

  const handleCopy = () => {
    navigator.clipboard?.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${repoName.toLowerCase()}-analysis-report.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div
      className={`p-6 rounded-2xl border transition-colors ${
        isDark
          ? 'bg-[#1E2328] border-[#5B6770]/40 text-[#FFF4D6]'
          : 'bg-white border-neutral-200 text-slate-900 shadow-xs'
      }`}
    >
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b ${
        isDark ? 'border-slate-800' : 'border-slate-200'
      }`}>
        <div className="flex items-center gap-2">
          <FileJson className="w-5 h-5 text-[#F2C14E]" />
          <div>
            <h3 className={`text-base font-bold ${
              isDark ? 'text-[#FFF4D6]' : 'text-slate-900'
            }`}>
              Complete Analysis Payload (JSON)
            </h3>
            <p className={`text-xs mt-0.5 ${
              isDark ? 'text-slate-300' : 'text-slate-600'
            }`}>
              Complete raw AST signals, role weights, detector definitions, and file evidence.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopy}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors ${
              isDark
                ? 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-[#FFF4D6]'
                : 'bg-neutral-100 hover:bg-neutral-200 border-neutral-300 text-slate-800'
            }`}
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Copy className="w-3.5 h-3.5 text-slate-400" />
            )}
            <span>{copied ? 'Copied' : 'Copy JSON'}</span>
          </button>

          <button
            type="button"
            onClick={handleDownload}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-[#F2C14E] text-[#2A2F35] hover:bg-[#F2C14E]/90 transition-colors shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download</span>
          </button>
        </div>
      </div>

      <div
        className={`p-4 rounded-xl border font-mono text-xs max-h-[500px] overflow-auto ${
          isDark
            ? 'bg-slate-950 text-slate-200 border-slate-800'
            : 'bg-neutral-900 text-neutral-100 border-neutral-700'
        }`}
      >
        <pre className="whitespace-pre">{jsonString}</pre>
      </div>
    </div>
  );
};
