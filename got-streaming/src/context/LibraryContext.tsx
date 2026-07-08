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
import { ACHIEVEMENTS, evaluateAchievements } from '../data/achievements';
import { useToast } from './ToastContext';
import { useUi } from './UiContext';

export type LibrarySource = 'demo' | 'drive' | 'local';
const NEW_WINDOW_MS = 14 * 24 * 60 * 60 * 1000; // פרק נחשב "חדש" 14 יום מגילויו

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
  newEpisodeKeys: Set<string>;

  // פרופילים
  profiles: store.Profile[];
  activeProfile: store.Profile;
  switchProfile: (id: string) => void;
  addProfile: (name: string, avatar: string, color: string, kids?: boolean) => store.Profile;
  editProfile: (id: string, patch: Partial<Omit<store.Profile, 'id'>>) => void;
  removeProfile: (id: string) => void;

  // מצב אישי (per-profile)
  progress: Record<string, WatchProgress>;
  watched: string[];
  favorites: string[];
  watchlist: string[];
  ratings: Record<string, number>;
  bookmarks: Record<string, store.Bookmark[]>;
  achievements: Record<string, number>;
  lists: store.PersonalList[];
  viewLog: store.ViewEvent[];
  reportProgress: (key: string, time: number, duration: number) => void;
  toggleWatched: (key: string) => void;
  toggleFavorite: (key: string) => void;
  toggleWatchlist: (key: string) => void;
  rateEpisode: (key: string, stars: number) => void;
  addBookmark: (key: string, time: number, label: string) => void;
  removeBookmark: (key: string, ts: number) => void;
  logView: (key: string) => void;
  createList: (name: string) => void;
  deleteList: (id: string) => void;
  toggleInList: (listId: string, key: string) => void;

  // תגובות (גלובלי — קהילתי)
  comments: Record<string, store.EpisodeComment[]>;
  addComment: (key: string, text: string) => void;
  removeComment: (key: string, ts: number) => void;
  likeComment: (key: string, ts: number) => void;

  // עריכות מטא-דאטה מותאמות (גלובלי — פאנל ניהול)
  overrides: Record<string, store.EpisodeOverride>;
  setEpisodeOverride: (key: string, patch: store.EpisodeOverride) => void;
  clearEpisodeOverride: (key: string) => void;
  customTags: Record<string, string[]>;
  setEpisodeCustomTags: (key: string, tags: string[]) => void;
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
      sources.sort((a, b) => parseInt(b.label) - parseInt(a.label) || a.label.localeCompare(b.label));
      return { key, season: e.season, episode: e.episode, title: e.title, titleHe: e.titleHe, synopsis: e.synopsis, sources };
    }),
  }));
}

