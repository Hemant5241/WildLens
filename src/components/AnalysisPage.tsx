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
    <div className="analysis-page">
      <div className="analysis-scanner">
        <div className="analysis-scanner-ring" />
        <div className="analysis-scanner-ring" />
        <div className="analysis-scanner-ring" />
        <div className="analysis-scanner-center">
          <ScanSearch size={40} />
        </div>
      </div>

      <h2 className="analysis-title">ANALYZING SPECIMEN...</h2>
      <p className="analysis-subtitle">AI is processing your image. This may take a moment.</p>

      <div className="analysis-telemetry">
        {TELEMETRY_MESSAGES.slice(0, visibleLines).map((msg, i) => (
          <div
            key={i}
            className={`analysis-telemetry-line ${
              i === visibleLines - 1 ? 'active' : 'completed'
            }`}
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            <div className="analysis-telemetry-dot" />
            <span>{msg}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
