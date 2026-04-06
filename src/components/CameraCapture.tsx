import { useRef, useEffect, useState, useCallback } from 'react';
import { X, SwitchCamera, Aperture } from 'lucide-react';

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
    <div className="fixed inset-0 bg-background/95 backdrop-blur-xl z-[100] flex flex-col justify-center items-center animate-fade-in px-4">
      {/* Top bar */}
      <div className="absolute top-6 left-6 right-6 flex justify-between items-center z-10">
        <div className="font-mono text-[10px] tracking-[0.2em] text-primary uppercase flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-danger animate-blink" />
          Wildlife Sensor Active
        </div>
        <button
          className="w-10 h-10 rounded-full bg-surface-container-high/60 backdrop-blur-md flex justify-center items-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest/60 transition-all duration-300"
          onClick={onClose}
        >
          <X size={18} />
        </button>
      </div>

      {/* Camera Preview */}
      <div className="relative w-full max-w-[500px] aspect-[3/4] sm:aspect-square rounded-3xl overflow-hidden shadow-ambient">
        {error ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-surface-container-low z-20">
            <p className="text-danger font-body text-sm mb-4">{error}</p>
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

            {/* Viewfinder corners */}
            <div className="absolute inset-8 pointer-events-none">
              <div className="absolute top-0 left-0 w-10 h-10 border-t-2 border-l-2 border-primary/50 rounded-tl-lg" />
              <div className="absolute top-0 right-0 w-10 h-10 border-t-2 border-r-2 border-primary/50 rounded-tr-lg" />
              <div className="absolute bottom-0 left-0 w-10 h-10 border-b-2 border-l-2 border-primary/50 rounded-bl-lg" />
              <div className="absolute bottom-0 right-0 w-10 h-10 border-b-2 border-r-2 border-primary/50 rounded-br-lg" />

              {/* Center crosshair */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="w-6 h-[1px] bg-primary/30 absolute top-1/2 left-1/2 -translate-x-1/2" />
                <div className="w-[1px] h-6 bg-primary/30 absolute top-1/2 left-1/2 -translate-y-1/2" />
              </div>
            </div>
          </>
        )}
      </div>

      {/* Controls */}
      {!error && (
        <div className="flex justify-center items-center gap-10 mt-10 z-10">
          <button
            className="w-12 h-12 rounded-full bg-surface-container-high/60 backdrop-blur-md flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest/60 transition-all duration-300"
            onClick={toggleCamera}
          >
            <SwitchCamera size={20} />
          </button>

          {/* Capture button */}
          <button
            className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-primary-container p-1 cursor-pointer hover:scale-105 transition-transform duration-300 shadow-glow hover:shadow-glow-lg group"
            onClick={handleCapture}
          >
            <div className="w-full h-full rounded-full bg-on-primary flex items-center justify-center group-hover:bg-on-primary-container transition-colors">
              <Aperture size={28} className="text-primary" />
            </div>
          </button>

          <div className="w-12 h-12" /> {/* Spacer */}
        </div>
      )}

      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
}
