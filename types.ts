
export interface Channel {
  id: string;
  name: string;
  status: 'active' | 'idle' | 'error';
  lastActivity: string;
  count: number;
}

export interface MovieCopyLog {
  id: string;
  source: string;
  title: string;
  timestamp: string;
  status: 'success' | 'failed';
}

export interface GeneratedCaption {
  title: string;
  genre: string;
  year: string;
  description: string;
  hashtags: string[];
}

export interface BotSettings {
  botToken: string;
  apiId: string;
  apiHash: string;
  targetChannel: string;
  autoReplyEnabled: boolean;
}

export interface TerminalLog {
  id: string;
  message: string;
  type: 'info' | 'error' | 'success' | 'ai';
  time: string;
}
