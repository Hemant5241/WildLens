import { useRef, useEffect, useState, useCallback } from 'react';
import { X, SwitchCamera } from 'lucide-react';

interface CameraCaptureProps {
  onCapture: (imageData: string, mimeType: string) => void;
  onClose: () => void;
}

export default function CameraCapture({ onCapture, onClose }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const [error, setError] = useState<string>('');

  const startCamera = useCallback(async () => {
    try {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode, width: { ideal: 1920 }, height: { ideal: 1080 } },
        audio: false,
      });

      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setError('');
    } catch {
      setError('Unable to access camera. Please check permissions.');
    }
  }, [facingMode]);

  useEffect(() => {
    startCamera();
    return () => {
      stream?.getTracks().forEach(track => track.stop());
    };
  }, [facingMode]);

  const handleCapture = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0);
    const imageData = canvas.toDataURL('image/jpeg', 0.9);
    
    stream?.getTracks().forEach(track => track.stop());
    
    onCapture(imageData, 'image/jpeg');
  };

  const toggleCamera = () => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
  };

  return (
    <div className="fixed inset-0 bg-background/95 z-[100] flex flex-col justify-center items-center backdrop-blur-md animate-fade-in px-4">
      <div className="absolute top-6 left-6 right-6 flex justify-between items-center z-10 w-[calc(100%-48px)]">
        <div className="font-mono text-xs tracking-widest text-primary uppercase flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-danger animate-pulse" />
          Wildlife Sensor Unit
        </div>
        <button className="w-10 h-10 rounded-full bg-surface-container-high border border-outline flex justify-center items-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest transition-colors" onClick={onClose}>
          <X size={20} />
        </button>
      </div>

      <div className="relative w-full max-w-[500px] aspect-[3/4] sm:aspect-square bg-surface-container-lowest rounded-3xl overflow-hidden shadow-2xl border border-surface-container shadow-primary/5">
        {error ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-20">
            <p className="text-danger mb-4 font-body">{error}</p>
            <button className="btn btn-primary" onClick={startCamera}>
              Retry
            </button>
          </div>
        ) : (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            
            {/* Viewfinder Overlay */}
            <div className="absolute inset-8 pointer-events-none">
              <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-primary" />
              <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-primary" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-primary" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-primary" />
              
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 text-primary/50 flex justify-center items-center">
                <div className="w-0.5 h-full bg-current absolute" />
                <div className="w-full h-0.5 bg-current absolute" />
              </div>
            </div>
          </>
        )}
      </div>

      {!error && (
        <div className="absolute bottom-10 left-0 right-0 flex justify-center items-center gap-8 z-10 w-[calc(100%-48px)]">
          <button className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center text-on-surface hover:bg-surface-container-highest transition-colors" onClick={toggleCamera}>
            <SwitchCamera size={22} />
          </button>
          
          {/* Capture button */}
          <div 
            className="w-20 h-20 rounded-full border-[3px] border-primary p-1 cursor-pointer hover:scale-105 transition-transform"
            onClick={handleCapture}
          >
            <div className="w-full h-full rounded-full bg-on-surface hover:bg-on-surface-variant transition-colors" />
          </div>
          
          <div className="w-12 h-12" /> {/* Spacer for alignment */}
        </div>
      )}

      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
}
