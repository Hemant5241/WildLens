import {
  ScanSearch, ShieldCheck, ShieldAlert, MapPin, Activity,
  Heart, ChevronRight, Share2, Download, Crosshair,
} from 'lucide-react';
import type { AnalysisResult } from '../types';

interface ResultsPageProps {
  result: AnalysisResult;
  imageData: string;
  onNewScan: () => void;
  onShare: () => void;
}

export default function ResultsPage({ result, imageData, onNewScan, onShare }: ResultsPageProps) {
  const isDangerous = result.isDangerous;

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
    <div className="animate-fade-in w-full pb-10 max-w-[960px] mx-auto">

      {/* ═══════ HERO SECTION ═══════ */}
      <div className="glass-card rounded-2xl overflow-hidden mb-5">
        <div className="flex flex-col sm:flex-row">
          {/* Image */}
          <div className="relative w-full sm:w-[240px] md:w-[280px] aspect-[4/3] sm:aspect-auto shrink-0">
            <img
              src={imageData}
              alt={result.commonName}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-1 bg-primary/80 text-on-primary rounded font-mono text-[8px] tracking-[0.15em] uppercase font-bold">
              <div className="w-1.5 h-1.5 rounded-full bg-on-primary animate-pulse-soft" />
              AI Verified
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 p-5 sm:p-6 flex flex-col justify-center">
            <div className="inline-flex items-center gap-1.5 text-primary text-[10px] font-mono uppercase tracking-[0.2em] mb-1.5">
              <ScanSearch size={12} /> Identified
            </div>
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-on-surface tracking-tight leading-tight mb-0.5">
              {result.commonName}
            </h1>
            <p className="font-body italic text-sm text-on-surface-variant/60 mb-3">
              {result.scientificName}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {result.category && <span className="tag text-[9px]">{result.category}</span>}
              {result.alternateNames?.slice(0, 3).map((name, i) => (
                <span key={i} className="tag text-[9px]">{name}</span>
              ))}
            </div>
          </div>
        </div>

        {/* ═══ Stats Row ═══ */}
        <div className="grid grid-cols-3 border-t border-surface-container-high/50">
          {/* Status */}
          <div className="p-4 sm:p-5">
            <div className="font-mono text-[8px] tracking-[0.15em] text-on-surface-muted uppercase mb-2">Status</div>
            <div className={`inline-flex items-center gap-1.5 font-display text-sm font-bold tracking-wide ${
              isDangerous ? 'text-danger' : 'text-success'
            }`}>
              {isDangerous ? <ShieldAlert size={15} /> : <ShieldCheck size={15} />}
              {result.venomousStatus || (isDangerous ? 'DANGEROUS' : 'NON-VENOMOUS')}
            </div>
          </div>

          {/* Danger Level */}
          <div className="p-4 sm:p-5 border-l border-surface-container-high/50">
            <div className="font-mono text-[8px] tracking-[0.15em] text-on-surface-muted uppercase mb-2">Danger Level</div>
            <span className={`inline-block px-3 py-1 rounded text-xs font-display font-bold tracking-wider ${
              result.dangerLevel === 'Critical' || result.dangerLevel === 'High'
                ? 'bg-danger/20 text-danger'
                : result.dangerLevel === 'Medium'
                ? 'bg-warning/20 text-warning'
                : 'bg-success/20 text-success'
            }`}>
              {result.dangerLevel}
            </span>
          </div>

          {/* Confidence */}
          <div className="p-4 sm:p-5 border-l border-surface-container-high/50">
            <div className="font-mono text-[8px] tracking-[0.15em] text-on-surface-muted uppercase mb-2">Confidence</div>
            <div className="flex items-center gap-1.5">
              <Crosshair size={14} className="text-primary" />
              <span className="font-display font-extrabold text-2xl text-on-surface tracking-tight">{result.confidence}</span>
              <span className="font-mono text-[10px] text-on-surface-muted mt-1">%</span>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════ HABITAT & BEHAVIOR — Two cards side by side ═══════ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
        <div className="glass-card p-5 rounded-xl">
          <div className="flex items-center gap-2 font-display text-[11px] font-bold tracking-[0.12em] text-on-surface uppercase mb-3">
            <MapPin size={13} className="text-primary" /> Habitat
          </div>
          <p className="font-body text-sm text-on-surface-variant leading-relaxed">
            {result.habitat}
          </p>
        </div>

        <div className="glass-card p-5 rounded-xl">
          <div className="flex items-center gap-2 font-display text-[11px] font-bold tracking-[0.12em] text-on-surface uppercase mb-3">
            <Activity size={13} className="text-primary" /> Behavior
          </div>
          <p className="font-body text-sm text-on-surface-variant leading-relaxed">
            {result.behavior}
          </p>
        </div>
      </div>

      {/* ═══════ FIRST AID / SAFETY — Full width ═══════ */}
      {result.firstAid && (result.firstAid.whatToDo?.length > 0 || result.firstAid.whatNotToDo?.length > 0) && (
        <div className="glass-card rounded-xl overflow-hidden mb-5">
          {/* Header */}
          <div className="px-5 py-3 bg-surface-container/40 flex items-center gap-2">
            <Heart size={14} className={isDangerous ? 'text-danger' : 'text-primary'} />
            <span className="font-display text-[11px] font-bold tracking-[0.12em] text-on-surface uppercase">
              {isDangerous ? 'Emergency First Aid' : 'Safety Guidance'}
            </span>
          </div>

          {/* Do / Don't columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-surface-container-high/50 p-5 gap-5 sm:gap-0">
            {result.firstAid.whatToDo && result.firstAid.whatToDo.length > 0 && (
              <div className="sm:pr-5">
                <div className="flex items-center gap-1.5 mb-3">
                  <div className="w-2 h-2 rounded-full bg-success" />
                  <span className="font-mono text-[9px] font-bold text-success uppercase tracking-[0.12em]">What To Do</span>
                </div>
                <ul className="flex flex-col gap-2">
                  {result.firstAid.whatToDo.slice(0, 3).map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <ChevronRight size={11} className="text-on-surface-muted shrink-0 mt-0.5" />
                      <span className="font-body text-[13px] text-on-surface leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {result.firstAid.whatNotToDo && result.firstAid.whatNotToDo.length > 0 && (
              <div className="sm:pl-5 pt-4 sm:pt-0">
                <div className="flex items-center gap-1.5 mb-3">
                  <div className="w-2 h-2 rounded-full bg-danger" />
                  <span className="font-mono text-[9px] font-bold text-danger uppercase tracking-[0.12em]">What Not To Do</span>
                </div>
                <ul className="flex flex-col gap-2">
                  {result.firstAid.whatNotToDo.slice(0, 3).map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <ChevronRight size={11} className="text-on-surface-muted shrink-0 mt-0.5" />
                      <span className="font-body text-[13px] text-on-surface leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ═══════ ACTIONS ═══════ */}
      <div className="flex flex-wrap justify-center gap-3">
        <button className="btn btn-primary px-6 py-2.5 text-sm" onClick={onNewScan}>
          <ScanSearch size={15} /> New Scan
        </button>
        <button className="btn btn-secondary text-xs" onClick={onShare}>
          <Share2 size={12} /> Share
        </button>
        <button className="btn btn-secondary text-xs" onClick={handleDownload}>
          <Download size={12} /> Export
        </button>
      </div>
    </div>
  );
}
