import { Camera, Upload, ScanSearch, Database, Cpu, Zap } from 'lucide-react';
import { useRef } from 'react';

interface HomePageProps {
  onImageSelected: (imageData: string, mimeType: string) => void;
  onOpenCamera: () => void;
}

export default function HomePage({ onImageSelected, onOpenCamera }: HomePageProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      onImageSelected(result, file.type);
    };
    reader.readAsDataURL(file);
    
    // Reset input so same file can be selected again
    e.target.value = '';
  };

  return (
    <div className="home-page animate-fade-in">
      <div className="home-hero-icon">
        <div className="home-hero-icon-ring" />
        <div className="home-hero-icon-ring" />
        <div className="home-hero-icon-inner">
          <ScanSearch size={40} />
        </div>
      </div>

      <h1 className="home-title">
        Identify Any Species.<br />Instantly.
      </h1>

      <p className="home-subtitle">
        Advanced AI-powered wildlife identification. Upload or capture a photo for instant species analysis, danger assessment, habitat info, and safety guidance.
      </p>

      <div className="home-actions">
        <div className="home-action-card" onClick={onOpenCamera}>
          <div className="home-action-icon">
            <Camera size={20} />
          </div>
          <div className="home-action-title">OPEN CAMERA</div>
          <div className="home-action-desc">Direct Capture</div>
        </div>

        <div className="home-action-card" onClick={() => fileInputRef.current?.click()}>
          <div className="home-action-icon">
            <Upload size={20} />
          </div>
          <div className="home-action-title">UPLOAD IMAGE</div>
          <div className="home-action-desc">From Gallery</div>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="file-input-hidden"
      />

      <div className="home-features">
        <div className="home-feature">
          <div className="home-feature-icon">
            <Database size={22} />
          </div>
          <div className="home-feature-title">500K+ Species</div>
          <div className="home-feature-desc">Global database</div>
        </div>

        <div className="home-feature">
          <div className="home-feature-icon">
            <Cpu size={22} />
          </div>
          <div className="home-feature-title">AI Powered</div>
          <div className="home-feature-desc">Gemini engine</div>
        </div>

        <div className="home-feature">
          <div className="home-feature-icon">
            <Zap size={22} />
          </div>
          <div className="home-feature-title">Instant Results</div>
          <div className="home-feature-desc">Real-time analysis</div>
        </div>
      </div>

      <p className="home-disclaimer">
        For educational use only · Not a substitute for professional advice
      </p>
    </div>
  );
}
