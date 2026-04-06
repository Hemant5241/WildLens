import {
  ScanSearch,
  ShieldCheck,
  ShieldAlert,
  MapPin,
  Activity,
  Skull,
  TriangleAlert,
  Eye,
  Heart,
  ChevronRight,
  Sparkles,
  Scale,
  Clock,
  Utensils,
  Leaf,
  TrendingDown,
  TrendingUp,
  Minus,
  Share2,
  Download,
} from 'lucide-react';
import type { AnalysisResult } from '../types';

interface ResultsPageProps {
  result: AnalysisResult;
  imageData: string;
  onNewScan: () => void;
  onShare: () => void;
}

export default function ResultsPage({ result, imageData, onNewScan, onShare }: ResultsPageProps) {
  const getStatusIcon = () => {
    if (result.isDangerous) return <ShieldAlert size={18} />;
    return <ShieldCheck size={18} />;
  };

  const getStatusClass = () => {
    if (result.dangerLevel === 'Critical' || result.dangerLevel === 'High') return 'danger';
    if (result.dangerLevel === 'Medium') return 'warning';
    return 'safe';
  };

  const getDangerBadge = () => {
    switch (result.dangerLevel) {
      case 'Critical': return 'badge-danger';
      case 'High': return 'badge-danger';
      case 'Medium': return 'badge-warning';
      case 'Low': return 'badge-success';
      default: return 'badge-success';
    }
  };

  const getPopulationIcon = () => {
    const trend = result.conservationStatus?.populationTrend?.toLowerCase();
    if (trend?.includes('decreasing') || trend?.includes('decline')) return <TrendingDown size={14} />;
    if (trend?.includes('increasing') || trend?.includes('growing')) return <TrendingUp size={14} />;
    return <Minus size={14} />;
  };

  const handleDownload = () => {
    const data = JSON.stringify(result, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `wildlens-${result.commonName?.replace(/\s+/g, '-').toLowerCase()
        || 'analysis'}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="results-page animate-fade-in">
      {/* Header Section */}
      <div className="results-header">
        <div className="results-image-container">
          <img src={imageData} alt={result.commonName} className="results-image" />
          <div className="results-ai-badge">
            <div className="results-ai-badge-dot" />
            AI Verified
          </div>
        </div>

        <div className="results-identification">
          <div className="results-label">
            <ScanSearch size={14} />
            Identified
          </div>
          <h1 className="results-species-name">{result.commonName}</h1>
          <p className="results-scientific-name">{result.scientificName}</p>
          <div className="results-tags">
            {result.alternateNames?.map((name, i) => (
              <span key={i} className="tag">{name}</span>
            ))}
            {result.category && <span className="tag">{result.category}</span>}
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn btn-secondary" onClick={onShare}>
              <Share2 size={14} /> Share
            </button>
            <button className="btn btn-secondary" onClick={handleDownload}>
              <Download size={14} /> Export
            </button>
          </div>
        </div>
      </div>

      {/* Status Row */}
      <div className="results-status-row">
        <div className="results-status-card">
          <div className="results-status-label">Status</div>
          <div className={`results-status-value ${getStatusClass()}`}>
            {getStatusIcon()}
            {result.venomousStatus || (result.isDangerous ? 'DANGEROUS' : 'SAFE')}
          </div>
        </div>

        <div className="results-status-card">
          <div className="results-status-label">Danger Level</div>
          <div className="results-status-value">
            <span className={`badge ${getDangerBadge()}`}>
              {result.dangerLevel}
            </span>
          </div>
        </div>

        <div className="results-status-card">
          <div className="results-status-label">Confidence</div>
          <div className="results-confidence-number">
            {result.confidence}
            <span className="results-confidence-percent">%</span>
          </div>
          <div className="results-confidence-bar">
            <div
              className="results-confidence-fill"
              style={{ width: `${result.confidence}%` }}
            />
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="results-quick-stats">
        <div className="results-quick-stat">
          <div className="results-quick-stat-icon"><Utensils size={18} /></div>
          <div className="results-quick-stat-label">Diet</div>
          <div className="results-quick-stat-value">{result.dietInfo || 'N/A'}</div>
        </div>
        <div className="results-quick-stat">
          <div className="results-quick-stat-icon"><Clock size={18} /></div>
          <div className="results-quick-stat-label">Lifespan</div>
          <div className="results-quick-stat-value">{result.lifespanInfo || 'N/A'}</div>
        </div>
        <div className="results-quick-stat">
          <div className="results-quick-stat-icon"><Scale size={18} /></div>
          <div className="results-quick-stat-label">Size</div>
          <div className="results-quick-stat-value">{result.sizeInfo || 'N/A'}</div>
        </div>
      </div>

      {/* Habitat & Behavior */}
      <div className="results-info-row">
        <div className="results-info-card">
          <div className="results-info-title">
            <MapPin size={16} />
            Habitat
          </div>
          <p className="results-info-text">{result.habitat}</p>
        </div>

        <div className="results-info-card">
          <div className="results-info-title">
            <Activity size={16} />
            Behavior
          </div>
          <p className="results-info-text">{result.behavior}</p>
        </div>
      </div>

      {/* Danger Profile */}
      {result.isDangerous && result.dangerProfile && (
        <div className="results-danger-section">
          <div className="results-danger-header">
            <ShieldAlert size={16} />
            Danger Profile
          </div>
          <div className="results-danger-content">
            <div className="results-danger-item">
              <div className="results-danger-item-icon">
                <Skull size={18} />
              </div>
              <div>
                <div className="results-danger-item-label">Threat Type</div>
                <div className="results-danger-item-value">{result.dangerProfile.threatType}</div>
              </div>
            </div>
            <div className="results-danger-item">
              <div className="results-danger-item-icon">
                <TriangleAlert size={18} />
              </div>
              <div>
                <div className="results-danger-item-label">Threat Level</div>
                <div className={`results-danger-item-value ${
                  result.dangerProfile.threatLevel === 'Critical' ? 'critical' : ''
                }`}>
                  {result.dangerProfile.threatLevel}
                </div>
              </div>
            </div>
            <div className="results-danger-item">
              <div className="results-danger-item-icon">
                <Eye size={18} />
              </div>
              <div>
                <div className="results-danger-item-label">Action Required</div>
                <div className="results-danger-item-value">{result.dangerProfile.actionRequired}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Safety / First Aid */}
      {result.firstAid && (result.firstAid.whatToDo?.length > 0 || result.firstAid.whatNotToDo?.length > 0) && (
        <div className="results-safety-section">
          <div className="results-safety-header">
            <Heart size={16} />
            {result.isDangerous ? 'Emergency First Aid' : 'Safety Guidance'}
          </div>
          <div className="results-safety-content">
            {result.firstAid.whatToDo?.length > 0 && (
              <div className="results-safety-column">
                <h4 className="do">● What To Do</h4>
                <ul className="results-safety-list">
                  {result.firstAid.whatToDo.map((item, i) => (
                    <li key={i} className="results-safety-item">
                      <ChevronRight size={14} color="var(--success)" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {result.firstAid.whatNotToDo?.length > 0 && (
              <div className="results-safety-column">
                <h4 className="dont">● What Not To Do</h4>
                <ul className="results-safety-list">
                  {result.firstAid.whatNotToDo.map((item, i) => (
                    <li key={i} className="results-safety-item">
                      <ChevronRight size={14} color="var(--danger)" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Conservation Status */}
      {result.conservationStatus && (
        <div className="results-conservation-section">
          <div className="results-conservation-header">
            <Leaf size={16} />
            Conservation Status
          </div>
          <div className="results-conservation-content">
            <div className="results-conservation-item">
              <div className="results-conservation-item-label">IUCN Status</div>
              <div className="results-conservation-item-value">
                {result.conservationStatus.iucnStatus}
              </div>
            </div>
            <div className="results-conservation-item">
              <div className="results-conservation-item-label">Population Trend</div>
              <div className="results-conservation-item-value" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                {getPopulationIcon()}
                {result.conservationStatus.populationTrend}
              </div>
            </div>
            <div className="results-conservation-item">
              <div className="results-conservation-item-label">Key Threats</div>
              <div className="results-threats-list">
                {result.conservationStatus.keyThreats?.map((threat, i) => (
                  <span key={i} className="tag">{threat}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Fun Facts */}
      {result.funFacts && result.funFacts.length > 0 && (
        <div className="results-facts-section">
          <div className="results-facts-title">
            <Sparkles size={16} />
            Did You Know?
          </div>
          <div className="results-facts-grid">
            {result.funFacts.map((fact, i) => (
              <div key={i} className="results-fact-card">
                <div className="results-fact-number">#{i + 1}</div>
                <div className="results-fact-text">{fact}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '24px' }}>
        <button className="btn btn-primary" onClick={onNewScan}>
          <ScanSearch size={16} />
          New Scan
        </button>
      </div>
    </div>
  );
}
