import React, { useEffect } from 'react';
import { X, Github, ArrowUpRight, ShieldCheck, Code } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { RepoRoleLogo } from './RepoRoleLogo';

export interface SignUpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SignUpModal: React.FC<SignUpModalProps> = ({ isOpen, onClose }) => {
  const { isDark } = useTheme();
  const backendApi = import.meta.env.VITE_BACKEND_API || '';
  const frontendUrl = import.meta.env.VITE_FRONTEND_URL || '';
  const githubAuthUrl = new URL(
    `${backendApi}${backendApi.endsWith('/') ? '' : '/'}auth/github`,
  );
  githubAuthUrl.searchParams.set('frontendUrl', frontendUrl);

  // Handle escape key to close modal
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    // Prevent background scrolling while modal is open
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      id="signup-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs transition-opacity duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="signup-modal-title"
      aria-describedby="signup-modal-description"
    >
      {/* Modal Card */}
      <div
        id="signup-modal-container"
        className={`relative w-full max-w-lg rounded-2xl border shadow-2xl p-6 sm:p-8 transition-all duration-200 overflow-hidden ${
          isDark
            ? 'bg-[#2A2F35] text-[#FFF4D6] border-[#5B6770]'
            : 'bg-[#FFF4D6] text-[#2A2F35] border-[#5B6770]/40'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Decorative Top Accent Line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#F2C14E] via-[#F5B838] to-[#F2C14E]" />

        {/* Close Button */}
        <button
          id="signup-modal-close-button"
          type="button"
          onClick={onClose}
          aria-label="Close sign up dialog"
          className={`absolute top-4 right-4 p-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[#F2C14E] ${
            isDark
              ? 'text-[#FFF4D6]/70 hover:text-[#FFF4D6] hover:bg-[#5B6770]/30'
              : 'text-[#2A2F35]/70 hover:text-[#2A2F35] hover:bg-[#5B6770]/15'
          }`}
        >
          <X className="w-5 h-5" aria-hidden="true" />
        </button>

        {/* Header Section */}
        <div className="flex flex-col items-center text-center mb-6 pt-2">
          <div className="w-16 h-16 md:w-20 md:h-20 mb-3 flex items-center justify-center">
            <RepoRoleLogo className="w-full h-full drop-shadow-sm" />
          </div>
          <h2
            id="signup-modal-title"
            className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${
              isDark ? 'text-[#FFF4D6]' : 'text-[#2A2F35]'
            }`}
          >
            Join RepoRole
          </h2>
          <p
            id="signup-modal-description"
            className={`mt-2 text-sm sm:text-base max-w-sm ${
              isDark ? 'text-[#FFF4D6]/75' : 'text-[#2A2F35]/75'
            }`}
          >
            Select how you would like to continue to get started with code intelligence.
          </p>
        </div>

        {/* Options List / Form */}
        <div className="space-y-3.5 sm:space-y-4">
          {/* Option 1: Continue with GitHub as Seeker */}
          <a
            id="signup-seeker-github-button"
            href={githubAuthUrl.toString()}
            className={`group relative flex items-start sm:items-center justify-between p-4 sm:p-5 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#F2C14E] ${
              isDark
                ? 'bg-[#1E2328] hover:bg-[#1E2328]/80 border-[#5B6770] hover:border-[#F2C14E] shadow-sm'
                : 'bg-white hover:bg-neutral-50 border-[#5B6770]/40 hover:border-[#F2C14E] shadow-sm'
            }`}
          >
            <div className="flex items-start sm:items-center gap-3.5 sm:gap-4">
              <div
                className={`p-2.5 sm:p-3 rounded-lg shrink-0 transition-transform group-hover:scale-105 ${
                  isDark ? 'bg-[#2A2F35] text-[#F2C14E]' : 'bg-[#2A2F35] text-[#FFF4D6]'
                }`}
              >
                <Github className="w-6 h-6" aria-hidden="true" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <span
                    className={`font-bold text-base sm:text-lg tracking-tight group-hover:text-[#F2C14E] transition-colors ${
                      isDark ? 'text-[#FFF4D6]' : 'text-[#2A2F35]'
                    }`}
                  >
                    Continue with GitHub
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-[#F2C14E]/20 text-[#F2C14E] border border-[#F2C14E]/40">
                    <Code className="w-3 h-3" aria-hidden="true" />
                    Seeker
                  </span>
                </div>
                <p
                  className={`text-xs sm:text-sm line-clamp-2 ${
                    isDark ? 'text-[#FFF4D6]/70' : 'text-[#2A2F35]/70'
                  }`}
                >
                  For developers looking to showcase repo badges & matching roles
                </p>
              </div>
            </div>
            <ArrowUpRight
              className={`w-5 h-5 shrink-0 ml-2 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 text-[#F2C14E]`}
              aria-hidden="true"
            />
          </a>

        </div>

        {/* Footer info note */}
        <div className="mt-6 pt-4 border-t border-[#5B6770]/30 text-center">
          <p
            className={`text-xs flex items-center justify-center gap-1.5 ${
              isDark ? 'text-[#FFF4D6]/60' : 'text-[#2A2F35]/60'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#F2C14E]" aria-hidden="true" />
            <span>Secure authentication via RepoSense gateway</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpModal;
