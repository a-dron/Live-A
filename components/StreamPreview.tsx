
import React, { useRef, useEffect, useState } from 'react';
import { Camera, Monitor, Settings, Mic, MicOff, Video, VideoOff, Play, Film, Radio } from 'lucide-react';

interface StreamPreviewProps {
  isLive: boolean;
  activeSource: 'live' | 'media';
  selectedMediaUrl: string | null;
}

const StreamPreview: React.FC<StreamPreviewProps> = ({ isLive, activeSource, selectedMediaUrl }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [micEnabled, setMicEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [sourceType, setSourceType] = useState<'camera' | 'screen'>('camera');

  const startStream = async (type: 'camera' | 'screen') => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }

    try {
      const newStream = type === 'camera' 
        ? await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        : await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
      
      setStream(newStream);
      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
      }
      setSourceType(type);
    } catch (err) {
      console.error("Error accessing media devices:", err);
    }
  };

  useEffect(() => {
    startStream('camera');
    return () => {
      stream?.getTracks().forEach(track => track.stop());
    };
  }, []);

  const toggleMic = () => {
    if (stream) {
      stream.getAudioTracks().forEach(t => t.enabled = !micEnabled);
      setMicEnabled(!micEnabled);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="relative bg-black rounded-2xl overflow-hidden aspect-video shadow-2xl border-2 border-slate-800">
        {/* Main Program Output */}
        <div className="absolute top-4 right-4 z-20 flex items-center gap-2 bg-blue-600 text-white px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest">
          المخرج (Program)
        </div>

        {activeSource === 'live' ? (
          <video 
            ref={videoRef} 
            autoPlay 
            muted 
            playsInline 
            className={`w-full h-full object-cover transition-opacity duration-500 ${videoEnabled ? 'opacity-100' : 'opacity-0'}`}
          />
        ) : (
          <video 
            ref={mediaRef}
            src={selectedMediaUrl || ''}
            autoPlay 
            loop
            className="w-full h-full object-cover animate-in fade-in duration-700"
          />
        )}

        {isLive && (
          <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold animate-pulse">
            <div className="w-2 h-2 bg-white rounded-full"></div>
            على الهواء
          </div>
        )}

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-4 z-30">
           <button 
            onClick={toggleMic}
            className={`p-4 rounded-full shadow-xl transition-transform active:scale-95 ${micEnabled ? 'bg-slate-800 text-white' : 'bg-red-600 text-white'}`}
          >
            {micEnabled ? <Mic size={24} /> : <MicOff size={24} />}
          </button>
        </div>
      </div>

      {/* Source Selector Bar */}
      <div className="grid grid-cols-2 gap-4">
        <div 
          onClick={() => startStream(sourceType === 'camera' ? 'screen' : 'camera')}
          className={`p-3 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between ${activeSource === 'live' ? 'border-blue-500 bg-blue-500/10' : 'border-slate-800 bg-slate-900/50 hover:border-slate-700'}`}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-800 rounded-lg">
              {sourceType === 'camera' ? <Camera size={18} /> : <Monitor size={18} />}
            </div>
            <span className="text-sm font-bold">البث المباشر</span>
          </div>
          <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
        </div>

        <div className={`p-3 rounded-xl border-2 transition-all flex items-center justify-between ${activeSource === 'media' ? 'border-orange-500 bg-orange-500/10' : 'border-slate-800 bg-slate-900/50 hover:border-slate-700'}`}>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-800 rounded-lg text-orange-400">
              <Film size={18} />
            </div>
            <span className="text-sm font-bold">المقطع المسجل</span>
          </div>
          {selectedMediaUrl ? (
             <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></div>
          ) : (
             <div className="w-2 h-2 rounded-full bg-slate-700"></div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StreamPreview;
