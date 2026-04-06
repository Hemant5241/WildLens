import {
  ScanSearch, ShieldCheck, ShieldAlert, MapPin, Activity, Skull,
  TriangleAlert, Eye, Heart, ChevronRight, Sparkles, Scale,
  Clock, Utensils, Leaf, TrendingDown, TrendingUp, Minus,
  Share2, Download, Crosshair,
} from 'lucide-react';
import type { AnalysisResult } from '../types';

interface ResultsPageProps {
  result: AnalysisResult;
  imageData: string;
  onNewScan: () => void;
  onShare: () => void;
}

export default function ResultsPage({ result, imageData, onNewScan, onShare }: ResultsPageProps) {
  const getStatusColor = () => {
    if (result.dangerLevel === 'Critical' || result.dangerLevel === 'High') return 'danger';
    if (result.dangerLevel === 'Medium') return 'warning';
    return 'success';
  };

  const statusColor = getStatusColor();

  const getDangerBadge = () => {
    switch (result.dangerLevel) {
      case 'Critical':
      case 'High':
        return 'badge-danger';
      case 'Medium':
        return 'badge-warning';
      default:
        return 'badge-success';
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
      {/* ===== HERO SECTION ===== */}
      <div className="flex flex-col lg:flex-row gap-8 mb-10">
        {/* Image */}
        <div className="relative w-full lg:max-w-[420px] aspect-[4/3] rounded-2xl overflow-hidden shrink-0 group">
          <img
            src={imageData}
            alt={result.commonName}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
          {/* Bottom scrim */}
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent pointer-events-none" />
          {/* AI Verified badge */}
          <div className="absolute top-4 left-4 inline-flex items-center gap-2 px-3 py-1.5 bg-surface-variant/60 backdrop-blur-md text-on-surface rounded-full font-mono text-[10px] tracking-[0.15em] uppercase z-10">
            <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_6px_rgba(78,222,163,0.8)]" />
            AI Verified
          </div>
          {/* Confidence overlay */}
          <div className="absolute bottom-4 right-4 flex items-center gap-2 px-3 py-1.5 bg-surface-variant/60 backdrop-blur-md rounded-full z-10">
            <Crosshair size={12} className="text-primary" />
            <span className="font-display font-bold text-sm text-primary">
              {result.confidence}%
            </span>
          </div>
        </div>

        {/* Species Info */}
        <div className="flex flex-col justify-center flex-1 py-2">
          <div className="inline-flex items-center gap-1.5 text-primary text-xs font-mono uppercase tracking-[0.25em] mb-3">
            <ScanSearch size={13} /> Species Identified
          </div>
          <h1 className="font-display font-extrabold text-4xl md:text-5xl text-on-surface tracking-tight leading-[1.05] mb-2">
            {result.commonName}
          </h1>
          <p className="font-body italic text-lg text-on-surface-variant/80 mb-5">
            {result.scientificName}
          </p>

          {/* Tags row */}
          <div className="flex flex-wrap gap-2 mb-6">
            {result.category && <span className="tag">{result.category}</span>}
            {result.alternateNames?.map((name, i) => (
              <span key={i} className="tag">{name}</span>
            ))}
          </div>

          {/* Status badges */}
          <div className="flex flex-wrap items-center gap-3 mb-8">
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-display text-sm font-bold tracking-wider ${
              statusColor === 'danger'
                ? 'bg-danger/10 text-danger'
                : statusColor === 'warning'
                ? 'bg-warning/10 text-warning'
                : 'bg-success/10 text-success'
            }`}>
              {result.isDangerous ? <ShieldAlert size={16} /> : <ShieldCheck size={16} />}
              {result.venomousStatus || (result.isDangerous ? 'DANGEROUS' : 'SAFE')}
            </div>
            <span className={`badge ${getDangerBadge()}`}>
              {result.dangerLevel}
            </span>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3">
            <button className="btn btn-secondary text-xs" onClick={onShare}>
              <Share2 size={13} /> Share
            </button>
            <button className="btn btn-secondary text-xs" onClick={handleDownload}>
              <Download size={13} /> Export
            </button>
          </div>
        </div>
      </div>

      {/* ===== QUICK STATS ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        {[
          { icon: <Utensils size={18} />, label: 'Diet', value: result.dietInfo, color: 'info' },
          { icon: <Clock size={18} />, label: 'Lifespan', value: result.lifespanInfo, color: 'warning' },
          { icon: <Scale size={18} />, label: 'Size', value: result.sizeInfo, color: 'primary' },
        ].map((stat, i) => (
          <div key={i} className="glass-card p-5 rounded-xl flex items-start gap-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
              stat.color === 'info' ? 'bg-info/10 text-info' :
              stat.color === 'warning' ? 'bg-warning/10 text-warning' :
              'bg-primary/10 text-primary'
            }`}>
              {stat.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-mono text-[10px] uppercase tracking-[0.15em] text-on-surface-muted mb-1">{stat.label}</div>
              <div className="font-body text-sm font-medium text-on-surface leading-snug">{stat.value || 'N/A'}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ===== MAIN CONTENT GRID ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2/3) */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          {/* Habitat & Behavior */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="glass-card p-6 rounded-xl">
              <div className="flex items-center gap-2 font-display text-xs font-bold tracking-[0.15em] text-on-surface uppercase mb-4">
                <MapPin size={14} className="text-primary" /> Habitat
              </div>
              <p className="font-body text-sm text-on-surface-variant leading-relaxed">{result.habitat}</p>
            </div>
            <div className="glass-card p-6 rounded-xl">
              <div className="flex items-center gap-2 font-display text-xs font-bold tracking-[0.15em] text-on-surface uppercase mb-4">
                <Activity size={14} className="text-primary" /> Behavior
              </div>
              <p className="font-body text-sm text-on-surface-variant leading-relaxed">{result.behavior}</p>
            </div>
          </div>

          {/* Fun Facts */}
          {result.funFacts && result.funFacts.length > 0 && (
            <div>
              <div className="flex items-center gap-2 font-display text-xs font-bold tracking-[0.15em] text-on-surface uppercase mb-5">
                <Sparkles size={14} className="text-warning" /> Did You Know?
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {result.funFacts.map((fact, i) => (
                  <div
                    key={i}
                    className="glass-card p-5 rounded-xl relative group hover:-translate-y-0.5 transition-transform duration-300"
                  >
                    <div className="absolute -top-2.5 left-4 bg-surface-container-high text-warning px-2.5 py-0.5 rounded text-[10px] font-mono font-bold tracking-wider">
                      #{i + 1}
                    </div>
                    <p className="font-body text-sm text-on-surface leading-relaxed mt-1.5">{fact}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column (1/3) */}
        <div className="flex flex-col gap-6">
          {/* Danger Profile */}
          {result.isDangerous && result.dangerProfile && (
            <div className="glass-card rounded-xl overflow-hidden relative">
              {/* Red accent strip */}
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-danger/60 via-danger to-danger/60" />
              <div className="bg-danger/5 px-5 py-3 flex items-center gap-2 font-display text-xs font-bold tracking-[0.1em] text-danger uppercase">
                <ShieldAlert size={14} /> Danger Profile
              </div>
              <div className="p-5 flex flex-col gap-5">
                {[
                  { icon: <Skull size={16} />, label: 'Threat Type', value: result.dangerProfile.threatType },
                  { icon: <TriangleAlert size={16} />, label: 'Threat Level', value: result.dangerProfile.threatLevel },
                  { icon: <Eye size={16} />, label: 'Action Required', value: result.dangerProfile.actionRequired },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-on-surface-muted shrink-0">
                      {item.icon}
                    </div>
                    <div>
                      <div className="font-mono text-[10px] tracking-[0.15em] uppercase text-on-surface-muted mb-0.5">{item.label}</div>
                      <div className={`font-body text-sm font-medium ${
                        item.label === 'Threat Level' && (item.value === 'Critical' || item.value === 'High')
                          ? 'text-danger font-bold'
                          : 'text-on-surface'
                      }`}>
                        {item.value}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* First Aid */}
          {result.firstAid && (result.firstAid.whatToDo?.length > 0 || result.firstAid.whatNotToDo?.length > 0) && (
            <div className="glass-card rounded-xl overflow-hidden">
              <div className="bg-surface-container/60 px-5 py-3 flex items-center gap-2 font-display text-xs font-bold tracking-[0.1em] text-on-surface uppercase">
                <Heart size={14} className={result.isDangerous ? 'text-danger' : 'text-primary'} />
                {result.isDangerous ? 'Emergency First Aid' : 'Safety Guidance'}
              </div>
              <div className="p-5 flex flex-col gap-5">
                {result.firstAid.whatToDo?.length > 0 && (
                  <div>
                    <h4 className="font-mono text-[10px] font-bold text-success uppercase tracking-[0.15em] mb-3">✓ What To Do</h4>
                    <ul className="flex flex-col gap-2">
                      {result.firstAid.whatToDo.map((item, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <ChevronRight size={12} className="text-success shrink-0 mt-0.5" />
                          <span className="font-body text-[13px] text-on-surface leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {result.firstAid.whatNotToDo?.length > 0 && (
                  <div>
                    <h4 className="font-mono text-[10px] font-bold text-danger uppercase tracking-[0.15em] mb-3">✗ What Not To Do</h4>
                    <ul className="flex flex-col gap-2">
                      {result.firstAid.whatNotToDo.map((item, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <ChevronRight size={12} className="text-danger shrink-0 mt-0.5" />
                          <span className="font-body text-[13px] text-on-surface leading-relaxed">{item}</span>
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
            <div className="glass-card rounded-xl overflow-hidden">
              <div className="bg-surface-container/60 px-5 py-3 flex items-center gap-2 font-display text-xs font-bold tracking-[0.1em] text-on-surface uppercase">
                <Leaf size={14} className="text-success" /> Conservation
              </div>
              <div className="p-5 flex flex-col gap-4">
                <div>
                  <div className="font-mono text-[10px] tracking-[0.15em] uppercase text-on-surface-muted mb-1.5">IUCN Status</div>
                  <div className="inline-block font-body text-sm font-semibold text-on-surface bg-surface-container-high px-3 py-1.5 rounded-lg">
                    {result.conservationStatus.iucnStatus}
                  </div>
                </div>
                <div>
                  <div className="font-mono text-[10px] tracking-[0.15em] uppercase text-on-surface-muted mb-1.5">Population Trend</div>
                  <div className="font-body text-sm font-medium text-on-surface flex items-center gap-2">
                    {getPopulationIcon()}
                    {result.conservationStatus.populationTrend}
                  </div>
                </div>
                <div>
                  <div className="font-mono text-[10px] tracking-[0.15em] uppercase text-on-surface-muted mb-2">Key Threats</div>
                  <div className="flex flex-wrap gap-1.5">
                    {result.conservationStatus.keyThreats?.map((threat, i) => (
                      <span key={i} className="tag text-[10px]">{threat}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Action */}
      <div className="flex justify-center mt-14">
        <button className="btn btn-primary px-10 py-3 text-sm" onClick={onNewScan}>
          <ScanSearch size={18} /> New Scan
        </button>
      </div>
    </div>
  );
}
