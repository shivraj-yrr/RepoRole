import React, { useState } from 'react';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { RepoRoleLogo } from './RepoRoleLogo';

export interface NavLinkItem {
  label: string;
  href: string;
}

export interface NavbarProps {
  /** Optional custom brand text */
  brandName?: string;
  /** Optional custom logo initials */
  brandLogoText?: string;
  /** Optional custom navigation links */
  links?: NavLinkItem[];
  /** Optional click handler for Sign Up CTA */
  onSignUpClick?: () => void;
  /** Whether to show the Sign Up CTA button */
  showSignUpButton?: boolean;
  /** Whether to show the Dashboard navigation link */
  showDashboardLink?: boolean;
  /** Whether the current user has an authenticated session */
  isAuthenticated?: boolean;
  /** Callback for ending the authenticated session */
  onLogout?: () => void | Promise<void>;
  /** Current active path */
  currentPath?: string;
  /** Callback for client-side navigation */
  onNavigate?: (path: string) => void;
}

const DEFAULT_LINKS: NavLinkItem[] = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Features', href: '#features' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Our Vision', href: '#vision' },
  { label: 'Support Us', href: '#support-us' },
];

export const Navbar: React.FC<NavbarProps> = ({
  brandName = 'RepoRole',
  brandLogoText = 'RR',
  links = DEFAULT_LINKS,
  onSignUpClick,
  showSignUpButton = true,
  showDashboardLink = true,
  isAuthenticated = false,
  onLogout,
  currentPath = '/',
  onNavigate,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isDark, toggleTheme } = useTheme();
  const visibleLinks = showDashboardLink
    ? links
    : links.filter((link) => link.href !== '/dashboard');

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('/')) {
      e.preventDefault();
      closeMobileMenu();
      if (onNavigate) {
        onNavigate(href);
      } else {
        window.history.pushState(null, '', href);
        window.dispatchEvent(new PopStateEvent('popstate'));
      }
    } else if (href.startsWith('#')) {
      if (currentPath !== '/') {
        e.preventDefault();
        closeMobileMenu();
        if (onNavigate) {
          onNavigate('/');
          setTimeout(() => {
            const el = document.querySelector(href);
            el?.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }
      } else {
        closeMobileMenu();
      }
    }
  };

  const handleBrandClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    closeMobileMenu();
    if (onNavigate) {
      onNavigate('/');
    } else {
      window.history.pushState(null, '', '/');
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  };

  return (
    <header
      id="main-navigation-header"
      className={`sticky top-0 z-40 w-full transition-colors duration-200 border-b backdrop-blur-md ${
        isDark
          ? 'bg-[#2A2F35]/95 border-[#5B6770]/40'
          : 'bg-[#FFF4D6]/95 border-[#5B6770]/30'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Left section: Mascot Logo + Mobile Hamburger Menu + RepoRole Text */}
          <div className="flex items-center gap-2 md:gap-8">
            <a
              href="/"
              onClick={handleBrandClick}
              className="flex items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F2C14E] rounded-md p-1 group"
              aria-label={`${brandName} Home`}
            >
              {/* Mascot Logo */}
              <div
                id="brand-logo"
                className="flex items-center justify-center w-12 h-12 md:w-16 md:h-16 group-hover:scale-105 transition-transform shrink-0"
              >
                <RepoRoleLogo className="w-full h-full object-contain drop-shadow-sm" />
              </div>

              {/* Brand Text - Hidden on mobile, visible on desktop */}
              <span
                id="brand-name"
                className={`hidden md:inline-block text-xl font-bold tracking-tight group-hover:text-[#F2C14E] transition-colors ${
                  isDark ? 'text-[#FFF4D6]' : 'text-[#2A2F35]'
                }`}
              >
                {brandName}
              </span>
            </a>

            {/* Hamburger Menu Icon near Logo - Only visible on mobile devices */}
            <button
              id="mobile-menu-toggle"
              type="button"
              onClick={toggleMobileMenu}
              className={`md:hidden flex items-center justify-center p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F2C14E] transition-colors ${
                isDark
                  ? 'text-[#9AA5B1] hover:text-[#FFF4D6] hover:bg-[#5B6770]/20'
                  : 'text-[#5B6770] hover:text-[#2A2F35] hover:bg-[#5B6770]/15'
              }`}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-navigation"
              aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-[#F2C14E]" aria-hidden="true" />
              ) : (
                <Menu className="w-6 h-6" aria-hidden="true" />
              )}
            </button>
          </div>

          {/* Center/Desktop Navigation Links - Hidden on mobile */}
          <nav
            id="desktop-navigation"
            className="hidden md:flex items-center space-x-1 lg:space-x-2"
            aria-label="Main Navigation"
          >
            <ul className="flex items-center space-x-1 lg:space-x-2">
              {visibleLinks.map((link) => {
                const isActive = currentPath === link.href;

                return (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      onClick={(e) => handleLinkClick(e, link.href)}
                      className={`px-3 py-2 rounded-md text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F2C14E] transition-colors ${
                        isActive
                          ? 'text-[#F2C14E] font-bold bg-[#F2C14E]/10'
                          : isDark
                          ? 'text-[#9AA5B1] hover:text-[#FFF4D6] hover:bg-[#5B6770]/20'
                          : 'text-[#5B6770] hover:text-[#2A2F35] hover:bg-[#5B6770]/15'
                      }`}
                    >
                      {link.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Right section: Sign Up CTA Button + Light/Dark Mode Button */}
          <div className="flex items-center gap-2 sm:gap-3">
            {!isAuthenticated && showSignUpButton && onSignUpClick && (
              <button
                id="signup-cta-button"
                type="button"
                onClick={onSignUpClick}
                className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg bg-[#F2C14E] text-[#2A2F35] font-bold text-xs sm:text-sm shadow-sm hover:bg-[#FFF4D6] hover:text-[#2A2F35] hover:shadow-md active:scale-95 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#F2C14E] focus:ring-offset-2"
              >
                Sign Up
              </button>
            )}
            {isAuthenticated && onLogout && (
              <button
                id="logout-cta-button"
                type="button"
                onClick={onLogout}
                className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg bg-red-600 text-white font-bold text-xs sm:text-sm shadow-sm hover:bg-red-700 hover:shadow-md active:scale-95 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Logout
              </button>
            )}

            {/* Theme Toggle Button positioned at very right corner */}
            <button
              id="theme-toggle-button"
              type="button"
              onClick={toggleTheme}
              className={`p-2 sm:p-2.5 rounded-lg border transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#F2C14E] ${
                isDark
                  ? 'bg-[#1E2328] hover:bg-[#2A2F35] border-[#5B6770]/50 text-[#F2C14E]'
                  : 'bg-white hover:bg-neutral-100 border-[#5B6770]/30 text-[#2A2F35]'
              }`}
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? (
                <Sun className="w-5 h-5 text-[#F2C14E] transition-transform duration-200 rotate-0 hover:rotate-45" />
              ) : (
                <Moon className="w-5 h-5 text-[#2A2F35] transition-transform duration-200 rotate-0 hover:-rotate-12" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Dropdown Menu */}
      {isMobileMenuOpen && (
        <nav
          id="mobile-navigation"
          className={`md:hidden border-t px-4 pt-3 pb-6 shadow-xl animate-in slide-in-from-top-2 duration-200 ${
            isDark
              ? 'bg-[#2A2F35] border-[#5B6770]/30'
              : 'bg-[#FFF4D6] border-[#5B6770]/30'
          }`}
          aria-label="Mobile Navigation"
        >
          <ul className="flex flex-col space-y-1 mb-4">
            {visibleLinks.map((link) => {
              const isActive = currentPath === link.href;

              return (
                <li key={link.label}>
                  <a
                    href={link.href}
                    onClick={(e) => handleLinkClick(e, link.href)}
                    className={`block px-4 py-3 rounded-md text-base font-medium focus:outline-none focus:ring-2 focus:ring-[#F2C14E] transition-colors ${
                      isActive
                        ? 'text-[#F2C14E] font-bold bg-[#F2C14E]/10'
                        : isDark
                        ? 'text-[#FFF4D6] hover:bg-[#5B6770]/30 hover:text-[#F2C14E]'
                        : 'text-[#2A2F35] hover:bg-[#5B6770]/20 hover:text-[#2A2F35]'
                    }`}
                  >
                    {link.label}
                  </a>
                </li>
              );
            })}
          </ul>

          {/* Mobile Sign Up Button */}
          {!isAuthenticated && showSignUpButton && onSignUpClick && (
            <div className="pt-2 pb-4">
              <button
                type="button"
                id="mobile-signup-button"
                onClick={() => {
                  closeMobileMenu();
                  onSignUpClick();
                }}
                className="w-full py-2.5 rounded-lg bg-[#F2C14E] text-[#2A2F35] font-bold text-sm text-center shadow-sm hover:bg-[#FFF4D6] transition-colors"
              >
                Sign Up
              </button>
            </div>
          )}
          {isAuthenticated && onLogout && (
            <div className="pt-2 pb-4">
              <button
                type="button"
                id="mobile-logout-button"
                onClick={() => {
                  closeMobileMenu();
                  onLogout();
                }}
                className="w-full py-2.5 rounded-lg bg-red-600 text-white font-bold text-sm text-center shadow-sm hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
          )}

          {/* Quick theme switch in mobile drawer */}
          <div className="pt-3 border-t border-[#5B6770]/30 flex items-center justify-between px-2">
            <span className={`text-sm font-medium ${isDark ? 'text-[#9AA5B1]' : 'text-[#5B6770]'}`}>
              Current theme: <strong className={isDark ? 'text-[#F2C14E]' : 'text-[#2A2F35]'}>{isDark ? 'Dark Mode' : 'Light Mode'}</strong>
            </span>
            <button
              type="button"
              onClick={toggleTheme}
              className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                isDark
                  ? 'bg-[#5B6770]/20 border-[#5B6770] text-[#F2C14E]'
                  : 'bg-[#5B6770]/15 border-[#5B6770]/40 text-[#2A2F35]'
              }`}
            >
              {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
              <span>{isDark ? 'Switch to Light' : 'Switch to Dark'}</span>
            </button>
          </div>
        </nav>
      )}
    </header>
  );
};

export default Navbar;
