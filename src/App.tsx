import { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import HomePage from './components/HomePage';
import AnalysisPage from './components/AnalysisPage';
import ResultsPage from './components/ResultsPage';
import HistoryPage from './components/HistoryPage';
import CameraCapture from './components/CameraCapture';
import { analyzeImage } from './services/geminiService';
import type { AppPage, AnalysisResult, ScanHistoryItem } from './types';
import { AlertTriangle, RotateCcw } from 'lucide-react';

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
      } catch { /* cancelled */ }
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
        <div className="flex flex-col items-center justify-center py-20 animate-fade-in max-w-md mx-auto text-center">
          <div className="glass-card p-10 rounded-2xl w-full">
            {/* Error icon */}
            <div className="w-16 h-16 rounded-2xl bg-danger/10 text-danger flex items-center justify-center mx-auto mb-6">
              <AlertTriangle size={28} />
            </div>

            <h2 className="font-display font-bold text-xl tracking-wide text-on-surface mb-3">
              Analysis Failed
            </h2>
            <p className="font-body text-sm text-on-surface-variant leading-relaxed mb-8 max-w-sm mx-auto">
              {error}
            </p>

            <button className="btn btn-primary w-full" onClick={handleNewScan}>
              <RotateCcw size={16} />
              Try Again
            </button>
          </div>
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
    <div className="min-h-screen bg-background relative flex flex-col text-on-surface font-body overflow-x-clip selection:bg-primary/20 selection:text-primary">
      {/* Atmospheric background orbs */}
      <div className="fixed top-[-20vh] right-[-10vw] w-[60vw] h-[60vh] rounded-full bg-primary/[0.03] blur-[150px] pointer-events-none" />
      <div className="fixed bottom-[-20vh] left-[-15vw] w-[50vw] h-[50vh] rounded-full bg-info/[0.02] blur-[150px] pointer-events-none" />
      <div className="fixed top-[40vh] left-[30vw] w-[30vw] h-[30vh] rounded-full bg-primary/[0.015] blur-[120px] pointer-events-none" />

      <Header
        currentPage={page}
        onNavigate={setPage}
        onNewScan={handleNewScan}
      />

      <main className="flex-1 w-full max-w-[1200px] mx-auto px-4 sm:px-6 flex flex-col relative z-10 pt-16 sm:pt-20">
        {renderPage()}
      </main>

      <footer className="w-full bg-surface-container-lowest/80 backdrop-blur-md py-5 mt-auto relative z-10">
        <div className="w-full max-w-[1200px] mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <span className="font-mono text-[10px] tracking-[0.2em] text-on-surface-muted/40 uppercase">
            WildLens © {new Date().getFullYear()} · Powered by Gemini AI
          </span>
          <div className="flex flex-wrap justify-center gap-5">
            <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.1em] text-on-surface-muted/40">
              <div className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-pulse-soft" />
              Online
            </div>
            <div className="font-mono text-[10px] tracking-[0.1em] text-on-surface-muted/40">
              Database: Global
            </div>
            <div className="font-mono text-[10px] tracking-[0.1em] text-on-surface-muted/40">
              Engine: Gemini 2.5 Flash
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
