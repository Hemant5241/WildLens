import { Trash2, ScanSearch, History } from 'lucide-react';
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pb-4 border-b border-surface-container-high">
        <div>
          <h2 className="font-display font-bold text-2xl tracking-wide text-on-surface mb-1">Scan History</h2>
          <p className="font-body text-sm text-on-surface-variant">
            {history.length} {history.length === 1 ? 'scan' : 'scans'} recorded
          </p>
        </div>
        {history.length > 0 && (
          <button className="btn btn-secondary" onClick={onClearHistory}>
            <Trash2 size={14} /> Clear All
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center bg-surface-container-lowest border border-outline-variant border-dashed rounded-2xl">
          <div className="w-20 h-20 rounded-full bg-surface-container-low flex items-center justify-center text-on-surface-variant mb-6 border border-outline border-dashed">
            <History size={32} strokeWidth={1.5} />
          </div>
          <h3 className="font-display font-medium text-lg tracking-wide text-on-surface mb-2">No scans yet</h3>
          <p className="font-body text-sm text-on-surface-variant mb-6">Start identifying wildlife to build your scan history.</p>
          <button className="btn btn-primary" onClick={onNewScan}>
            <ScanSearch size={16} /> Start Scanning
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {history.map((item) => (
            <div
              key={item.id}
              className="bg-surface-container-lowest border border-surface-container-high rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 flex flex-col group"
              onClick={() => onSelectItem(item.imageData, item.result)}
            >
              <div className="relative w-full aspect-square overflow-hidden bg-surface-container border-b border-surface-container-high">
                <img
                  src={item.imageData}
                  alt={item.result.commonName}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-4 flex flex-col flex-1">
                <div className="font-display font-semibold text-sm tracking-wide text-on-surface leading-tight mb-1">{item.result.commonName}</div>
                <div className="font-body italic text-xs text-on-surface-variant mb-4">{item.result.scientificName}</div>
                <div className="mt-auto flex justify-between items-center pt-3 border-t border-surface-container-high">
                  <span className="font-mono text-[0.65rem] tracking-wider text-on-surface-muted uppercase">{formatDate(item.timestamp)}</span>
                  <span className={`badge ${getDangerBadge(item.result.dangerLevel)}`}>
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
