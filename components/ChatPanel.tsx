
import React, { useState, useEffect } from 'react';
import { MessageSquare, Send, Sparkles } from 'lucide-react';
import { ChatMessage } from '../types';
import { PLATFORM_ICONS } from '../constants';
import { moderateChat } from '../services/geminiService';

const ChatPanel: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [aiSummary, setAiSummary] = useState<string | null>(null);

  // Mock incoming messages
  useEffect(() => {
    const interval = setInterval(() => {
      const newMsg: ChatMessage = {
        id: Math.random().toString(),
        platform: ['youtube', 'twitch', 'facebook'][Math.floor(Math.random() * 3)] as any,
        user: `User_${Math.floor(Math.random() * 1000)}`,
        text: ['أهلاً بكم!', 'بث رائع!', 'كيف حالكم؟', 'استمر يا بطل!'][Math.floor(Math.random() * 4)],
        timestamp: new Date()
      };
      setMessages(prev => [...prev.slice(-50), newMsg]);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleModerate = async () => {
    const texts = messages.map(m => m.text);
    const summary = await moderateChat(texts);
    setAiSummary(summary);
    setTimeout(() => setAiSummary(null), 10000);
  };

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    const myMsg: ChatMessage = {
      id: Date.now().toString(),
      platform: 'custom',
      user: 'أنت (الستريمر)',
      text: input,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, myMsg]);
    setInput('');
  };

  return (
    <div className="flex flex-col h-full bg-slate-900/50 rounded-2xl border border-slate-800 overflow-hidden">
      <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900">
        <div className="flex items-center gap-2 font-bold text-slate-100">
          <MessageSquare size={20} className="text-blue-500" />
          المحادثة الموحدة
        </div>
        <button 
          onClick={handleModerate}
          className="text-xs bg-slate-800 hover:bg-slate-700 text-blue-400 px-2 py-1 rounded flex items-center gap-1 transition"
        >
          <Sparkles size={14} /> تحليل الذكاء الاصطناعي
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {aiSummary && (
          <div className="bg-blue-900/30 border border-blue-800/50 p-3 rounded-lg text-sm text-blue-200">
            <strong>ملخص الذكاء الاصطناعي:</strong> {aiSummary}
          </div>
        )}
        {messages.map((msg) => (
          <div key={msg.id} className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="text-slate-500">{PLATFORM_ICONS[msg.platform === 'custom' ? 'share-2' : msg.platform]}</span>
              <span className="text-sm font-bold text-blue-400">{msg.user}</span>
              <span className="text-[10px] text-slate-600">
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed bg-slate-800/40 p-2 rounded-lg rounded-tr-none">
              {msg.text}
            </p>
          </div>
        ))}
      </div>

      <form onSubmit={sendMessage} className="p-4 bg-slate-900 border-t border-slate-800">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="اكتب ردك هنا..."
            className="w-full bg-slate-800 text-slate-200 text-sm rounded-xl py-3 px-4 pl-12 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
          <button 
            type="submit"
            className="absolute left-2 top-1.5 p-2 text-blue-500 hover:text-blue-400 transition"
          >
            <Send size={20} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatPanel;
