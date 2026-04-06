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

  useEffect(() => {
    const interval = setInterval(() => {
      setVisibleLines(prev => {
        if (prev >= TELEMETRY_MESSAGES.length) {
          return prev;
        }
        return prev + 1;
      });
    }, 800);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-[10vh] max-w-[600px] mx-auto w-full text-center">
      <div className="relative w-[150px] h-[150px] flex items-center justify-center mb-12">
        <div className="absolute inset-0 border-[3px] border-primary border-r-transparent border-b-transparent rounded-full animate-scanner-rotate" />
        <div className="absolute inset-[15px] border-[2px] border-primary/40 border-r-transparent border-b-transparent rounded-full animate-scanner-rotate [animation-direction:reverse] [animation-duration:1.5s]" />
        <div className="absolute inset-[30px] border border-primary/20 border-r-transparent border-b-transparent rounded-full animate-scanner-rotate [animation-duration:3s]" />
        
        <div className="text-primary animate-scanner-pulse">
          <ScanSearch size={40} />
        </div>
      </div>

      <h2 className="font-display font-bold text-2xl tracking-[0.2em] text-on-surface mb-2 animate-pulse-ring uppercase">
        ANALYZING SPECIMEN...
      </h2>
      <p className="font-body text-on-surface-variant mb-12">
        AI is processing your image. This may take a moment.
      </p>

      <div className="w-full flex flex-col gap-3 font-mono text-xs tracking-wider text-left bg-surface/50 border border-outline-variant p-6 rounded-xl relative overflow-hidden backdrop-blur-sm min-h-[300px]">
        {TELEMETRY_MESSAGES.slice(0, visibleLines).map((msg, i) => {
          const isLast = i === visibleLines - 1;
          return (
            <div
              key={i}
              className={`flex items-center gap-3 animate-telemetry-fade ${
                isLast ? 'text-primary' : 'text-on-surface-muted'
              }`}
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className={`w-2 h-2 rounded-full ${isLast ? 'bg-primary animate-telemetry-blink shadow-[0_0_8px_rgba(78,222,163,0.8)]' : 'bg-on-surface-muted'}`} />
              <span>{msg}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
