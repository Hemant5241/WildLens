import {
  ScanSearch, ShieldCheck, ShieldAlert, MapPin, Activity, Skull,
  TriangleAlert, Eye, Heart, ChevronRight, Sparkles, Scale,
  Clock, Utensils, Leaf, TrendingDown, TrendingUp, Minus,
  Share2, Download,
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
    if (result.dangerLevel === 'Critical' || result.dangerLevel === 'High') return 'text-danger bg-danger/10 border border-danger/30';
    if (result.dangerLevel === 'Medium') return 'text-warning bg-warning/10 border border-warning/30';
    return 'text-success bg-success/10 border border-success/30';
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
    a.download = `wildlens-${result.commonName?.replace(/\s+/g, '-').toLowerCase() || 'analysis'}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="animate-fade-in w-full pb-16">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row gap-8 mb-8 backdrop-blur-md bg-surface-container-lowest border border-surface-container-high rounded-2xl p-6 md:p-8 shadow-xl">
        <div className="relative w-full lg:max-w-[400px] aspect-square lg:aspect-[4/3] rounded-xl overflow-hidden bg-surface-container border border-surface-container-high shrink-0 group">
          <img src={imageData} alt={result.commonName} className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" />
          <div className="absolute top-4 left-4 inline-flex items-center gap-2 px-3 py-1.5 bg-surface/80 backdrop-blur-md border border-outline text-on-surface rounded-full font-mono text-[0.65rem] tracking-[0.1em] uppercase shadow-lg z-10 hover:border-primary transition-colors">
            <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-glow shadow-primary" />
            AI Verified
          </div>
          <div className="absolute inset-0 border border-primary/20 rounded-xl pointer-events-none" />
        </div>

        <div className="flex flex-col justify-center flex-1">
          <div className="inline-flex items-center gap-1.5 text-primary text-xs font-mono uppercase tracking-[0.2em] mb-2">
            <ScanSearch size={14} /> Identified
          </div>
          <h1 className="font-display font-extrabold text-4xl md:text-5xl text-on-surface tracking-tight leading-[1.1] mb-2">{result.commonName}</h1>
          <p className="font-body italic text-lg text-on-surface-variant mb-6">{result.scientificName}</p>
          
          <div className="flex flex-wrap gap-2 mb-8">
            {result.alternateNames?.map((name, i) => (
              <span key={i} className="tag">{name}</span>
            ))}
            {result.category && <span className="tag">{result.category}</span>}
          </div>

          <div className="flex flex-wrap gap-3 mt-auto pt-6 border-t border-surface-container-high">
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
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-surface-container-lowest border border-surface-container-high rounded-xl p-5 flex justify-between items-center">
          <div className="font-mono text-[0.7rem] uppercase tracking-[0.15em] text-on-surface-variant">Status</div>
          <div className={`px-4 py-2 rounded-lg font-display text-sm font-bold tracking-widest flex items-center gap-2 ${getStatusClass()}`}>
            {getStatusIcon()}
            {result.venomousStatus || (result.isDangerous ? 'DANGEROUS' : 'SAFE')}
          </div>
        </div>

        <div className="bg-surface-container-lowest border border-surface-container-high rounded-xl p-5 flex justify-between items-center">
          <div className="font-mono text-[0.7rem] uppercase tracking-[0.15em] text-on-surface-variant">Danger Level</div>
          <div className="flex items-center">
            <span className={`badge text-sm py-1.5 px-4 ${getDangerBadge()}`}>
              {result.dangerLevel}
            </span>
          </div>
        </div>

        <div className="bg-surface-container-lowest border border-surface-container-high rounded-xl p-5 flex flex-col justify-center relative overflow-hidden">
          <div className="flex justify-between items-end mb-3 z-10 relative">
            <div className="font-mono text-[0.7rem] uppercase tracking-[0.15em] text-on-surface-variant">Confidence</div>
            <div className="font-display font-bold text-2xl leading-none text-primary">
              {result.confidence}
              <span className="text-sm font-body text-primary/70">%</span>
            </div>
          </div>
          <div className="w-full h-1.5 bg-surface-container-high rounded-full overflow-hidden relative z-10 border border-outline">
            <div className="h-full bg-gradient-to-r from-primary to-primary-container rounded-full" style={{ width: `${result.confidence}%` }} />
          </div>
          <div className="absolute right-[-10px] bottom-[-20px] text-primary/5 rotate-[-15deg] pointer-events-none z-0">
            <ScanSearch size={100} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 flex flex-col gap-8">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex flex-col bg-surface-container-low border border-surface-container-high rounded-xl p-5 border-l-2 border-l-info shadow-sm">
              <div className="w-8 h-8 rounded-lg bg-info/10 text-info flex items-center justify-center mb-3"><Utensils size={18} /></div>
              <div className="font-mono text-[0.65rem] uppercase tracking-[0.15em] text-info/80 mb-1">Diet</div>
              <div className="font-body text-sm font-medium leading-relaxed text-on-surface">{result.dietInfo || 'N/A'}</div>
            </div>
            <div className="flex flex-col bg-surface-container-low border border-surface-container-high rounded-xl p-5 border-l-2 border-l-warning shadow-sm">
              <div className="w-8 h-8 rounded-lg bg-warning/10 text-warning flex items-center justify-center mb-3"><Clock size={18} /></div>
              <div className="font-mono text-[0.65rem] uppercase tracking-[0.15em] text-warning/80 mb-1">Lifespan</div>
              <div className="font-body text-sm font-medium leading-relaxed text-on-surface">{result.lifespanInfo || 'N/A'}</div>
            </div>
            <div className="flex flex-col bg-surface-container-low border border-surface-container-high rounded-xl p-5 border-l-2 border-l-primary shadow-sm">
              <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-3"><Scale size={18} /></div>
              <div className="font-mono text-[0.65rem] uppercase tracking-[0.15em] text-primary/80 mb-1">Size</div>
              <div className="font-body text-sm font-medium leading-relaxed text-on-surface">{result.sizeInfo || 'N/A'}</div>
            </div>
          </div>

          {/* Habitat & Behavior */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 bg-surface-container-lowest border border-surface-container-high rounded-xl p-6">
              <div className="flex items-center gap-2 font-display text-base font-semibold tracking-wide text-on-surface mb-3 uppercase">
                <MapPin size={16} className="text-primary" /> Habitat
              </div>
              <p className="font-body text-sm text-on-surface-variant leading-relaxed">{result.habitat}</p>
            </div>
            <div className="flex-1 bg-surface-container-lowest border border-surface-container-high rounded-xl p-6">
              <div className="flex items-center gap-2 font-display text-base font-semibold tracking-wide text-on-surface mb-3 uppercase">
                <Activity size={16} className="text-primary" /> Behavior
              </div>
              <p className="font-body text-sm text-on-surface-variant leading-relaxed">{result.behavior}</p>
            </div>
          </div>

          {/* Fun Facts */}
          {result.funFacts && result.funFacts.length > 0 && (
            <div>
              <div className="flex items-center gap-2 font-display text-sm font-bold tracking-[0.15em] text-on-surface mb-4 uppercase">
                <Sparkles size={16} className="text-warning" /> Did You Know?
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {result.funFacts.map((fact, i) => (
                  <div key={i} className="bg-surface-container-low border border-outline-variant rounded-xl p-5 relative border-l-[3px] border-l-warning group hover:-translate-y-1 transition-transform">
                    <div className="absolute top-[-10px] left-3 bg-surface-container-high text-warning border border-outline px-2 py-0.5 rounded text-[10px] font-mono font-bold tracking-wider">#{i + 1}</div>
                    <div className="font-body text-sm text-on-surface leading-relaxed mt-2">{fact}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-6">
          {/* Danger Profile */}
          {result.isDangerous && result.dangerProfile && (
            <div className="bg-danger/5 border border-danger/20 rounded-xl overflow-hidden relative shadow-lg shadow-danger/5">
              <div className="absolute top-0 left-0 w-1 h-full bg-danger" />
              <div className="bg-danger/10 px-5 py-3 border-b border-danger/10 flex items-center gap-2 font-display text-xs font-bold tracking-[0.1em] text-danger uppercase">
                <ShieldAlert size={16} /> Danger Profile
              </div>
              <div className="p-5 flex flex-col gap-5">
                <div className="flex items-start gap-4">
                  <div className="bg-surface border border-outline rounded-lg p-2 text-on-surface-variant shrink-0 mt-1"><Skull size={18} /></div>
                  <div className="flex-1">
                    <div className="font-mono text-[0.65rem] tracking-[0.1em] uppercase text-on-surface-muted mb-1">Threat Type</div>
                    <div className="font-body text-sm font-medium text-on-surface">{result.dangerProfile.threatType}</div>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-surface border border-outline rounded-lg p-2 text-on-surface-variant shrink-0 mt-1"><TriangleAlert size={18} /></div>
                  <div className="flex-1">
                    <div className="font-mono text-[0.65rem] tracking-[0.1em] uppercase text-on-surface-muted mb-1">Threat Level</div>
                    <div className={`font-body text-sm font-medium ${result.dangerProfile.threatLevel === 'Critical' ? 'text-danger font-bold' : 'text-warning'}`}>
                      {result.dangerProfile.threatLevel}
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-surface border border-outline rounded-lg p-2 text-on-surface-variant shrink-0 mt-1"><Eye size={18} /></div>
                  <div className="flex-1">
                    <div className="font-mono text-[0.65rem] tracking-[0.1em] uppercase text-on-surface-muted mb-1">Action Required</div>
                    <div className="font-body text-sm font-medium text-on-surface">{result.dangerProfile.actionRequired}</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Safety / First Aid */}
          {result.firstAid && (result.firstAid.whatToDo?.length > 0 || result.firstAid.whatNotToDo?.length > 0) && (
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm">
              <div className="bg-surface-container-low px-5 py-3 border-b border-outline flex items-center gap-2 font-display text-xs font-bold tracking-[0.1em] text-on-surface uppercase">
                <Heart size={16} className={result.isDangerous ? 'text-danger' : 'text-primary'} />
                {result.isDangerous ? 'Emergency First Aid' : 'Safety Guidance'}
              </div>
              <div className="p-5 flex flex-col gap-6">
                {result.firstAid.whatToDo?.length > 0 && (
                  <div>
                    <h4 className="font-mono text-xs font-bold text-success uppercase tracking-wider mb-3">● What To Do</h4>
                    <ul className="flex flex-col gap-2">
                      {result.firstAid.whatToDo.map((item, i) => (
                        <li key={i} className="flex pl-1">
                          <ChevronRight size={14} className="text-success shrink-0 mt-0.5 mr-2" />
                          <span className="font-body text-[0.85rem] text-on-surface leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {result.firstAid.whatNotToDo?.length > 0 && (
                  <div>
                    <h4 className="font-mono text-xs font-bold text-danger uppercase tracking-wider mb-3">● What Not To Do</h4>
                    <ul className="flex flex-col gap-2">
                      {result.firstAid.whatNotToDo.map((item, i) => (
                        <li key={i} className="flex pl-1">
                          <ChevronRight size={14} className="text-danger shrink-0 mt-0.5 mr-2" />
                          <span className="font-body text-[0.85rem] text-on-surface leading-relaxed">{item}</span>
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
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm">
              <div className="bg-surface-container-low px-5 py-3 border-b border-outline flex items-center gap-2 font-display text-xs font-bold tracking-[0.1em] text-on-surface uppercase">
                <Leaf size={16} className="text-success" /> Conservation Status
              </div>
              <div className="p-5 flex flex-col gap-5">
                <div>
                  <div className="font-mono text-[0.65rem] tracking-[0.1em] uppercase text-on-surface-muted mb-1">IUCN Status</div>
                  <div className="font-body text-sm font-semibold text-on-surface border border-outline/50 bg-background rounded-md px-3 py-1.5 inline-block">
                    {result.conservationStatus.iucnStatus}
                  </div>
                </div>
                <div>
                  <div className="font-mono text-[0.65rem] tracking-[0.1em] uppercase text-on-surface-muted mb-1">Population Trend</div>
                  <div className="font-body text-sm font-medium text-on-surface flex items-center gap-2">
                    {getPopulationIcon()}
                    {result.conservationStatus.populationTrend}
                  </div>
                </div>
                <div>
                  <div className="font-mono text-[0.65rem] tracking-[0.1em] uppercase text-on-surface-muted mb-2">Key Threats</div>
                  <div className="flex flex-wrap gap-2">
                    {result.conservationStatus.keyThreats?.map((threat, i) => (
                      <span key={i} className="tag text-[0.6rem] py-0.5">{threat}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center mt-12 pb-8">
        <button className="btn btn-primary px-8 py-3 w-full sm:w-auto text-sm" onClick={onNewScan}>
          <ScanSearch size={18} /> New Scan
        </button>
      </div>
    </div>
  );
}
