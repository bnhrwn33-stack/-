import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { DriveSettings, Episode, LibraryStatus, Season, VideoSource, WatchProgress } from '../types';
import { EPISODES_META, SEASONS_META } from '../lib/metadata';
import { episodeKey, parseEpisodeFileName, parseQualityLabel, parseSeasonHint } from '../lib/parser';
import {
  downloadUrl, extractFolderId, previewUrl, scanDriveFolder, shareUrl, streamUrl,
} from '../lib/drive';
import * as store from '../lib/storage';
import { DEFAULT_API_KEY, DEFAULT_DRIVE_FOLDER_URL } from '../lib/config';
import {
  clearDirHandle, ensurePermission, loadDirHandle, pickDirectory, saveDirHandle,
  scanDirectoryHandle, scanFileList, supportsDirectoryPicker, type LocalScanResult,
} from '../lib/local';

export type LibrarySource = 'demo' | 'drive' | 'local';

interface LibraryContextValue {
  seasons: Season[];
  status: LibraryStatus;
  error: string | null;
  connectedCount: number;
  settings: DriveSettings;
  librarySource: LibrarySource;
  localInfo: { matched: number; total: number; unsupported: number } | null;
  connectDrive: (settings: DriveSettings) => Promise<void>;
  disconnectDrive: () => void;
  connectLocalDirectory: () => Promise<'ok' | 'cancelled' | 'blocked'>;
  connectLocalFiles: (files: FileList | File[]) => void;
  supportsDirectoryPicker: boolean;
  findEpisode: (season: number, episode: number) => Episode | undefined;
  nextEpisode: (ep: Episode) => Episode | undefined;
  prevEpisode: (ep: Episode) => Episode | undefined;
  // מצב אישי
  progress: Record<string, WatchProgress>;
  watched: string[];
  favorites: string[];
  reportProgress: (key: string, time: number, duration: number) => void;
  toggleWatched: (key: string) => void;
  toggleFavorite: (key: string) => void;
  // דירוגים, תגובות ופרופיל
  ratings: Record<string, number>;
  rateEpisode: (key: string, stars: number) => void;
  comments: Record<string, store.EpisodeComment[]>;
  addComment: (key: string, text: string) => void;
  removeComment: (key: string, ts: number) => void;
  profile: store.Profile | null;
  login: (name: string) => void;
  logout: () => void;
}

const LibraryContext = createContext<LibraryContextValue | null>(null);

/** בונה את שלד הקטלוג מהמטא-דאטה (ללא קבצים) */
function buildCatalog(sourcesByKey: Map<string, VideoSource[]>): Season[] {
  return SEASONS_META.map((sm) => ({
    number: sm.number,
    title: `עונה ${sm.number}`,
    description: sm.description,
    year: sm.year,
    episodes: EPISODES_META.filter((e) => e.season === sm.number).map((e) => {
      const key = episodeKey(e.season, e.episode);
      const sources = sourcesByKey.get(key) ?? [];
      // מיון איכויות מהגבוהה לנמוכה
      sources.sort((a, b) => parseInt(b.label) - parseInt(a.label) || a.label.localeCompare(b.label));
      return { key, season: e.season, episode: e.episode, title: e.title, titleHe: e.titleHe, synopsis: e.synopsis, sources };
    }),
  }));
}

