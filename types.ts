
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
