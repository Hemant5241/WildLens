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

  // Load history from localStorage
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

  // Save history to localStorage
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
        // User cancelled or share failed
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
        <div className="error-container animate-fade-in">
          <div className="error-icon">
            <AlertTriangle size={48} />
          </div>
          <h2 className="error-title">Analysis Failed</h2>
          <p className="error-message">{error}</p>
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
    <div className="app-container">
      <Header
        currentPage={page}
        onNavigate={setPage}
        onNewScan={handleNewScan}
      />

      <main className="main-content">
        {renderPage()}
      </main>

      <footer className="footer">
        <div className="footer-inner">
          <span className="home-disclaimer">
            WildLens © {new Date().getFullYear()} · Powered by Gemini AI
          </span>
          <div className="footer-indicators">
            <div className="footer-indicator">
              <div className="footer-indicator-dot" />
              Status: Online
            </div>
            <div className="footer-indicator">
              Database: Global
            </div>
            <div className="footer-indicator">
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