export function LibraryProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<DriveSettings>(() => store.getSettings());
  const [sourcesByKey, setSourcesByKey] = useState<Map<string, VideoSource[]>>(new Map());
  const [status, setStatus] = useState<LibraryStatus>('demo');
  const [error, setError] = useState<string | null>(null);
  const [librarySource, setLibrarySource] = useState<LibrarySource>('demo');
  const [localInfo, setLocalInfo] = useState<{ matched: number; total: number; unsupported: number } | null>(null);
  const [progress, setProgress] = useState<Record<string, WatchProgress>>(() => store.getAllProgress());
  const [watched, setWatchedState] = useState<string[]>(() => store.getWatched());
  const [favorites, setFavoritesState] = useState<string[]>(() => store.getFavorites());
  const [ratings, setRatings] = useState<Record<string, number>>(() => store.getRatings());
  const [comments, setComments] = useState<Record<string, store.EpisodeComment[]>>(() => store.getComments());
  const [profile, setProfile] = useState<store.Profile | null>(() => store.getProfile());

  const connectDrive = useCallback(async (s: DriveSettings) => {
    setStatus('loading');
    setError(null);
    try {
      const folderId = extractFolderId(s.folderUrl);
      if (!folderId) throw new Error('לא זוהה מזהה תיקייה בקישור. הדבק קישור לתיקיית Drive.');
      if (!s.apiKey.trim()) throw new Error('נדרש מפתח Google API כדי לקרוא את התיקייה.');

      const files = await scanDriveFolder(folderId, s.apiKey.trim());
      if (files.length === 0) throw new Error('לא נמצאו קובצי וידאו בתיקייה.');

      const map = new Map<string, VideoSource[]>();
      let matched = 0;
      for (const f of files) {
        const parsed = parseEpisodeFileName(f.name, f.parentFolderName ? parseSeasonHint(f.parentFolderName) : null);
        if (!parsed) continue;
        const key = episodeKey(parsed.season, parsed.episode);
        const src: VideoSource = {
          id: f.id,
          label: parseQualityLabel(f.name),
          streamUrl: streamUrl(f.id, s.apiKey.trim()),
          downloadUrl: downloadUrl(f.id),
          previewUrl: previewUrl(f.id),
          size: f.size ? parseInt(f.size, 10) : undefined,
          durationMillis: f.videoMediaMetadata?.durationMillis ? parseInt(f.videoMediaMetadata.durationMillis, 10) : undefined,
          fileName: f.name,
        };
        if (!map.has(key)) map.set(key, []);
        map.get(key)!.push(src);
        matched++;
      }
      if (matched === 0) throw new Error(`נמצאו ${files.length} קבצים אך לא זוהו מספרי עונה/פרק בשמותיהם.`);

      setSourcesByKey(map);
      store.saveSettings(s);
      setSettings(s);
      setLibrarySource('drive');
      setLocalInfo(null);
      setStatus('ready');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'שגיאה לא צפויה');
      setStatus(sourcesByKey.size > 0 ? 'ready' : 'error');
      throw e;
    }
  }, [sourcesByKey.size]);

  const disconnectDrive = useCallback(() => {
    setSourcesByKey(new Map());
    const empty = { folderUrl: '', apiKey: '' };
    store.saveSettings(empty);
    setSettings(empty);
    setLibrarySource('demo');
    setLocalInfo(null);
    setStatus('demo');
    setError(null);
    clearDirHandle();
  }, []);

  /** מחיל תוצאות סריקה מקומית על הקטלוג */
  const applyLocalResult = useCallback((result: LocalScanResult) => {
    if (result.matched === 0) {
      setError(
        result.total === 0
          ? 'לא נמצאו קובצי וידאו בתיקייה שנבחרה.'
          : `נמצאו ${result.total} קבצים אך לא זוהו מספרי עונה/פרק בשמותיהם. נסה לשמות כמו S01E01 או "עונה 1 פרק 1".`,
      );
      setStatus(sourcesByKey.size > 0 ? 'ready' : 'error');
      return;
    }
    setSourcesByKey(result.sourcesByKey);
    setLibrarySource('local');
    setLocalInfo({ matched: result.matched, total: result.total, unsupported: result.unsupported });
    setError(null);
    setStatus('ready');
  }, [sourcesByKey.size]);

  /**
   * בחירת תיקייה דרך File System Access API (Chrome/Edge) — נשמרת לחיבור אוטומטי.
   * מחזיר 'blocked' כשה-API לא זמין/חסום, כדי שהקורא ייפול חזרה ל-input רגיל.
   */
  const connectLocalDirectory = useCallback(async (): Promise<'ok' | 'cancelled' | 'blocked'> => {
    let handle: FileSystemDirectoryHandle | null;
    try {
      handle = await pickDirectory();
    } catch {
      return 'blocked';
    }
    if (!handle) return 'cancelled';
    setStatus('loading');
    setError(null);
    try {
      const result = await scanDirectoryHandle(handle);
      applyLocalResult(result);
      if (result.matched > 0) await saveDirHandle(handle);
      return 'ok';
    } catch (e) {
      setError(e instanceof Error ? e.message : 'שגיאה בקריאת התיקייה');
      setStatus(sourcesByKey.size > 0 ? 'ready' : 'error');
      return 'ok';
    }
  }, [applyLocalResult, sourcesByKey.size]);

  /** גיבוי אוניברסלי: קבצים מ-<input webkitdirectory> */
  const connectLocalFiles = useCallback((files: FileList | File[]) => {
    setStatus('loading');
    setError(null);
    try {
      applyLocalResult(scanFileList(files));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'שגיאה בקריאת הקבצים');
      setStatus(sourcesByKey.size > 0 ? 'ready' : 'error');
    }
  }, [applyLocalResult, sourcesByKey.size]);

  // חיבור אוטומטי בהעלאת האתר: קודם תיקייה מקומית שמורה, אחר כך Drive, ואז ברירת מחדל
  useEffect(() => {
    let cancelled = false;
    (async () => {
      // 1) תיקייה מקומית שנשמרה בביקור קודם (Chrome/Edge)
      const handle = await loadDirHandle();
      if (handle && !cancelled) {
        const ok = await ensurePermission(handle);
        if (ok && !cancelled) {
          setStatus('loading');
          try {
            const result = await scanDirectoryHandle(handle);
            if (!cancelled) applyLocalResult(result);
            return;
          } catch {
            /* נמשיך ל-Drive */
          }
        }
      }
      if (cancelled) return;

      // 2) הגדרות Drive שמורות / ברירת מחדל
      const saved = store.getSettings();
      const folderUrl = saved.folderUrl || DEFAULT_DRIVE_FOLDER_URL;
      const apiKey = saved.apiKey || DEFAULT_API_KEY;
      if (folderUrl && apiKey) {
        connectDrive({ folderUrl, apiKey }).catch(() => {/* השגיאה כבר נשמרה */});
      } else if (folderUrl && !saved.folderUrl) {
        store.saveSettings({ folderUrl, apiKey: '' });
        setSettings({ folderUrl, apiKey: '' });
      }
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const seasons = useMemo(() => buildCatalog(sourcesByKey), [sourcesByKey]);
  const flat = useMemo(() => seasons.flatMap((s) => s.episodes), [seasons]);

  const findEpisode = useCallback(
    (season: number, episode: number) => flat.find((e) => e.season === season && e.episode === episode),
    [flat],
  );
  const nextEpisode = useCallback((ep: Episode) => flat[flat.findIndex((e) => e.key === ep.key) + 1], [flat]);
  const prevEpisode = useCallback((ep: Episode) => {
    const i = flat.findIndex((e) => e.key === ep.key);
    return i > 0 ? flat[i - 1] : undefined;
  }, [flat]);

  const reportProgress = useCallback((key: string, time: number, duration: number) => {
    store.saveProgress(key, time, duration);
    setProgress((p) => ({ ...p, [key]: { time, duration, updatedAt: Date.now() } }));
  }, []);

  const toggleWatched = useCallback((key: string) => {
    setWatchedState((prev) => store.setWatched(key, !prev.includes(key)));
  }, []);

  const toggleFavorite = useCallback((key: string) => {
    setFavoritesState((prev) => store.setFavorite(key, !prev.includes(key)));
  }, []);

  const rateEpisode = useCallback((key: string, stars: number) => {
    setRatings(store.setRating(key, stars));
  }, []);

  const addComment = useCallback((key: string, text: string) => {
    const name = store.getProfile()?.name ?? 'אורח';
    setComments(store.addComment(key, { name, text, ts: Date.now() }));
  }, []);

  const removeComment = useCallback((key: string, ts: number) => {
    setComments(store.deleteComment(key, ts));
  }, []);

  const login = useCallback((name: string) => {
    const p = { name: name.trim() };
    store.saveProfile(p);
    setProfile(p);
  }, []);

  const logout = useCallback(() => {
    store.saveProfile(null);
    setProfile(null);
  }, []);

  const connectedCount = useMemo(
    () => flat.filter((e) => e.sources.length > 0).length,
    [flat],
  );

  const value: LibraryContextValue = {
    seasons, status, error, connectedCount, settings,
    librarySource, localInfo,
    connectDrive, disconnectDrive,
    connectLocalDirectory, connectLocalFiles, supportsDirectoryPicker: supportsDirectoryPicker(),
    findEpisode, nextEpisode, prevEpisode,
    progress, watched, favorites, reportProgress, toggleWatched, toggleFavorite,
    ratings, rateEpisode, comments, addComment, removeComment, profile, login, logout,
  };

  return <LibraryContext.Provider value={value}>{children}</LibraryContext.Provider>;
}

export function useLibrary(): LibraryContextValue {
  const ctx = useContext(LibraryContext);
  if (!ctx) throw new Error('useLibrary חייב לרוץ בתוך LibraryProvider');
  return ctx;
}
