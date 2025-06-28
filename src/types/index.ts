export interface VoiceNote {
  id: string;
  audioUrl: string;
  audioBlob: Blob;
  title: string;
  category: CategoryType;
  duration: number;
  createdAt: Date;
  waveformData: number[];
  tags: string[];
  isFavorite: boolean;
}

export interface Category {
  id: CategoryType;
  name: string;
  emoji: string;
  color: string;
  keywords: string[];
  description: string;
}

export type CategoryType = 
  | 'ideas' 
  | 'shopping' 
  | 'work' 
  | 'tasks' 
  | 'goals' 
  | 'random';

export interface RecordingState {
  isRecording: boolean;
  isPaused: boolean;
  duration: number;
  audioLevel: number;
  waveformData: number[];
}

export interface AudioPlayerState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  playbackRate: number;
  volume: number;
}

export interface FilterOptions {
  category: CategoryType | 'all';
  searchQuery: string;
  sortBy: 'newest' | 'oldest' | 'duration' | 'alphabetical';
  dateRange?: {
    start: Date;
    end: Date;
  };
}

export interface AppSettings {
  theme: 'light' | 'dark';
  audioQuality: 'low' | 'medium' | 'high';
  maxRecordingLength: number;
  autoSave: boolean;
  defaultCategory: CategoryType;
}