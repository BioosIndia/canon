import React from 'react';
import { ShieldCheck, ArrowRight, Terminal, User, Lock, LogOut } from 'lucide-react';
import { UserProfile } from '../../types/canon';
import { NotificationCenter } from './NotificationCenter';
import { GlobalSearchBar } from './GlobalSearchBar';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  onLaunchApp: () => void;
  isAppMode: boolean;
  onOpenAuth?: () => void;
  currentUser?: UserProfile;
  onSignOut?: () => void;
  onSelectSearchTab?: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  onLaunchApp,
  isAppMode,
  onOpenAuth,
  currentUser,
  onSignOut,
  onSelectSearchTab,
}) => {
  // Smooth scroll handler for landing page anchors
  const handleScrollToSection = (sectionId: string) => {
    if (isAppMode) {
      // If inside app mode, exit to public first then scroll
      onNavigate('home');
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  return (
    <header className="sticky top-0 z-50 px-4 sm:px-8 py-3 w-full bg-[#062016]/95 backdrop-blur-md border-b border-emerald-950/60 text-white transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <div
          onClick={() => handleScrollToSection('hero')}
          className="flex items-center gap-3 cursor-pointer group shrink-0"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-700 flex items-center justify-center shadow-lg shadow-emerald-900/40 border border-emerald-300/30 group-hover:scale-105 transition-transform">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-lg tracking-tight text-white">PRAMANEX</span>
              <span className="text-[11px] font-semibold uppercase tracking-widest px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                CANON
              </span>
            </div>
            <p className="text-[10px] text-emerald-200/70 tracking-wider uppercase font-medium">
              Global Label Lifecycle OS
            </p>
          </div>
        </div>

        {/* Global Search Bar (Center-Left) */}
        <div className="hidden md:block">
          <GlobalSearchBar
            isDarkTheme={true}
            onSelectResult={(tab) => {
              if (onSelectSearchTab) {
                onSelectSearchTab(tab);
              } else {
                onLaunchApp();
              }
            }}
          />
        </div>

        {/* Desktop Smooth-Scroll In-Page Menu */}
        <nav className="hidden xl:flex items-center gap-1 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full backdrop-blur-sm text-xs font-medium text-emerald-100/90">
          <button
            onClick={() => handleScrollToSection('hero')}
            className="px-2.5 py-1 rounded-full hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
          >
            Overview
          </button>
          <button
            onClick={() => handleScrollToSection('comparison')}
            className="px-2.5 py-1 rounded-full hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
          >
            Comparison
          </button>
          <button
            onClick={() => handleScrollToSection('features')}
            className="px-2.5 py-1 rounded-full hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
          >
            Capabilities
          </button>
          <button
            onClick={() => handleScrollToSection('structured-epi')}
            className="px-2.5 py-1 rounded-full hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
          >
            SPL / ePI
          </button>
          <button
            onClick={() => handleScrollToSection('governance')}
            className="px-2.5 py-1 rounded-full hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
          >
            Governance
          </button>
          <button
            onClick={() => handleScrollToSection('workflow')}
            className="px-2.5 py-1 rounded-full hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
          >
            Lineage
          </button>
          <button
            onClick={() => onNavigate('pricing')}
            className="px-2.5 py-1 rounded-full hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
          >
            Pricing
          </button>
        </nav>

        {/* Right Action CTAs */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Regulatory Notification Bell */}
          <NotificationCenter
            isDarkTheme={true}
            onSelectAction={(tab) => {
              if (onSelectSearchTab) onSelectSearchTab(tab);
              else onLaunchApp();
            }}
          />

          {/* User Account / Role Trigger */}
          <button
            onClick={onOpenAuth}
            className="text-xs font-semibold text-emerald-200 hover:text-white transition-colors cursor-pointer px-2.5 py-1.5 rounded-full hover:bg-white/10 flex items-center gap-1.5 border border-white/10"
            title="Switch User / View GxP Identity"
          >
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline truncate max-w-[110px]">
              {currentUser ? currentUser.name.split(',')[0] : 'Sign In'}
            </span>
          </button>

          {/* Prominent Log Out Button */}
          {currentUser && (
            <button
              onClick={onSignOut}
              className="text-xs font-semibold text-rose-300 hover:text-rose-100 hover:bg-rose-950/60 transition-colors cursor-pointer px-2.5 py-1.5 rounded-full border border-rose-800/60 flex items-center gap-1"
              title="Sign Out of Session"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-400" />
              <span className="hidden sm:inline">Log Out</span>
            </button>
          )}

          {isAppMode ? (
            <button
              onClick={() => onNavigate('home')}
              className="px-4 py-2 text-xs font-semibold rounded-full bg-white/10 hover:bg-white/20 text-emerald-100 border border-white/20 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              Public Site
            </button>
          ) : (
            <button
              onClick={onLaunchApp}
              className="px-5 py-2 text-xs font-bold rounded-full bg-[#D8F34E] hover:bg-[#c9e63a] text-slate-950 shadow-md shadow-[#D8F34E]/20 transition-all flex items-center gap-1.5 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <Terminal className="w-3.5 h-3.5" />
              Launch CANON OS
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
