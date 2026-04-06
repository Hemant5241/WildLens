import { Trash2, ScanSearch, History, ChevronRight } from 'lucide-react';
import type { ScanHistoryItem, AnalysisResult } from '../types';

interface HistoryPageProps {
  history: ScanHistoryItem[];
  onSelectItem: (imageData: string, result: AnalysisResult) => void;
  onClearHistory: () => void;
  onNewScan: () => void;
}

export default function HistoryPage({ history, onSelectItem, onClearHistory, onNewScan }: HistoryPageProps) {
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getDangerBadge = (level: string) => {
    switch (level) {
      case 'Critical':
      case 'High':
        return 'badge-danger';
      case 'Medium':
        return 'badge-warning';
      default:
        return 'badge-success';
    }
  };

  return (
    <div className="animate-fade-in w-full max-w-[1000px] mx-auto py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
        <div>
          <h2 className="font-display font-bold text-3xl tracking-tight text-on-surface mb-1.5">
            Scan History
          </h2>
          <p className="font-body text-sm text-on-surface-variant">
            {history.length} {history.length === 1 ? 'scan' : 'scans'} recorded
          </p>
        </div>
        {history.length > 0 && (
          <button className="btn btn-secondary text-xs" onClick={onClearHistory}>
            <Trash2 size={13} /> Clear All
          </button>
        )}
      </div>

      {/* Empty State */}
      {history.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-20 h-20 rounded-2xl bg-surface-container-low flex items-center justify-center text-on-surface-muted mb-8">
            <History size={32} strokeWidth={1.5} />
          </div>
          <h3 className="font-display font-semibold text-lg tracking-wide text-on-surface mb-2">No scans yet</h3>
          <p className="font-body text-sm text-on-surface-variant mb-8 max-w-sm">
            Start identifying wildlife to build your personal species journal.
          </p>
          <button className="btn btn-primary" onClick={onNewScan}>
            <ScanSearch size={16} /> Start Scanning
          </button>
        </div>
      ) : (
        /* History Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {history.map((item) => (
            <div
              key={item.id}
              className="glass-card rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 hover:-translate-y-1 hover:shadow-card-hover group"
              onClick={() => onSelectItem(item.imageData, item.result)}
            >
              {/* Image */}
              <div className="relative w-full aspect-[4/3] overflow-hidden">
                <img
                  src={item.imageData}
                  alt={item.result.commonName}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {/* Scrim */}
                <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                {/* Reveal arrow */}
                <div className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-primary/20 backdrop-blur-md flex items-center justify-center text-primary opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                  <ChevronRight size={16} />
                </div>
              </div>

              {/* Info */}
              <div className="p-4">
                <div className="font-display font-semibold text-sm tracking-wide text-on-surface leading-snug mb-0.5">
                  {item.result.commonName}
                </div>
                <div className="font-body italic text-xs text-on-surface-muted mb-4">
                  {item.result.scientificName}
                </div>

                <div className="flex justify-between items-center">
                  <span className="font-mono text-[9px] tracking-[0.1em] text-on-surface-muted/50 uppercase">
                    {formatDate(item.timestamp)}
                  </span>
                  <span className={`badge text-[9px] ${getDangerBadge(item.result.dangerLevel)}`}>
                    {item.result.dangerLevel}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
