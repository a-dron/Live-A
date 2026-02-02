
import React, { useState, useEffect, useRef } from 'react';
import { LayoutDashboard, Radio, Users, Settings, Activity, HelpCircle, LogOut, Copy, RefreshCw, Sparkles, Wand2, UserPlus, Heart, MessageSquare, MonitorPlay, Clapperboard, Share2, Bell, AlertTriangle, X, CheckCircle } from 'lucide-react';
import StreamPreview from './components/StreamPreview';
import PlatformManager from './components/PlatformManager';
import ChatPanel from './components/ChatPanel';
import MediaLibrary from './components/MediaLibrary';
import { INITIAL_PLATFORMS } from './constants';
import { Platform, StreamStats, Notification } from './types';
import { getStreamOptimization } from './services/geminiService';
import { sendEmailAlert } from './services/notificationService';

type TabType = 'dashboard' | 'community' | 'stats' | 'settings';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [platforms, setPlatforms] = useState<Platform[]>(INITIAL_PLATFORMS);
  const [isStreaming, setIsStreaming] = useState(false);
  const [stats, setStats] = useState<StreamStats>({ bitrate: 0, fps: 0, viewers: 0, uptime: '00:00:00' });
  const [streamTitle, setStreamTitle] = useState('بثي المباشر الاحترافي');
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Director States
  const [activeSource, setActiveSource] = useState<'live' | 'media'>('live');
  const [selectedMediaUrl, setSelectedMediaUrl] = useState<string | null>(null);

  // Notification States
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [userEmail, setUserEmail] = useState('user@example.com');
  const [enableEmailAlerts, setEnableEmailAlerts] = useState(true);

  const addNotification = (type: Notification['type'], message: string) => {
    const newNotif: Notification = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      message,
      timestamp: new Date(),
    };
    setNotifications(prev => [newNotif, ...prev].slice(0, 5));
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== newNotif.id));
    }, 5000);
  };

  const handleDisconnection = async (reason: string) => {
    if (!isStreaming) return;
    
    // 1. Switch to Media Fallback automatically
    if (selectedMediaUrl) {
      setActiveSource('media');
      addNotification('warning', 'انقطع اتصال المصدر! تم تفعيل مقطع الطوارئ تلقائياً.');
    } else {
      setIsStreaming(false);
      addNotification('error', `فشل البث: ${reason}`);
    }

    // 2. Send Email Alert
    if (enableEmailAlerts) {
      await sendEmailAlert(userEmail, streamTitle, reason);
    }
  };

  const togglePlatform = (id: string) => {
    setPlatforms(prev => prev.map(p => 
      p.id === id ? { ...p, active: !p.active } : p
    ));
  };

  const startStream = () => {
    if (platforms.filter(p => p.active).length === 0) {
      addNotification('warning', 'يرجى تفعيل منصة واحدة على الأقل قبل بدء البث.');
      return;
    }
    setIsStreaming(true);
    addNotification('success', 'بدأ البث المباشر على جميع المنصات المختارة.');
  };

  const stopStream = () => {
    setIsStreaming(false);
    addNotification('info', 'تم إنهاء البث بنجاح.');
  };

  // Simulate periodic connection check
  useEffect(() => {
    if (isStreaming && activeSource === 'live') {
      const timer = setInterval(() => {
        // Random 2% chance of failure for demonstration
        if (Math.random() < 0.02) {
          handleDisconnection('انقطاع في جودة الإنترنت (Jitter High)');
        }
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [isStreaming, activeSource]);

  useEffect(() => {
    let interval: any;
    if (isStreaming) {
      interval = setInterval(() => {
        setStats(prev => ({
          bitrate: 4500 + Math.random() * 500,
          fps: 60,
          viewers: Math.floor(Math.random() * 150),
          uptime: '00:15:23' 
        }));
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [isStreaming]);

  const generateAIOptimization = async () => {
    setIsGenerating(true);
    const result = await getStreamOptimization(streamTitle);
    if (result && result.titles.length > 0) {
      setStreamTitle(result.titles[0]);
    }
    setIsGenerating(false);
  };

  const DashboardView = () => (
    <div className="grid grid-cols-12 gap-8">
      <div className="col-span-12 lg:col-span-8 space-y-6">
        <div className="grid grid-cols-12 gap-6 items-start">
          <div className="col-span-12 xl:col-span-9">
            <StreamPreview 
              isLive={isStreaming} 
              activeSource={activeSource} 
              selectedMediaUrl={selectedMediaUrl} 
            />
          </div>
          <div className="col-span-12 xl:col-span-3 bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col gap-4">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest text-center">غرفة التبديل</h4>
            <button 
              onClick={() => setActiveSource('live')}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl transition-all border-2 ${activeSource === 'live' ? 'border-red-600 bg-red-600 text-white animate-pulse' : 'border-slate-800 bg-slate-950 text-slate-500 hover:border-slate-700'}`}
            >
              <MonitorPlay size={24} />
              <span className="text-[10px] font-bold">LIVE CAM</span>
            </button>
            <button 
              onClick={() => {
                if(!selectedMediaUrl) addNotification('info', "يرجى اختيار مقطع من المكتبة أولاً");
                else setActiveSource('media');
              }}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl transition-all border-2 ${activeSource === 'media' ? 'border-orange-600 bg-orange-600 text-white animate-pulse' : 'border-slate-800 bg-slate-950 text-slate-500 hover:border-slate-700'}`}
            >
              <Clapperboard size={24} />
              <span className="text-[10px] font-bold">MEDIA CLIP</span>
            </button>
            
            <div className="mt-4 pt-4 border-t border-slate-800">
               <div className="text-[10px] text-slate-500 mb-2">اتصال الخادم</div>
               <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden">
                  <div className={`h-full bg-emerald-500 transition-all duration-1000 ${isStreaming ? 'w-full' : 'w-0'}`}></div>
               </div>
               <button 
                 onClick={() => isStreaming && handleDisconnection('محاكاة انقطاع يدوي')}
                 className="mt-4 w-full text-[10px] text-red-500 hover:underline"
                >
                 اختبار انقطاع الاتصال
               </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <MediaLibrary onSelect={setSelectedMediaUrl} selectedUrl={selectedMediaUrl} />
          <div className="bg-slate-900/50 rounded-2xl p-6 border border-slate-800">
            <PlatformManager platforms={platforms} onToggleActive={togglePlatform} isStreaming={isStreaming} />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="المشاهدون" value={isStreaming ? stats.viewers.toString() : '0'} />
          <StatCard label="معدل البت" value={isStreaming ? `${Math.round(stats.bitrate)} Kbps` : '0'} />
          <StatCard label="الفريمات" value={isStreaming ? `${stats.fps} FPS` : '0'} />
          <StatCard label="وقت البث" value={isStreaming ? stats.uptime : '00:00:00'} />
        </div>
      </div>

      <div className="col-span-12 lg:col-span-4 h-[calc(100vh-140px)] sticky top-4">
        <ChatPanel />
      </div>
    </div>
  );

  const SettingsView = () => (
    <div className="max-w-4xl space-y-8 animate-in fade-in duration-500">
      <h2 className="text-2xl font-bold">إعدادات الحساب والتنبيهات</h2>
      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl divide-y divide-slate-800">
        <div className="p-6 space-y-6">
          <h3 className="font-bold text-blue-400 flex items-center gap-2"><Bell size={18} /> نظام التنبيهات</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">تنبيهات البريد الإلكتروني</div>
                <div className="text-xs text-slate-500">إرسال رسالة فورية عند انقطاع البث لأكثر من 5 ثوانٍ</div>
              </div>
              <button 
                onClick={() => setEnableEmailAlerts(!enableEmailAlerts)}
                className={`w-12 h-6 rounded-full p-1 transition-colors relative ${enableEmailAlerts ? 'bg-blue-600' : 'bg-slate-700'}`}
              >
                <div className={`w-4 h-4 bg-white rounded-full transition-transform ${enableEmailAlerts ? '-translate-x-6' : 'translate-x-0'}`} />
              </button>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm text-slate-400">عنوان البريد الإلكتروني المستهدف</label>
              <input 
                type="email" 
                value={userEmail} 
                onChange={(e) => setUserEmail(e.target.value)}
                className="w-full max-w-md bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-slate-300 focus:ring-1 focus:ring-blue-500 outline-none" 
              />
            </div>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <h3 className="font-bold text-blue-400">جودة البث</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm text-slate-400">الدقة القصوى</label>
              <select className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-slate-300">
                <option>1080p (FHD)</option>
                <option>720p (HD)</option>
                <option>4K (Ultra HD)</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Added CommunityView component to fix error on line 333
  const CommunityView = () => (
    <div className="max-w-4xl space-y-8 animate-in fade-in duration-500 text-right" dir="rtl">
      <h2 className="text-2xl font-bold text-slate-100">المجتمع والمتابعين</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 flex flex-col items-center text-center gap-4">
          <div className="p-4 bg-red-500/10 text-red-500 rounded-full"><Heart size={32} /></div>
          <div>
            <div className="text-2xl font-bold text-slate-100">1,234</div>
            <div className="text-sm text-slate-500">متابع جديد اليوم</div>
          </div>
        </div>
        <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 flex flex-col items-center text-center gap-4">
          <div className="p-4 bg-blue-500/10 text-blue-500 rounded-full"><UserPlus size={32} /></div>
          <div>
            <div className="text-2xl font-bold text-slate-100">56</div>
            <div className="text-sm text-slate-500">مشترك نشط</div>
          </div>
        </div>
        <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 flex flex-col items-center text-center gap-4">
          <div className="p-4 bg-emerald-500/10 text-emerald-500 rounded-full"><MessageSquare size={32} /></div>
          <div>
            <div className="text-2xl font-bold text-slate-100">890</div>
            <div className="text-sm text-slate-500">رسالة في الساعة</div>
          </div>
        </div>
      </div>
      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
        <h3 className="font-bold mb-4 text-slate-100">أعلى المساهمين</h3>
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white">U{i}</div>
                <div className="text-sm font-bold text-slate-200">المستخدم المميز {i}</div>
              </div>
              <div className="text-xs text-blue-400">نشط منذ {i*2} ساعات</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Added StatsView component to fix error on line 334
  const StatsView = () => (
    <div className="max-w-4xl space-y-8 animate-in fade-in duration-500 text-right" dir="rtl">
      <h2 className="text-2xl font-bold text-slate-100">تحليلات البث المتقدمة</h2>
      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-8">
          <h3 className="font-bold text-slate-100">أداء البث خلال آخر 24 ساعة</h3>
          <div className="flex gap-4">
             <div className="flex items-center gap-2 text-xs text-slate-500"><div className="w-2 h-2 bg-blue-500 rounded-full"></div> المشاهدون</div>
             <div className="flex items-center gap-2 text-xs text-slate-500"><div className="w-2 h-2 bg-emerald-500 rounded-full"></div> الجودة</div>
          </div>
        </div>
        <div className="h-64 flex items-end gap-2 border-b border-slate-800 pb-2">
          {[40, 60, 45, 90, 65, 80, 50, 70, 85, 40, 55, 75].map((h, i) => (
            <div key={i} className="flex-1 bg-blue-600/20 rounded-t-sm relative group">
              <div style={{ height: `${h}%` }} className="w-full bg-blue-500 rounded-t-sm group-hover:bg-blue-400 transition-all cursor-help"></div>
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                {h * 10}
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-4 text-[10px] text-slate-500 font-mono">
          <span>00:00</span>
          <span>06:00</span>
          <span>12:00</span>
          <span>18:00</span>
          <span>23:59</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
           <h4 className="text-xs font-bold text-slate-500 mb-4 uppercase">مصادر المشاهدة</h4>
           <div className="space-y-3">
              <div className="flex items-center justify-between text-sm text-slate-300">
                <span>يوتيوب</span>
                <span className="font-bold">45%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-red-600" style={{width: '45%'}}></div>
              </div>
              <div className="flex items-center justify-between text-sm text-slate-300">
                <span>تويتش</span>
                <span className="font-bold">35%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-purple-600" style={{width: '35%'}}></div>
              </div>
           </div>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
           <h4 className="text-xs font-bold text-slate-500 mb-4 uppercase">توزيع الموقع الجغرافي</h4>
           <div className="space-y-3">
              <div className="flex items-center justify-between text-sm text-slate-300">
                <span>السعودية</span>
                <span className="font-bold">60%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-600" style={{width: '60%'}}></div>
              </div>
              <div className="flex items-center justify-between text-sm text-slate-300">
                <span>مصر</span>
                <span className="font-bold">20%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600" style={{width: '20%'}}></div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950">
      {/* Toast Notifications */}
      <div className="fixed top-24 left-8 z-[100] flex flex-col gap-3 pointer-events-none">
        {notifications.map((n) => (
          <div 
            key={n.id} 
            className={`pointer-events-auto flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border animate-in slide-in-from-left-full duration-300 ${
              n.type === 'error' ? 'bg-red-900/90 border-red-500 text-red-100' :
              n.type === 'warning' ? 'bg-orange-900/90 border-orange-500 text-orange-100' :
              n.type === 'success' ? 'bg-emerald-900/90 border-emerald-500 text-emerald-100' :
              'bg-slate-800/90 border-slate-600 text-slate-100'
            }`}
          >
            {n.type === 'error' && <AlertTriangle size={20} />}
            {n.type === 'warning' && <AlertTriangle size={20} />}
            {n.type === 'success' && <CheckCircle size={20} />}
            {n.type === 'info' && <Bell size={20} />}
            <span className="text-sm font-bold">{n.message}</span>
            <button 
              onClick={() => setNotifications(prev => prev.filter(notif => notif.id !== n.id))}
              className="mr-auto p-1 hover:bg-white/10 rounded"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>

      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 border-l border-slate-800 flex flex-col hidden lg:flex">
        <div className="p-8">
          <div className="flex items-center gap-3 text-2xl font-black text-blue-500 mb-10 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <Radio className="animate-pulse" />
            OmniCast
          </div>
          
          <nav className="space-y-2">
            <NavItem icon={<LayoutDashboard />} label="لوحة التحكم" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
            <NavItem icon={<Users />} label="المجتمع" active={activeTab === 'community'} onClick={() => setActiveTab('community')} />
            <NavItem icon={<Activity />} label="الإحصائيات" active={activeTab === 'stats'} onClick={() => setActiveTab('stats')} />
            <NavItem icon={<Settings />} label="الإعدادات" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
          </nav>
        </div>
        
        <div className="mt-auto p-8 border-t border-slate-800/50">
          <div className="flex items-center gap-3 mb-6 p-3 bg-blue-500/5 rounded-xl border border-blue-500/10">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-xs font-bold text-white">Pro</div>
            <div>
              <div className="text-[10px] text-slate-400 font-bold uppercase">الخطة الحالية</div>
              <div className="text-xs font-bold text-white">إصدار المخرج المحترف</div>
            </div>
          </div>
          <button className="flex items-center gap-3 text-red-400 hover:text-red-300 transition w-full">
            <LogOut size={20} /> خروج
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-20 bg-slate-900/50 backdrop-blur-md border-b border-slate-800 px-8 flex items-center justify-between z-20">
          <div className="flex-1 max-w-2xl flex items-center gap-4">
            <input 
              type="text" 
              value={streamTitle}
              onChange={(e) => setStreamTitle(e.target.value)}
              className="bg-transparent text-xl font-bold text-slate-100 border-none focus:ring-0 w-full outline-none"
              placeholder="أدخل عنوان البث..."
            />
            <button onClick={generateAIOptimization} disabled={isGenerating} className="p-2 bg-slate-800 text-blue-400 hover:text-blue-300 rounded-lg transition">
              <Wand2 size={20} className={isGenerating ? 'animate-spin' : ''} />
            </button>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative p-2 text-slate-400 hover:text-white transition cursor-pointer">
              <Bell size={22} />
              {notifications.length > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-blue-500 rounded-full border-2 border-slate-900"></span>
              )}
            </div>
            {isStreaming ? (
              <button onClick={stopStream} className="bg-red-600 hover:bg-red-500 text-white px-8 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-red-900/20">
                إنهاء البث
              </button>
            ) : (
              <button onClick={startStream} className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-blue-900/20">
                بدء البث المباشر
              </button>
            )}
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-slate-950/20">
          {activeTab === 'dashboard' && <DashboardView />}
          {activeTab === 'community' && <CommunityView />}
          {activeTab === 'stats' && <StatsView />}
          {activeTab === 'settings' && <SettingsView />}
        </div>
      </main>
    </div>
  );
};

const NavItem = ({ icon, label, active = false, onClick }: { icon: React.ReactNode, label: string, active?: boolean, onClick: () => void }) => (
  <button onClick={onClick} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition font-medium w-full text-right ${active ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
    {icon}
    {label}
  </button>
);

const StatCard = ({ label, value }: { label: string, value: string }) => (
  <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 hover:border-slate-700 transition group">
    <div className="text-slate-500 text-xs font-bold uppercase mb-1 group-hover:text-blue-400 transition">{label}</div>
    <div className="text-xl font-bold text-slate-100">{value}</div>
  </div>
);

export default App;
