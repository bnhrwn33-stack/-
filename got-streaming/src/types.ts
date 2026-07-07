/** מקור וידאו יחיד (קובץ ב-Drive או URL ישיר) */
export interface VideoSource {
  id: string;
  label: string; // "1080p" / "720p" / "מקור"
  streamUrl: string;
  downloadUrl: string;
  previewUrl?: string; // iframe fallback של Drive
  size?: number;
  durationMillis?: number;
  fileName?: string;
}

export interface Episode {
  key: string; // "s1e1"
  season: number;
  episode: number;
  title: string; // שם הפרק (מקור)
  titleHe: string; // שם בעברית
  synopsis: string; // תקציר קצר בעברית
  sources: VideoSource[];
  thumbnail?: string;
}

export interface Season {
  number: number;
  title: string;
  description: string;
  year: string;
  episodes: Episode[];
}

export interface WatchProgress {
  time: number;
  duration: number;
  updatedAt: number;
}

export interface DriveSettings {
  folderUrl: string;
  apiKey: string;
}

export type LibraryStatus = 'demo' | 'loading' | 'ready' | 'error';
