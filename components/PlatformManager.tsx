
import React from 'react';
import { Settings, CheckCircle2, XCircle, Plus, ExternalLink } from 'lucide-react';
import { Platform } from '../types';
import { PLATFORM_ICONS } from '../constants';

interface PlatformManagerProps {
  platforms: Platform[];
  onToggleActive: (id: string) => void;
  isStreaming: boolean;
}

const PlatformManager: React.FC<PlatformManagerProps> = ({ platforms, onToggleActive, isStreaming }) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-slate-100">المنصات المتصلة</h3>
        <button className="text-sm text-blue-400 hover:underline flex items-center gap-1">
          <Plus size={16} /> إضافة وجهة
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {platforms.map((platform) => (
          <div 
            key={platform.id}
            className={`p-4 rounded-xl border transition-all ${
              platform.active 
                ? 'bg-blue-900/20 border-blue-500/50' 
                : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${platform.color}`}>
                  {PLATFORM_ICONS[platform.icon]}
                </div>
                <div>
                  <h4 className="font-bold text-sm">{platform.name}</h4>
                  <div className="flex items-center gap-1 text-[10px]">
                    {platform.connected ? (
                      <span className="text-emerald-500 flex items-center gap-1"><CheckCircle2 size={10} /> متصل</span>
                    ) : (
                      <span className="text-slate-500 flex items-center gap-1"><XCircle size={10} /> غير متصل</span>
                    )}
                  </div>
                </div>
              </div>
              <button 
                onClick={() => onToggleActive(platform.id)}
                disabled={isStreaming}
                className={`w-12 h-6 rounded-full p-1 transition-colors relative ${
                  platform.active ? 'bg-blue-600' : 'bg-slate-700'
                } ${isStreaming ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                  platform.active ? '-translate-x-6' : 'translate-x-0'
                }`} />
              </button>
            </div>
            
            {platform.active && (
              <div className="mt-3 pt-3 border-t border-slate-800 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-slate-500 font-mono truncate max-w-[150px]">
                    URL: {platform.streamUrl || 'يرجى الإدخال'}
                  </span>
                  <button className="text-[10px] text-blue-400 hover:underline"><ExternalLink size={10} /></button>
                </div>
                {platform.active && isStreaming && (
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                    <span className="text-[10px] text-emerald-500">جاري الإرسال...</span>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlatformManager;
