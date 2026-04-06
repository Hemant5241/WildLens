import { useEffect, useState } from 'react';
import { ScanSearch } from 'lucide-react';

const TELEMETRY_MESSAGES = [
  'Initializing WildLens AI engine...',
  'Loading species recognition model...',
  'Processing image data...',
  'Extracting visual features...',
  'Cross-referencing global database...',
  'Analyzing morphological markers...',
  'Identifying behavioral patterns...',
  'Generating threat assessment...',
  'Compiling conservation data...',
  'Finalizing species report...',
];

export default function AnalysisPage() {
  const [visibleLines, setVisibleLines] = useState<number>(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const lineInterval = setInterval(() => {
      setVisibleLines(prev => {
        if (prev >= TELEMETRY_MESSAGES.length) return prev;
        return prev + 1;
      });
    }, 800);

    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 95) return prev;
        return prev + Math.random() * 3;
      });
    }, 200);

    return () => {
      clearInterval(lineInterval);
      clearInterval(progressInterval);
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-16 max-w-[600px] mx-auto w-full text-center animate-fade-in">
      {/* Scanner Animation */}
      <div className="relative w-[140px] h-[140px] flex items-center justify-center mb-14">
        <div className="absolute inset-0 border-2 border-primary/30 border-r-transparent border-b-transparent rounded-full animate-scanner-rotate" />
        <div className="absolute inset-3 border border-primary/15 border-r-transparent border-b-transparent rounded-full animate-scanner-rotate [animation-direction:reverse] [animation-duration:1.5s]" />
        <div className="absolute inset-6 border border-primary/8 border-r-transparent border-b-transparent rounded-full animate-scanner-rotate [animation-duration:3s]" />

        <div className="text-primary animate-pulse-soft">
          <ScanSearch size={36} />
        </div>
      </div>

      {/* Status */}
      <h2 className="font-display font-bold text-xl tracking-[0.15em] text-on-surface mb-2 uppercase">
        Analyzing Specimen
      </h2>
      <p className="font-body text-sm text-on-surface-variant mb-4">
        AI is processing your image. This may take a moment.
      </p>

      {/* Progress bar */}
      <div className="w-full max-w-[300px] h-1 bg-surface-container-high rounded-full overflow-hidden mb-12">
        <div
          className="h-full bg-gradient-to-r from-primary to-primary-container rounded-full transition-all duration-300 ease-out"
          style={{ width: `${Math.min(progress, 95)}%` }}
        />
      </div>

      {/* Telemetry Log */}
      <div className="w-full glass-card p-6 rounded-xl text-left min-h-[280px]">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2 h-2 rounded-full bg-primary animate-blink" />
          <span className="font-mono text-[10px] tracking-[0.15em] text-primary uppercase">System Log</span>
        </div>

        <div className="flex flex-col gap-2.5">
          {TELEMETRY_MESSAGES.slice(0, visibleLines).map((msg, i) => {
            const isLast = i === visibleLines - 1;
            return (
              <div
                key={i}
                className={`flex items-center gap-3 font-mono text-xs tracking-wider animate-telemetry-fade ${
                  isLast ? 'text-primary' : 'text-on-surface-muted/60'
                }`}
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <div
                  className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                    isLast
                      ? 'bg-primary shadow-[0_0_8px_rgba(78,222,163,0.6)]'
                      : 'bg-on-surface-muted/30'
                  }`}
                />
                <span>{msg}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
