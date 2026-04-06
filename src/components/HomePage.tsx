import { Camera, Upload, ScanSearch, Leaf, Cpu, Zap, ChevronRight } from 'lucide-react';
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
    <div className="flex flex-col items-center max-w-[900px] mx-auto w-full pt-8 pb-16 animate-fade-in">
      {/* Hero Section */}
      <div className="w-full text-center mb-16 relative">
        {/* Atmospheric orb behind headline */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

        {/* Animated icon */}
        <div className="relative w-20 h-20 mx-auto mb-10">
          <div className="absolute inset-0 rounded-full bg-primary/10 animate-breathe" />
          <div className="absolute inset-2 rounded-full bg-primary/5 animate-breathe [animation-delay:1s]" />
          <div className="relative w-full h-full rounded-full bg-surface-container-high flex items-center justify-center">
            <ScanSearch size={32} className="text-primary animate-pulse-soft" />
          </div>
        </div>

        {/* Subheader label */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/5 text-primary text-xs font-mono tracking-[0.2em] uppercase mb-6">
          <Leaf size={12} />
          AI-POWERED IDENTIFICATION
        </div>

        <h1 className="font-display font-bold text-5xl md:text-7xl tracking-tight text-on-surface leading-[1.05] mb-6 relative z-10">
          Discover Wildlife.
          <br />
          <span className="bg-gradient-to-r from-primary to-primary-container bg-clip-text text-transparent">
            Instantly.
          </span>
        </h1>

        <p className="font-body text-base md:text-lg text-on-surface-variant max-w-[540px] mx-auto leading-relaxed relative z-10">
          Upload or capture a photo for instant species analysis, danger assessment, habitat insights, and conservation data.
        </p>
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full max-w-[640px] px-4 md:px-0 mb-20">
        {/* Camera Card */}
        <div
          className="group relative bg-surface-container-low/50 backdrop-blur-md rounded-2xl p-8 flex flex-col items-center gap-5 cursor-pointer transition-all duration-500 hover:-translate-y-1.5 hover:shadow-card-hover hover:bg-surface-container/60"
          onClick={onOpenCamera}
        >
          {/* Top glow line on hover */}
          <div className="absolute top-0 left-4 right-4 h-[1px] bg-gradient-to-r from-transparent via-primary/0 to-transparent group-hover:via-primary/40 transition-all duration-700" />

          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary/20 group-hover:shadow-glow transition-all duration-500">
            <Camera size={24} />
          </div>
          <div className="text-center">
            <div className="font-display font-semibold text-sm tracking-wider text-on-surface mb-1">
              Open Camera
            </div>
            <div className="font-mono text-[10px] text-on-surface-muted tracking-[0.15em] uppercase">
              Real-time capture
            </div>
          </div>
          <ChevronRight
            size={16}
            className="text-on-surface-muted group-hover:text-primary group-hover:translate-x-1 transition-all duration-300 absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100"
          />
        </div>

        {/* Upload Card */}
        <div
          className="group relative bg-surface-container-low/50 backdrop-blur-md rounded-2xl p-8 flex flex-col items-center gap-5 cursor-pointer transition-all duration-500 hover:-translate-y-1.5 hover:shadow-card-hover hover:bg-surface-container/60"
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="absolute top-0 left-4 right-4 h-[1px] bg-gradient-to-r from-transparent via-primary/0 to-transparent group-hover:via-primary/40 transition-all duration-700" />

          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary/20 group-hover:shadow-glow transition-all duration-500">
            <Upload size={24} />
          </div>
          <div className="text-center">
            <div className="font-display font-semibold text-sm tracking-wider text-on-surface mb-1">
              Upload Image
            </div>
            <div className="font-mono text-[10px] text-on-surface-muted tracking-[0.15em] uppercase">
              From your gallery
            </div>
          </div>
          <ChevronRight
            size={16}
            className="text-on-surface-muted group-hover:text-primary group-hover:translate-x-1 transition-all duration-300 absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100"
          />
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Feature Stats */}
      <div className="grid grid-cols-3 gap-8 max-w-[600px] w-full px-4 mb-16">
        {[
          { icon: <Leaf size={20} strokeWidth={1.5} />, label: '500K+', sub: 'Species in database' },
          { icon: <Cpu size={20} strokeWidth={1.5} />, label: 'Gemini AI', sub: 'Powered engine' },
          { icon: <Zap size={20} strokeWidth={1.5} />, label: 'Instant', sub: 'Real-time results' },
        ].map((item, i) => (
          <div key={i} className="flex flex-col items-center text-center group">
            <div className="text-primary/60 group-hover:text-primary transition-colors mb-2.5">{item.icon}</div>
            <div className="font-display font-bold text-sm text-on-surface tracking-wide">{item.label}</div>
            <div className="font-mono text-[9px] text-on-surface-muted tracking-[0.1em] uppercase mt-0.5">{item.sub}</div>
          </div>
        ))}
      </div>

      {/* Footer disclaimer */}
      <p className="font-mono text-[10px] text-on-surface-muted/50 tracking-[0.25em] uppercase text-center">
        For educational use only · Not a substitute for professional advice
      </p>
    </div>
  );
}