export function LibraryProvider({ children }: { children: React.ReactNode }) {
  const toast = useToast();
  const { setKidsMode } = useUi();
  const [settings, setSettings] = useState<DriveSettings>(() => store.getSettings());
  const [sourcesByKey, setSourcesByKey] = useState<Map<string, VideoSource[]>>(new Map());
  const [status, setStatus] = useState<LibraryStatus>('demo');
  const [error, setError] = useState<string | null>(null);
  const [librarySource, setLibrarySource] = useState<LibrarySource>('demo');
  const [localInfo, setLocalInfo] = useState<{ matched: number; total: number; unsupported: number } | null>(null);
  const [newEpisodeKeys, setNewEpisodeKeys] = useState<Set<string>>(new Set());

  // ─── פרופילים ───
  const [profiles, setProfiles] = useState<store.Profile[]>(() => store.getProfiles());
  const [activeProfileId, setActiveProfileIdState] = useState<string>(() => store.getActiveProfileId());
  const activeProfile = useMemo(
    () => profiles.find((p) => p.id === activeProfileId) ?? profiles[0],
    [profiles, activeProfileId],
  );

  // ─── מצב אישי (נטען מחדש בכל החלפת פרופיל) ───
  const [progress, setProgress] = useState<Record<string, WatchProgress>>(() => store.getAllProgress(activeProfileId));
  const [watched, setWatchedState] = useState<string[]>(() => store.getWatched(activeProfileId));
  const [favorites, setFavoritesState] = useState<string[]>(() => store.getFavorites(activeProfileId));
  const [watchlist, setWatchlistState] = useState<string[]>(() => store.getWatchlist(activeProfileId));
  const [ratings, setRatings] = useState<Record<string, number>>(() => store.getRatings(activeProfileId));
  const [bookmarks, setBookmarks] = useState<Record<string, store.Bookmark[]>>(() => store.getBookmarks(activeProfileId));
  const [achievements, setAchievements] = useState<Record<string, number>>(() => store.getAchievements(activeProfileId));
  const [lists, setLists] = useState<store.PersonalList[]>(() => store.getLists(activeProfileId));
  const [viewLog, setViewLog] = useState<store.ViewEvent[]>(() => store.getViewLog(activeProfileId));

  // גלובלי
  const [comments, setComments] = useState<Record<string, store.EpisodeComment[]>>(() => store.getComments());
  const [overrides, setOverrides] = useState<Record<string, store.EpisodeOverride>>(() => store.getOverrides());
  const [customTags, setCustomTagsState] = useState<Record<string, string[]>>(() => store.getCustomTags());

  // החלפת פרופיל → טעינה מחדש של כל המצב האישי
  const switchProfile = useCallback((id: string) => {
    store.setActiveProfileId(id);
    setActiveProfileIdState(id);
    setProgress(store.getAllProgress(id));
    setWatchedState(store.getWatched(id));
    setFavoritesState(store.getFavorites(id));
    setWatchlistState(store.getWatchlist(id));
    setRatings(store.getRatings(id));
    setBookmarks(store.getBookmarks(id));
    setAchievements(store.getAchievements(id));
    setLists(store.getLists(id));
    setViewLog(store.getViewLog(id));
  }, []);

  const addProfile = useCallback((name: string, avatar: string, color: string, kids = false) => {
    const p = store.createProfile(name, avatar, color, kids);
    setProfiles(store.getProfiles());
    return p;
  }, []);

  const editProfile = useCallback((id: string, patch: Partial<Omit<store.Profile, 'id'>>) => {
    setProfiles(store.updateProfile(id, patch));
  }, []);

  const removeProfile = useCallback((id: string) => {
    const next = store.deleteProfile(id);
    setProfiles(next);
    if (activeProfileId === id) switchProfile(next[0].id);
  }, [activeProfileId, switchProfile]);

  // ─── בדיקת הישגים — מופעלת אחרי כל מוטציה משמעותית ───
  const checkAchievements = useCallback((snapshot: {
    watched: string[]; favorites: string[]; ratings: Record<string, number>;
    bookmarks: Record<string, store.Bookmark[]>; progress: Record<string, WatchProgress>;
  }) => {
    const totalEpisodes = EPISODES_META.length;
    const seasonsCompleted = SEASONS_META.filter((s) => {
      const eps = EPISODES_META.filter((e) => e.season === s.number);
      return eps.every((e) => snapshot.watched.includes(episodeKey(e.season, e.episode)));
    }).length;
    const times = Object.values(snapshot.progress).map((p) => p.updatedAt);
    const nightOwl = times.some((t) => { const h = new Date(t).getHours(); return h >= 0 && h < 5; });
    const byDay = new Map<string, number>();
    for (const t of times) {
      const d = new Date(t).toDateString();
      byDay.set(d, (byDay.get(d) ?? 0) + 1);
    }
    const bingeStreak = Math.max(0, ...byDay.values());
    const commentsCount = Object.values(store.getComments()).flat().filter((c) => c.name === activeProfile?.name).length;
    const bookmarksCount = Object.values(snapshot.bookmarks).flat().length;

    const ctx = {
      watchedCount: snapshot.watched.length,
      totalEpisodes,
      seasonsCompleted,
      favoritesCount: snapshot.favorites.length,
      ratingsCount: Object.keys(snapshot.ratings).length,
      commentsCount,
      bookmarksCount,
      nightOwl,
      bingeStreak,
    };
    const unlocked = evaluateAchievements(ctx, store.getAchievements(activeProfileId));
    if (unlocked.length > 0) {
      let all = store.getAchievements(activeProfileId);
      for (const a of unlocked) {
        all = store.unlockAchievement(activeProfileId, a.id);
        toast.push(a.icon, `הישג נפתח: ${a.title}`, a.desc);
      }
      setAchievements(all);
    }
  }, [activeProfileId, activeProfile, toast]);

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

      detectNewContent(map);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  /** משווה מול הסריקה הקודמת ומתריע על פרקים חדשים שהתגלו */
  const detectNewContent = useCallback((map: Map<string, VideoSource[]>) => {
    const seen = new Set(store.getSeenFileKeys());
    const currentKeys = [...map.keys()];
    const brandNew = currentKeys.filter((k) => !seen.has(k));
    if (brandNew.length > 0 && seen.size > 0) {
      toast.push('🆕', `נוספו ${brandNew.length} פרקים חדשים!`, 'אפשר למצוא אותם בשורת "חדש שנוסף" בעמוד הראשי');
      if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
        try { new Notification('משחקי הכס', { body: `נוספו ${brandNew.length} פרקים חדשים לספרייה שלך` }); } catch { /* חסום */ }
      }
      setNewEpisodeKeys(new Set(brandNew));
    } else {
      setNewEpisodeKeys(new Set());
    }
    store.setSeenFileKeys(currentKeys);
  }, [toast]);

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
    detectNewContent(result.sourcesByKey);
    setSourcesByKey(result.sourcesByKey);
    setLibrarySource('local');
    setLocalInfo({ matched: result.matched, total: result.total, unsupported: result.unsupported });
    setError(null);
    setStatus('ready');
  }, [sourcesByKey.size, detectNewContent]);

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
    store.saveProgress(activeProfileId, key, time, duration);
    setProgress((p) => {
      const next = { ...p, [key]: { time, duration, updatedAt: Date.now() } };
      checkAchievements({ watched, favorites, ratings, bookmarks, progress: next });
      return next;
    });
  }, [activeProfileId, watched, favorites, ratings, bookmarks, checkAchievements]);

  const toggleWatched = useCallback((key: string) => {
    const next = store.setWatched(activeProfileId, key, !watched.includes(key));
    setWatchedState(next);
    checkAchievements({ watched: next, favorites, ratings, bookmarks, progress });
  }, [activeProfileId, watched, favorites, ratings, bookmarks, progress, checkAchievements]);

  const toggleFavorite = useCallback((key: string) => {
    const next = store.setFavorite(activeProfileId, key, !favorites.includes(key));
    setFavoritesState(next);
    checkAchievements({ watched, favorites: next, ratings, bookmarks, progress });
  }, [activeProfileId, favorites, watched, ratings, bookmarks, progress, checkAchievements]);

  const toggleWatchlist = useCallback((key: string) => {
    setWatchlistState(store.setInWatchlist(activeProfileId, key, !watchlist.includes(key)));
  }, [activeProfileId, watchlist]);

  const rateEpisode = useCallback((key: string, stars: number) => {
    const next = store.setRating(activeProfileId, key, stars);
    setRatings(next);
    checkAchievements({ watched, favorites, ratings: next, bookmarks, progress });
  }, [activeProfileId, watched, favorites, bookmarks, progress, checkAchievements]);

  const addBookmark = useCallback((key: string, time: number, label: string) => {
    const next = store.addBookmark(activeProfileId, key, time, label);
    setBookmarks(next);
    checkAchievements({ watched, favorites, ratings, bookmarks: next, progress });
  }, [activeProfileId, watched, favorites, ratings, progress, checkAchievements]);

  const removeBookmark = useCallback((key: string, ts: number) => {
    setBookmarks(store.removeBookmark(activeProfileId, key, ts));
  }, [activeProfileId]);

  const logView = useCallback((key: string) => {
    store.logView(activeProfileId, key);
    setViewLog(store.getViewLog(activeProfileId));
  }, [activeProfileId]);

  const createList = useCallback((name: string) => {
    setLists(store.createList(activeProfileId, name));
  }, [activeProfileId]);

  const deleteList = useCallback((id: string) => {
    setLists(store.deleteList(activeProfileId, id));
  }, [activeProfileId]);

  const toggleInList = useCallback((listId: string, key: string) => {
    setLists(store.toggleInList(activeProfileId, listId, key));
  }, [activeProfileId]);

  const addComment = useCallback((key: string, text: string) => {
    const name = activeProfile?.name ?? 'אורח';
    const next = store.addComment(key, { name, text, ts: Date.now() });
    setComments(next);
    checkAchievements({ watched, favorites, ratings, bookmarks, progress });
  }, [activeProfile, watched, favorites, ratings, bookmarks, progress, checkAchievements]);

  const removeComment = useCallback((key: string, ts: number) => {
    setComments(store.deleteComment(key, ts));
  }, []);

  const likeComment = useCallback((key: string, ts: number) => {
    setComments(store.likeComment(key, ts));
  }, []);

  const setEpisodeOverride = useCallback((key: string, patch: store.EpisodeOverride) => {
    setOverrides(store.setOverride(key, patch));
  }, []);

  const clearEpisodeOverride = useCallback((key: string) => {
    setOverrides(store.clearOverride(key));
  }, []);

  const setEpisodeCustomTags = useCallback((key: string, tags: string[]) => {
    setCustomTagsState(store.setCustomTags(key, tags));
  }, []);

  // מצב ילדים עוקב אחר הפרופיל הפעיל
  useEffect(() => {
    setKidsMode(activeProfile?.kids ?? false);
  }, [activeProfile, setKidsMode]);

  const connectedCount = useMemo(() => flat.filter((e) => e.sources.length > 0).length, [flat]);

  const value: LibraryContextValue = {
    seasons, status, error, connectedCount, settings,
    librarySource, localInfo, newEpisodeKeys,
    connectDrive, disconnectDrive,
    connectLocalDirectory, connectLocalFiles, supportsDirectoryPicker: supportsDirectoryPicker(),
    findEpisode, nextEpisode, prevEpisode,
    profiles, activeProfile: activeProfile ?? profiles[0], switchProfile, addProfile, editProfile, removeProfile,
    progress, watched, favorites, watchlist, ratings, bookmarks, achievements, lists, viewLog,
    reportProgress, toggleWatched, toggleFavorite, toggleWatchlist, rateEpisode,
    addBookmark, removeBookmark, logView, createList, deleteList, toggleInList,
    comments, addComment, removeComment, likeComment,
    overrides, setEpisodeOverride, clearEpisodeOverride, customTags, setEpisodeCustomTags,
  };

  return <LibraryContext.Provider value={value}>{children}</LibraryContext.Provider>;
}

export function useLibrary(): LibraryContextValue {
  const ctx = useContext(LibraryContext);
  if (!ctx) throw new Error('useLibrary חייב לרוץ בתוך LibraryProvider');
  return ctx;
}

export { ACHIEVEMENTS };
