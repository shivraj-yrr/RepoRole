import React, { useState } from 'react';
import { ArrowRight, Github } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export interface HeroProps {
  /** Optional callback when user clicks Analyze or submits repo URL */
  onAnalyze?: (repoUrl: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ onAnalyze }) => {
  const [repoUrl, setRepoUrl] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { isDark } = useTheme();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = repoUrl.trim();

    if (!trimmed) {
      setErrorMessage('Please enter a GitHub repository URL.');
      return;
    }

    setErrorMessage(null);
    if (onAnalyze) {
      onAnalyze(trimmed);
    }
  };

  const handleQuickSelect = (url: string) => {
    setRepoUrl(url);
    setErrorMessage(null);
    if (onAnalyze) {
      onAnalyze(url);
    }
  };

  return (
    <section
      aria-labelledby="hero-heading"
      className={`relative w-full overflow-hidden py-12 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 border-b transition-colors duration-200 ${
        isDark
          ? 'bg-[#2A2F35] text-[#FFF4D6] border-[#5B6770]'
          : 'bg-[#FFF4D6] text-[#2A2F35] border-[#5B6770]/40'
      }`}
      style={{
        backgroundImage: isDark
          ? 'radial-gradient(circle at 50% 20%, rgba(91, 103, 112, 0.25) 0%, transparent 70%)'
          : 'radial-gradient(circle at 50% 20%, rgba(91, 103, 112, 0.12) 0%, transparent 70%)',
      }}
    >
      <div className="max-w-5xl mx-auto text-center flex flex-col items-center">
        {/* Heading */}
        <h1
          id="hero-heading"
          className={`text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight uppercase mb-4 transition-colors ${
            isDark ? 'text-[#FFF4D6]' : 'text-[#2A2F35]'
          }`}
        >
          REPO ROLE
        </h1>

        {/* Subheading 1 */}
        <p
          className={`text-xl sm:text-2xl md:text-3xl font-semibold mb-8 md:mb-10 tracking-tight max-w-3xl transition-colors ${
            isDark ? 'text-[#F2C14E]' : 'text-[#2A2F35]'
          }`}
        >
          No Resume, No form, Just Code &rarr; Roles
        </p>

        {/* LineEdit + Analyze CTA Button */}
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-2xl mx-auto mb-6"
          role="search"
          aria-label="GitHub Repository Search"
        >
          <div
            className={`flex flex-col sm:flex-row items-stretch gap-3 p-2 rounded-xl border shadow-2xl transition-colors ${
              isDark
                ? 'bg-[#2A2F35] border-[#5B6770] focus-within:border-[#F2C14E]'
                : 'bg-[#FFFFFF] border-[#5B6770]/50 focus-within:border-[#2A2F35]'
            }`}
          >
            <div className="relative flex-1 flex items-center">
              <label htmlFor="github-repo-input" className="sr-only">
                GitHub Repository URL
              </label>
              <div
                className={`absolute left-3.5 pointer-events-none ${
                  isDark ? 'text-[#9AA5B1]' : 'text-[#5B6770]'
                }`}
              >
                <Github className="w-5 h-5" aria-hidden="true" />
              </div>
              <input
                id="github-repo-input"
                type="url"
                value={repoUrl}
                onChange={(e) => {
                  setRepoUrl(e.target.value);
                  if (errorMessage) setErrorMessage(null);
                }}
                placeholder="https://github.com/username/repository"
                required
                className={`w-full pl-11 pr-4 py-3 bg-transparent text-sm sm:text-base focus:outline-none rounded-lg transition-colors ${
                  isDark
                    ? 'text-[#FFF4D6] placeholder-[#9AA5B1]'
                    : 'text-[#2A2F35] placeholder-[#5B6770]'
                }`}
                aria-describedby="repo-description"
              />
            </div>

            <button
              id="analyze-repo-button"
              type="submit"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[#F2C14E] text-[#2A2F35] font-bold text-sm sm:text-base uppercase tracking-wider hover:bg-[#FFF4D6] hover:text-[#2A2F35] focus:outline-none focus:ring-2 focus:ring-[#F2C14E] shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer active:scale-98"
            >
              <span>Analyze</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>

          {errorMessage && (
            <p
              role="alert"
              className="mt-2 text-sm text-[#F2C14E] font-medium text-left px-2"
            >
              {errorMessage}
            </p>
          )}
        </form>

        {/* Sample Repos Quick CTA */}
        <div
          className={`flex flex-wrap items-center justify-center gap-2 text-xs mb-8 transition-colors ${
            isDark ? 'text-[#9AA5B1]' : 'text-[#5B6770]'
          }`}
        >
          <span className="font-medium">Try sample repos:</span>
          {[
            { name: 'facebook/react', url: 'https://github.com/facebook/react' },
            { name: 'vercel/next.js', url: 'https://github.com/vercel/next.js' },
            { name: 'tailwindlabs/tailwindcss', url: 'https://github.com/tailwindlabs/tailwindcss' },
          ].map((sample) => (
            <button
              key={sample.name}
              type="button"
              onClick={() => handleQuickSelect(sample.url)}
              className={`px-2.5 py-1 rounded-md border transition-colors text-xs font-mono cursor-pointer ${
                isDark
                  ? 'bg-[#5B6770]/20 hover:bg-[#5B6770]/40 text-[#FFF4D6] hover:text-[#F2C14E] border-[#5B6770]/40'
                  : 'bg-[#5B6770]/10 hover:bg-[#5B6770]/20 text-[#2A2F35] hover:text-[#2A2F35] border-[#5B6770]/30'
              }`}
            >
              {sample.name}
            </button>
          ))}
        </div>

        {/* Subheading 2 */}
        <p
          id="repo-description"
          className={`text-base sm:text-lg md:text-xl leading-relaxed max-w-3xl mx-auto transition-colors ${
            isDark ? 'text-[#9AA5B1]' : 'text-[#5B6770]'
          }`}
        >
          Analyze any public GitHub repository and get the most suitable job and internship roles from real technical signals.
        </p>
      </div>
    </section>
  );
};

export default Hero;

