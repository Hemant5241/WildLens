import { Eye, Languages } from 'lucide-react';
import type { AppPage } from '../types';

interface HeaderProps {
  currentPage: AppPage;
  onNavigate: (page: AppPage) => void;
  onNewScan: () => void;
}

export default function Header({ currentPage, onNavigate, onNewScan }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-surface-container-high h-[70px] flex items-center">
      {/* Top subtle gradient border equivalent */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-background via-primary/30 to-background" />
      
      <div className="w-full max-w-[1200px] mx-auto px-6 flex items-center justify-between">
        <div 
          className="flex items-center gap-3 cursor-pointer group" 
          onClick={() => onNavigate('home')}
        >
          <div className="w-[34px] h-[34px] rounded-lg bg-surface-container-high flex items-center justify-center text-primary group-hover:bg-primary/20 transition-colors duration-300">
            <Eye size={20} className="group-hover:scale-110 transition-transform duration-300" />
          </div>
          <div>
            <div className="font-display font-bold text-base tracking-wide text-on-surface">WildLens</div>
            <div className="font-mono text-[0.55rem] tracking-[0.2em] text-on-surface-variant uppercase mt-[2px]">AI Wildlife Intelligence</div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {currentPage === 'history' && (
            <button className="btn btn-secondary" onClick={() => onNavigate('home')}>
              Home
            </button>
          )}
          
          {currentPage === 'results' && (
            <button className="btn btn-primary" onClick={onNewScan}>
              New Scan
            </button>
          )}

          <button 
            className="btn btn-ghost" 
            onClick={() => onNavigate('history')} 
            title="Scan History"
          >
            <Languages size={16} />
            <span className="hidden sm:inline">History</span>
          </button>
        </div>
      </div>
    </header>
  );
}
