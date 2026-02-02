
export type PlatformId = 'youtube' | 'twitch' | 'facebook' | 'tiktok' | 'twitter' | 'custom';

export interface Platform {
  id: PlatformId;
  name: string;
  icon: string;
  connected: boolean;
  active: boolean;
  streamUrl?: string;
  streamKey?: string;
  color: string;
}

export interface StreamStats {
  bitrate: number;
  fps: number;
  viewers: number;
  uptime: string;
}

export interface ChatMessage {
  id: string;
  platform: PlatformId;
  user: string;
  text: string;
  timestamp: Date;
  sentiment?: 'positive' | 'neutral' | 'negative';
}

export interface Notification {
  id: string;
  type: 'error' | 'warning' | 'success' | 'info';
  message: string;
  timestamp: Date;
}
