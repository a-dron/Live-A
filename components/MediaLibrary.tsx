
import React, { useState } from 'react';
import { Film, Plus, Play, Trash2, Clock, CheckCircle2 } from 'lucide-react';

interface MediaItem {
  id: string;
  title: string;
  url: string;
  duration: string;
  thumbnail: string;
}

interface MediaLibraryProps {
  onSelect: (url: string) => void;
  selectedUrl: string | null;
}

const MediaLibrary: React.FC<MediaLibraryProps> = ({ onSelect, selectedUrl }) => {
  const [media, setMedia] = useState<MediaItem[]>([
    { id: '1', title: 'مقدمة البث', url: 'https://assets.mixkit.co/videos/preview/mixkit-digital-animation-of-a-world-map-1051-large.mp4', duration: '0:15', thumbnail: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=100&q=80' },
    { id: '2', title: 'فاصل إعلاني', url: 'https://assets.mixkit.co/videos/preview/mixkit-set-of-plate-glass-and-plastic-abstract-objects-34493-large.mp4', duration: '0:30', thumbnail: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=100&q=80' },
    { id: '3', title: 'سنعود بعد قليل', url: 'https://assets.mixkit.co/videos/preview/mixkit-white-cloudy-sky-background-34533-large.mp4', duration: '1:00', thumbnail: 'https://images.unsplash.com/photo-1492619334760-22c899736c91?w=100&q=80' },
  ]);

  return (
    <div className="bg-slate-900/50 rounded-2xl p-6 border border-slate-800 h-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <Film className="text-orange-500" /> مكتبة الوسائط
        </h3>
        <button className="p-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-white transition">
          <Plus size={18} />
        </button>
      </div>

      <div className="space-y-3 max-h-[400px] overflow-y-auto custom-scrollbar pr-1">
        {media.map((item) => (
          <div 
            key={item.id}
            onClick={() => onSelect(item.url)}
            className={`group p-3 rounded-xl border-2 transition-all cursor-pointer flex items-center gap-4 ${
              selectedUrl === item.url 
                ? 'border-orange-500 bg-orange-500/10' 
                : 'border-slate-800 bg-slate-950/50 hover:border-slate-700'
            }`}
          >
            <div className="relative w-16 h-12 rounded-lg overflow-hidden flex-shrink-0">
              <img src={item.thumbnail} className="w-full h-full object-cover" alt="" />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Play size={16} fill="white" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-bold truncate">{item.title}</h4>
              <div className="flex items-center gap-2 text-[10px] text-slate-500">
                <Clock size={10} /> {item.duration}
              </div>
            </div>
            {selectedUrl === item.url && (
              <CheckCircle2 size={16} className="text-orange-500" />
            )}
            <button className="p-1.5 text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-orange-500/5 border border-orange-500/20 rounded-xl">
        <p className="text-[10px] text-orange-300 leading-relaxed italic">
          * نصيحة: استخدم "مقدمة البث" قبل البدء لضمان استقرار الإشارة على جميع المنصات.
        </p>
      </div>
    </div>
  );
};

export default MediaLibrary;
