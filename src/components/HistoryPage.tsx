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
    <div className="history-page animate-fade-in">
      <div className="history-actions">
        <div>
          <h2 className="history-title">Scan History</h2>
          <p className="history-subtitle">
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
        <div className="history-empty">
          <div className="history-empty-icon">
            <History size={64} />
          </div>
          <h3 className="history-empty-title">No scans yet</h3>
          <p>Start identifying wildlife to build your scan history.</p>
          <button className="btn btn-primary" onClick={onNewScan} style={{ marginTop: '24px' }}>
            <ScanSearch size={16} /> Start Scanning
          </button>
        </div>
      ) : (
        <div className="history-grid">
          {history.map((item) => (
            <div
              key={item.id}
              className="history-card"
              onClick={() => onSelectItem(item.imageData, item.result)}
            >
              <img
                src={item.imageData}
                alt={item.result.commonName}
                className="history-card-image"
              />
              <div className="history-card-content">
                <div className="history-card-name">{item.result.commonName}</div>
                <div className="history-card-scientific">{item.result.scientificName}</div>
                <div className="history-card-footer">
                  <span className="history-card-date">{formatDate(item.timestamp)}</span>
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
