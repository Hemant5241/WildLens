import { Eye, History as HistoryIcon, Plus, ArrowLeft } from 'lucide-react';
import type { AppPage } from '../types';

interface HeaderProps {
  currentPage: AppPage;
  onNavigate: (page: AppPage) => void;
  onNewScan: () => void;
}

export default function Header({ currentPage, onNavigate, onNewScan }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface-variant/60 backdrop-blur-[20px]">
      {/* Subtle top accent line */}
      <div className="h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

      <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
        {/* Logo */}
        <div
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => onNavigate('home')}
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary-container flex items-center justify-center text-on-primary shadow-glow transition-shadow duration-500 group-hover:shadow-glow-lg">
            <Eye size={18} strokeWidth={2.5} />
          </div>
          <div>
            <div className="font-display font-bold text-[15px] tracking-wide text-on-surface leading-none">
              WildLens
            </div>
            <div className="font-mono text-[9px] tracking-[0.25em] text-on-surface-muted uppercase mt-0.5">
              AI Wildlife Intelligence
            </div>
          </div>
        </div>

        {/* Navigation Actions */}
        <nav className="flex items-center gap-2">
          {currentPage !== 'home' && currentPage !== 'analysis' && (
            <button
              className="btn btn-ghost text-xs"
              onClick={() => onNavigate('home')}
            >
              <ArrowLeft size={14} />
              <span className="hidden sm:inline">Home</span>
            </button>
          )}

          {currentPage === 'results' && (
            <button className="btn btn-primary text-xs" onClick={onNewScan}>
              <Plus size={14} />
              New Scan
            </button>
          )}

          <button
            className="btn btn-ghost text-xs"
            onClick={() => onNavigate('history')}
          >
            <HistoryIcon size={14} />
            <span className="hidden sm:inline">History</span>
          </button>
        </nav>
      </div>
    </header>
  );
}
