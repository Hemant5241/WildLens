import { Eye, Languages } from 'lucide-react';
import type { AppPage } from '../types';

interface HeaderProps {
  currentPage: AppPage;
  onNavigate: (page: AppPage) => void;
  onNewScan: () => void;
}

export default function Header({ currentPage, onNavigate, onNewScan }: HeaderProps) {
  return (
    <header className="header">
      <div className="header-inner">
        <div className="header-logo" onClick={() => onNavigate('home')}>
          <div className="header-logo-icon">
            <Eye size={20} />
          </div>
          <div>
            <div className="header-title">WildLens</div>
            <div className="header-subtitle">AI Wildlife Intelligence</div>
          </div>
        </div>

        <div className="header-actions">
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

          <button className="btn btn-ghost" onClick={() => onNavigate('history')} title="Scan History">
            <Languages size={16} />
            <span>History</span>
          </button>
        </div>
      </div>
    </header>
  );
}
