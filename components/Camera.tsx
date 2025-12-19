
import React, { useRef, useEffect, useCallback, useState } from 'react';
import { Camera as CameraIcon, RefreshCw, AlertCircle, Maximize, ShieldCheck } from 'lucide-react';

interface CameraProps {
  onCapture: (base64Image: string) => void;
  isProcessing?: boolean;
}

const Camera: React.FC<CameraProps> = ({ onCapture, isProcessing }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);

  const startCamera = useCallback(async () => {
    try {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: 1280, height: 720 }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setStream(mediaStream);
      setError(null);
    } catch (err) {
      setError("Caméra inaccessible. Vérifiez les permissions.");
      console.error(err);
    }
  }, [stream]);

  useEffect(() => {
    startCamera();
    return () => {
      if (stream) stream.getTracks().forEach(track => track.stop());
    };
  }, []);

  const capture = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        onCapture(canvas.toDataURL('image/jpeg', 0.9));
      }
    }
  }, [onCapture]);

  return (
    <div className="relative w-full max-w-2xl mx-auto overflow-hidden rounded-[2.5rem] shadow-2xl bg-black border-[6px] border-white group">
      {error ? (
        <div className="aspect-video flex flex-col items-center justify-center bg-slate-50 text-center p-8">
          <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
          <p className="text-slate-800 font-bold mb-4">{error}</p>
          <button onClick={startCamera} className="px-6 py-2 bg-slate-900 text-white rounded-xl font-bold">Réessayer</button>
        </div>
      ) : (
        <div className="relative aspect-video">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover transition-all duration-700"
            style={{ transform: 'scaleX(-1)' }}
          />
          <canvas ref={canvasRef} className="hidden" />
          
          <div className="absolute inset-0 border-[20px] border-transparent group-hover:border-white/10 transition-all duration-500 pointer-events-none"></div>
          
          <div className="absolute top-6 left-6 w-8 h-8 border-t-4 border-l-4 border-white/60"></div>
          <div className="absolute top-6 right-6 w-8 h-8 border-t-4 border-r-4 border-white/60"></div>
          <div className="absolute bottom-6 left-6 w-8 h-8 border-b-4 border-l-4 border-white/60"></div>
          <div className="absolute bottom-6 right-6 w-8 h-8 border-b-4 border-r-4 border-white/60"></div>

          {isProcessing && <div className="scan-line"></div>}
          
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4">
            <button
              onClick={capture}
              disabled={isProcessing}
              className={`p-6 rounded-full shadow-2xl transition-all duration-300 scale-100 hover:scale-110 active:scale-90
                ${isProcessing ? 'bg-slate-700' : 'bg-blue-600 hover:bg-blue-500 text-white'}
              `}
            >
              {isProcessing ? <RefreshCw className="w-8 h-8 animate-spin" /> : <Maximize className="w-8 h-8" />}
            </button>
          </div>

          {isProcessing && (
            <div className="absolute inset-0 bg-blue-900/40 backdrop-blur-[2px] flex flex-col items-center justify-center text-white">
              <div className="relative">
                <div className="w-24 h-24 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                   <ShieldCheck className="w-10 h-10" />
                </div>
              </div>
              <p className="mt-6 font-black tracking-[0.2em] text-sm animate-pulse">ANALYSE BIOMÉTRIQUE...</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Camera;
