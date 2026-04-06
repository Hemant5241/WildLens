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
    e.target.value = '';
  };

  return (
    <div className="flex flex-col items-center text-center max-w-[800px] mx-auto py-[10vh] animate-fade-in relative z-10 w-full">
      <div className="relative w-[120px] h-[120px] flex items-center justify-center mb-8">
        <div className="absolute inset-0 border-2 border-primary/20 rounded-full animate-pulse-ring -m-[15px]" />
        <div className="absolute inset-0 border border-primary/10 rounded-full animate-pulse-ring -m-[30px] [animation-delay:-1.5s]" />
        <div className="w-[80px] h-[80px] rounded-full bg-surface-container-high border border-outline flex items-center justify-center text-primary shadow-glow relative z-10">
          <ScanSearch size={40} className="animate-scanner-icon-pulse" />
        </div>
      </div>

      <h1 className="font-display font-bold text-5xl md:text-6xl tracking-tight text-on-surface mb-6 leading-[1.1]">
        Identify Any Species.<br />
        <span className="bg-gradient-to-r from-on-surface to-on-surface-variant bg-clip-text text-transparent">Instantly.</span>
      </h1>

      <p className="font-body text-base md:text-lg text-on-surface-variant max-w-[600px] leading-relaxed mb-12">
        Advanced AI-powered wildlife identification. Upload or capture a photo for instant species analysis, danger assessment, habitat info, and safety guidance.
      </p>

      <div className="flex flex-col md:flex-row gap-6 w-full max-w-[600px] px-4 md:px-0">
        <div 
          className="flex-1 bg-surface-container-low border border-outline-variant rounded-2xl p-8 flex flex-col items-center gap-4 cursor-pointer transition-all duration-300 relative overflow-hidden group hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5" 
          onClick={onOpenCamera}
        >
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/0 to-transparent group-hover:via-primary/50 transition-colors tracking-wider z-0" />
          <div className="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center text-primary group-hover:bg-primary/10 transition-colors z-10">
            <Camera size={20} />
          </div>
          <div className="flex flex-col z-10">
            <div className="font-body text-sm font-semibold tracking-wider text-on-surface mb-1">OPEN CAMERA</div>
            <div className="font-mono text-xs text-on-surface-muted uppercase tracking-wider">Direct Capture</div>
          </div>
        </div>

        <div 
          className="flex-1 bg-surface-container-low border border-outline-variant rounded-2xl p-8 flex flex-col items-center gap-4 cursor-pointer transition-all duration-300 relative overflow-hidden group hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5" 
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/0 to-transparent group-hover:via-primary/50 transition-colors tracking-wider z-0" />
          <div className="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center text-primary group-hover:bg-primary/10 transition-colors z-10">
            <Upload size={20} />
          </div>
          <div className="flex flex-col z-10">
            <div className="font-body text-sm font-semibold tracking-wider text-on-surface mb-1">UPLOAD IMAGE</div>
            <div className="font-mono text-xs text-on-surface-muted uppercase tracking-wider">From Gallery</div>
          </div>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 mb-16 px-4 md:px-0">
        <div className="flex flex-col items-center">
          <div className="text-primary mb-3">
            <Database size={22} strokeWidth={1.5} />
          </div>
          <div className="font-display font-bold text-sm tracking-wide text-on-surface mb-1">500K+ Species</div>
          <div className="font-mono text-[0.65rem] text-on-surface-muted tracking-[0.05em] uppercase">Global database</div>
        </div>

        <div className="flex flex-col items-center">
          <div className="text-primary mb-3">
            <Cpu size={22} strokeWidth={1.5} />
          </div>
          <div className="font-display font-bold text-sm tracking-wide text-on-surface mb-1">AI Powered</div>
          <div className="font-mono text-[0.65rem] text-on-surface-muted tracking-[0.05em] uppercase">Gemini engine</div>
        </div>

        <div className="flex flex-col items-center">
          <div className="text-primary mb-3">
            <Zap size={22} strokeWidth={1.5} />
          </div>
          <div className="font-display font-bold text-sm tracking-wide text-on-surface mb-1">Instant Results</div>
          <div className="font-mono text-[0.65rem] text-on-surface-muted tracking-[0.05em] uppercase">Real-time analysis</div>
        </div>
      </div>

      <p className="font-mono text-[0.65rem] text-on-surface-muted tracking-[0.2em] uppercase mt-auto">
        For educational use only · Not a substitute for professional advice
      </p>
    </div>
  );
}
