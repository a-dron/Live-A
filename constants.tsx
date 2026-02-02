
import React from 'react';
import { Youtube, Twitch, Facebook, Video, Twitter, Share2 } from 'lucide-react';
import { Platform } from './types';

export const INITIAL_PLATFORMS: Platform[] = [
  { id: 'youtube', name: 'YouTube Live', icon: 'youtube', connected: true, active: false, color: 'bg-red-600', streamUrl: 'rtmp://a.rtmp.youtube.com/live2' },
  { id: 'twitch', name: 'Twitch', icon: 'twitch', connected: true, active: false, color: 'bg-purple-600', streamUrl: 'rtmp://live.twitch.tv/app/' },
  { id: 'facebook', name: 'Facebook Live', icon: 'facebook', connected: false, active: false, color: 'bg-blue-700', streamUrl: 'rtmps://live-api-s.facebook.com:443/rtmp/' },
  { id: 'tiktok', name: 'TikTok', icon: 'video', connected: false, active: false, color: 'bg-black', streamUrl: 'rtmp://server.tiktok.com/live/' },
  { id: 'twitter', name: 'X (Twitter)', icon: 'twitter', connected: false, active: false, color: 'bg-slate-900', streamUrl: 'rtmps://publish.twitter.com/' },
  { id: 'custom', name: 'Custom RTMP', icon: 'share-2', connected: true, active: false, color: 'bg-emerald-600', streamUrl: '' },
];

export const PLATFORM_ICONS: Record<string, React.ReactNode> = {
  youtube: <Youtube size={20} />,
  twitch: <Twitch size={20} />,
  facebook: <Facebook size={20} />,
  tiktok: <Video size={20} />,
  twitter: <Twitter size={20} />,
  'share-2': <Share2 size={20} />,
};
