import { useState } from 'react';
import {
  ScanSearch, ShieldCheck, ShieldAlert, MapPin, Activity, Skull,
  TriangleAlert, Eye, Heart, ChevronRight, ChevronDown, Sparkles,
  Scale, Clock, Utensils, Leaf, TrendingDown, TrendingUp, Minus,
  Share2, Download, Crosshair,
} from 'lucide-react';
import type { AnalysisResult } from '../types';

interface ResultsPageProps {
  result: AnalysisResult;
  imageData: string;
  onNewScan: () => void;
  onShare: () => void;
}

/* Collapsible section */
function Section({ title, icon, children, defaultOpen = false }: {
  title: string; icon: React.ReactNode; children: React.ReactNode; defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="glass-card rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-3.5 bg-surface-container/40 hover:bg-surface-container/60 transition-colors"
      >
        <div className="flex items-center gap-2 font-display text-xs font-bold tracking-[0.12em] text-on-surface uppercase">
          {icon} {title}
        </div>
        <ChevronDown
          size={14}
          className={`text-on-surface-muted transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && <div className="p-5">{children}</div>}
    </div>
  );
}

export default function ResultsPage({ result, imageData, onNewScan, onShare }: ResultsPageProps) {
  const statusColor =
    result.dangerLevel === 'Critical' || result.dangerLevel === 'High'
      ? 'danger'
      : result.dangerLevel === 'Medium'
      ? 'warning'
      : 'success';

  const getDangerBadge = () => {
    switch (result.dangerLevel) {
      case 'Critical':
      case 'High': return 'badge-danger';
      case 'Medium': return 'badge-warning';
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

  // Limit fun facts to 2
  const displayFacts = result.funFacts?.slice(0, 2) || [];

  return (
    <div className="animate-fade-in w-full pb-12">
      {/* ===== HERO — Image + Species ID ===== */}
      <div className="flex flex-col md:flex-row gap-6 mb-8">
        {/* Image */}
        <div className="relative w-full md:w-[320px] lg:w-[380px] aspect-[4/3] rounded-2xl overflow-hidden shrink-0 group">
          <img
            src={imageData}
            alt={result.commonName}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent pointer-events-none" />
          {/* AI badge */}
          <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-1 bg-surface-variant/60 backdrop-blur-md text-on-surface rounded-full font-mono text-[9px] tracking-[0.12em] uppercase z-10">
            <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_6px_rgba(78,222,163,0.8)]" />
            Verified
          </div>
          {/* Confidence */}
          <div className="absolute bottom-3 right-3 flex items-center gap-1.5 px-2.5 py-1 bg-surface-variant/60 backdrop-blur-md rounded-full z-10">
            <Crosshair size={11} className="text-primary" />
            <span className="font-display font-bold text-xs text-primary">{result.confidence}%</span>
          </div>
        </div>

        {/* Species Info */}
        <div className="flex flex-col justify-center flex-1 min-w-0">
          <div className="inline-flex items-center gap-1.5 text-primary text-[10px] font-mono uppercase tracking-[0.2em] mb-2">
            <ScanSearch size={12} /> Identified
          </div>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl md:text-4xl text-on-surface tracking-tight leading-[1.1] mb-1">
            {result.commonName}
          </h1>
          <p className="font-body italic text-sm text-on-surface-variant/80 mb-4">
            {result.scientificName}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {result.category && <span className="tag text-[10px]">{result.category}</span>}
            {result.alternateNames?.slice(0, 3).map((name, i) => (
              <span key={i} className="tag text-[10px]">{name}</span>
            ))}
          </div>

          {/* Status + Danger in a single row */}
          <div className="flex flex-wrap items-center gap-2 mb-5">
            <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-display text-xs font-bold tracking-wider ${
              statusColor === 'danger' ? 'bg-danger/10 text-danger'
                : statusColor === 'warning' ? 'bg-warning/10 text-warning'
                : 'bg-success/10 text-success'
            }`}>
              {result.isDangerous ? <ShieldAlert size={14} /> : <ShieldCheck size={14} />}
              {result.isDangerous ? 'Dangerous' : 'Safe'}
            </div>
            <span className={`badge text-[10px] ${getDangerBadge()}`}>{result.dangerLevel}</span>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button className="btn btn-secondary text-xs py-2 px-4" onClick={onShare}>
              <Share2 size={12} /> Share
            </button>
            <button className="btn btn-secondary text-xs py-2 px-4" onClick={handleDownload}>
              <Download size={12} /> Export
            </button>
          </div>
        </div>
      </div>

      {/* ===== QUICK STATS (compact single row) ===== */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        {[
          { icon: <Utensils size={15} />, label: 'Diet', value: result.dietInfo, color: 'text-info' },
          { icon: <Clock size={15} />, label: 'Lifespan', value: result.lifespanInfo, color: 'text-warning' },
          { icon: <Scale size={15} />, label: 'Size', value: result.sizeInfo, color: 'text-primary' },
        ].map((stat, i) => (
          <div key={i} className="glass-card p-3.5 sm:p-4 rounded-xl">
            <div className="flex items-center gap-2 mb-1.5">
              <span className={stat.color}>{stat.icon}</span>
              <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-on-surface-muted">{stat.label}</span>
            </div>
            <div className="font-body text-xs sm:text-sm font-medium text-on-surface leading-snug line-clamp-2">
              {stat.value || 'N/A'}
            </div>
          </div>
        ))}
      </div>

      {/* ===== DETAILS — Two column on desktop, stacked on mobile ===== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Habitat */}
        <div className="glass-card p-5 rounded-xl">
          <div className="flex items-center gap-2 font-display text-xs font-bold tracking-[0.12em] text-on-surface uppercase mb-3">
            <MapPin size={13} className="text-primary" /> Habitat
          </div>
          <p className="font-body text-sm text-on-surface-variant leading-relaxed line-clamp-3">{result.habitat}</p>
        </div>
        {/* Behavior */}
        <div className="glass-card p-5 rounded-xl">
          <div className="flex items-center gap-2 font-display text-xs font-bold tracking-[0.12em] text-on-surface uppercase mb-3">
            <Activity size={13} className="text-primary" /> Behavior
          </div>
          <p className="font-body text-sm text-on-surface-variant leading-relaxed line-clamp-3">{result.behavior}</p>
        </div>
      </div>

      {/* ===== Fun Facts (max 2, compact) ===== */}
      {displayFacts.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 font-display text-xs font-bold tracking-[0.12em] text-on-surface uppercase mb-3">
            <Sparkles size={13} className="text-warning" /> Fun Facts
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {displayFacts.map((fact, i) => (
              <div key={i} className="glass-card p-4 rounded-xl relative">
                <span className="font-mono text-[9px] text-warning font-bold tracking-wider mr-2">#{i + 1}</span>
                <span className="font-body text-sm text-on-surface leading-relaxed">{fact}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ===== COLLAPSIBLE SECTIONS (tap to expand) ===== */}
      <div className="flex flex-col gap-3">
        {/* Danger Profile */}
        {result.isDangerous && result.dangerProfile && (
          <Section
            title="Danger Profile"
            icon={<ShieldAlert size={13} className="text-danger" />}
            defaultOpen={true}
          >
            <div className="flex flex-col gap-4">
              {[
                { icon: <Skull size={14} />, label: 'Threat Type', value: result.dangerProfile.threatType },
                { icon: <TriangleAlert size={14} />, label: 'Threat Level', value: result.dangerProfile.threatLevel },
                { icon: <Eye size={14} />, label: 'Action', value: result.dangerProfile.actionRequired },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-surface-container-high flex items-center justify-center text-on-surface-muted shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <div className="font-mono text-[9px] tracking-[0.12em] uppercase text-on-surface-muted">{item.label}</div>
                    <div className={`font-body text-sm font-medium ${
                      item.label === 'Threat Level' && (item.value === 'Critical' || item.value === 'High')
                        ? 'text-danger font-bold' : 'text-on-surface'
                    }`}>
                      {item.value}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Safety / First Aid — collapsed by default */}
        {result.firstAid && (result.firstAid.whatToDo?.length > 0 || result.firstAid.whatNotToDo?.length > 0) && (
          <Section
            title={result.isDangerous ? 'First Aid' : 'Safety Tips'}
            icon={<Heart size={13} className={result.isDangerous ? 'text-danger' : 'text-primary'} />}
          >
            <div className="flex flex-col gap-4">
              {result.firstAid.whatToDo?.length > 0 && (
                <div>
                  <h4 className="font-mono text-[9px] font-bold text-success uppercase tracking-[0.12em] mb-2">✓ Do</h4>
                  <ul className="flex flex-col gap-1.5">
                    {result.firstAid.whatToDo.slice(0, 3).map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <ChevronRight size={10} className="text-success shrink-0 mt-1" />
                        <span className="font-body text-xs text-on-surface leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {result.firstAid.whatNotToDo?.length > 0 && (
                <div>
                  <h4 className="font-mono text-[9px] font-bold text-danger uppercase tracking-[0.12em] mb-2">✗ Don't</h4>
                  <ul className="flex flex-col gap-1.5">
                    {result.firstAid.whatNotToDo.slice(0, 3).map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <ChevronRight size={10} className="text-danger shrink-0 mt-1" />
                        <span className="font-body text-xs text-on-surface leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </Section>
        )}

        {/* Conservation — collapsed by default */}
        {result.conservationStatus && (
          <Section title="Conservation" icon={<Leaf size={13} className="text-success" />}>
            <div className="flex flex-col sm:flex-row sm:items-start gap-4">
              <div className="flex-1">
                <div className="font-mono text-[9px] tracking-[0.12em] uppercase text-on-surface-muted mb-1">IUCN Status</div>
                <div className="inline-block font-body text-sm font-semibold text-on-surface bg-surface-container-high px-3 py-1 rounded-lg">
                  {result.conservationStatus.iucnStatus}
                </div>
              </div>
              <div className="flex-1">
                <div className="font-mono text-[9px] tracking-[0.12em] uppercase text-on-surface-muted mb-1">Population</div>
                <div className="font-body text-sm font-medium text-on-surface flex items-center gap-1.5">
                  {getPopulationIcon()}
                  {result.conservationStatus.populationTrend}
                </div>
              </div>
            </div>
            {result.conservationStatus.keyThreats && result.conservationStatus.keyThreats.length > 0 && (
              <div className="mt-3">
                <div className="font-mono text-[9px] tracking-[0.12em] uppercase text-on-surface-muted mb-1.5">Threats</div>
                <div className="flex flex-wrap gap-1.5">
                  {result.conservationStatus.keyThreats.slice(0, 4).map((threat, i) => (
                    <span key={i} className="tag text-[9px]">{threat}</span>
                  ))}
                </div>
              </div>
            )}
          </Section>
        )}
      </div>

      {/* ===== Bottom CTA ===== */}
      <div className="flex justify-center mt-10">
        <button className="btn btn-primary px-8 py-2.5 text-sm" onClick={onNewScan}>
          <ScanSearch size={16} /> New Scan
        </button>
      </div>
    </div>
  );
}
