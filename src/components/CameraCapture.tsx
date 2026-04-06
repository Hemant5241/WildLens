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
    
    // Stop camera
    stream?.getTracks().forEach(track => track.stop());
    
    onCapture(imageData, 'image/jpeg');
  };

  const toggleCamera = () => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
  };

  return (
    <div className="camera-overlay">
      <div className="camera-header">
        <div className="camera-title">Wildlife Sensor Unit</div>
        <button className="btn btn-ghost" onClick={onClose}>
          <X size={20} />
        </button>
      </div>

      <div className="camera-body">
        {error ? (
          <div className="error-container">
            <p className="error-message">{error}</p>
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
              className="camera-video"
            />
            <div className="camera-viewfinder">
              <div className="camera-viewfinder-corner tl" />
              <div className="camera-viewfinder-corner tr" />
              <div className="camera-viewfinder-corner bl" />
              <div className="camera-viewfinder-corner br" />
            </div>
          </>
        )}
      </div>

      {!error && (
        <div className="camera-controls">
          <button className="btn btn-ghost" onClick={toggleCamera}>
            <SwitchCamera size={22} />
          </button>
          <button className="camera-capture-btn" onClick={handleCapture} />
          <div style={{ width: 38 }} />
        </div>
      )}

      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
}
