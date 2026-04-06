import { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import HomePage from './components/HomePage';
import AnalysisPage from './components/AnalysisPage';
import ResultsPage from './components/ResultsPage';
import HistoryPage from './components/HistoryPage';
import CameraCapture from './components/CameraCapture';
import { analyzeImage } from './services/geminiService';
import type { AppPage, AnalysisResult, ScanHistoryItem } from './types';
import { AlertTriangle } from 'lucide-react';

const HISTORY_KEY = 'wildlens-history';
const MAX_HISTORY = 20;

function App() {
  const [page, setPage] = useState<AppPage>('home');
  const [showCamera, setShowCamera] = useState(false);
  const [imageData, setImageData] = useState<string>('');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string>('');
  const [history, setHistory] = useState<ScanHistoryItem[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(HISTORY_KEY);
      if (saved) {
        setHistory(JSON.parse(saved));
      }
    } catch {
      console.warn('Failed to load scan history');
    }
  }, []);

  const saveHistory = useCallback((items: ScanHistoryItem[]) => {
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(items));
    } catch {
      console.warn('Failed to save scan history');
    }
  }, []);

  const addToHistory = useCallback((imgData: string, analysisResult: AnalysisResult) => {
    const newItem: ScanHistoryItem = {
      id: Date.now().toString(),
      imageData: imgData,
      result: analysisResult,
      timestamp: Date.now(),
    };

    setHistory(prev => {
      const updated = [newItem, ...prev].slice(0, MAX_HISTORY);
      saveHistory(updated);
      return updated;
    });
  }, [saveHistory]);

  const handleImageSelected = useCallback(async (imgData: string, mimeType: string) => {
    setImageData(imgData);
    setError('');
    setResult(null);
    setPage('analysis');

    try {
      const analysisResult = await analyzeImage(imgData, mimeType);
      setResult(analysisResult);
      addToHistory(imgData, analysisResult);
      setPage('results');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      setPage('home');
    }
  }, [addToHistory]);

  const handleCameraCapture = useCallback((imgData: string, mimeType: string) => {
    setShowCamera(false);
    handleImageSelected(imgData, mimeType);
  }, [handleImageSelected]);

  const handleNewScan = useCallback(() => {
    setResult(null);
    setError('');
    setImageData('');
    setPage('home');
  }, []);

  const handleSelectHistoryItem = useCallback((imgData: string, analysisResult: AnalysisResult) => {
    setImageData(imgData);
    setResult(analysisResult);
    setPage('results');
  }, []);

  const handleClearHistory = useCallback(() => {
    setHistory([]);
    saveHistory([]);
  }, [saveHistory]);

  const handleShare = useCallback(async () => {
    if (!result) return;
    
    const shareText = `🔍 WildLens AI identified: ${result.commonName} (${result.scientificName})\n` +
      `📊 Confidence: ${result.confidence}%\n` +
      `⚠️ Danger Level: ${result.dangerLevel}\n` +
      `🏷️ Category: ${result.category}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `WildLens: ${result.commonName}`,
          text: shareText,
        });
      } catch {
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareText);
        alert('Analysis copied to clipboard!');
      } catch {
        alert('Unable to share. Please try copying manually.');
      }
    }
  }, [result]);

  const renderPage = () => {
    if (error) {
      return (
        <div className="flex flex-col items-center justify-center p-8 text-center animate-fade-in max-w-md mx-auto my-16 bg-surface-container rounded-2xl border border-danger/20">
          <div className="w-16 h-16 rounded-full bg-danger-bg text-danger flex items-center justify-center mb-6 border border-danger/30">
            <AlertTriangle size={32} />
          </div>
          <h2 className="text-xl font-bold font-display tracking-wide mb-2 text-on-surface">Analysis Failed</h2>
          <p className="text-on-surface-variant text-sm mb-6 max-w-sm leading-relaxed">{error}</p>
          <button className="btn btn-primary" onClick={handleNewScan}>
            Try Again
          </button>
        </div>
      );
    }

    switch (page) {
      case 'analysis':
        return <AnalysisPage />;
      case 'results':
        return result ? (
          <ResultsPage
            result={result}
            imageData={imageData}
            onNewScan={handleNewScan}
            onShare={handleShare}
          />
        ) : null;
      case 'history':
        return (
          <HistoryPage
            history={history}
            onSelectItem={handleSelectHistoryItem}
            onClearHistory={handleClearHistory}
            onNewScan={handleNewScan}
          />
        );
      default:
        return (
          <HomePage
            onImageSelected={handleImageSelected}
            onOpenCamera={() => setShowCamera(true)}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-background bg-pattern relative flex flex-col text-on-surface font-body overflow-x-clip selection:bg-primary/20 selection:text-primary">
      {/* Background glow effects */}
      <div className="absolute top-0 right-[-10vw] w-[40vw] h-[40vw] rounded-full bg-primary/5 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10vw] left-[-10vw] w-[50vw] h-[50vw] rounded-full bg-blue-500/5 blur-[120px] pointer-events-none" />
      
      <Header
        currentPage={page}
        onNavigate={setPage}
        onNewScan={handleNewScan}
      />

      <main className="flex-1 w-full max-w-[1200px] mx-auto p-6 flex flex-col relative z-10 pt-24">
        {renderPage()}
      </main>

      <footer className="w-full bg-surface/80 backdrop-blur-md border-t border-surface-container-high py-4 mt-auto">
        <div className="w-full max-w-[1200px] mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="font-mono text-[0.65rem] tracking-[0.2em] text-on-surface-muted uppercase">
            WildLens © {new Date().getFullYear()} · Powered by Gemini AI
          </span>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="flex items-center gap-2 font-mono text-[0.65rem] tracking-[0.1em] text-on-surface-variant">
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              Status: Online
            </div>
            <div className="flex items-center gap-2 font-mono text-[0.65rem] tracking-[0.1em] text-on-surface-variant">
              Database: Global
            </div>
            <div className="flex items-center gap-2 font-mono text-[0.65rem] tracking-[0.1em] text-on-surface-variant">
              Engine: Gemini Flash
            </div>
          </div>
        </div>
      </footer>

      {showCamera && (
        <CameraCapture
          onCapture={handleCameraCapture}
          onClose={() => setShowCamera(false)}
        />
      )}
    </div>
  );
}

export default App;
