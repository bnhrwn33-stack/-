/**
 * אחסון מקומי (localStorage/IndexedDB בלבד — שום דבר לא עוזב את המכשיר).
 * רוב הנתונים מקוננים תחת פרופיל (משפחה = כמה פרופילים, כל אחד עם היסטוריה משלו).
 * תגובות, עריכות מטא-דאטה ותגיות מותאמות הן ברמת הספרייה כולה (משותפות לכל הפרופילים).
 */
import type { DriveSettings, WatchProgress } from '../types';

const KEYS = {
  progress: 'got.progress',
  watched: 'got.watched',
  favorites: 'got.favorites',
  watchlist: 'got.watchlist',
  ratings: 'got.ratings',
  bookmarks: 'got.bookmarks',
  achievements: 'got.achievements',
  viewLog: 'got.viewLog',
  lists: 'got.lists',
  settings: 'got.settings',
  comments: 'got.comments',
  profiles: 'got.profiles',
  activeProfile: 'got.activeProfile',
  prefs: 'got.prefs',
  overrides: 'got.overrides',
  customTags: 'got.customTags',
  seenFiles: 'got.seenFiles',
} as const;

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* אחסון מלא/חסום — מתעלמים */
  }
}

function ns(base: string, profileId: string): string {
  return `${base}::${profileId}`;
}

// ─── פרופילים (משתמשים מרובים למשפחה) ───
export interface Profile {
  id: string;
  name: string;
  avatar: string; // אימוג׳י
  color: string; // צבע accent
  kids: boolean;
  pin?: string; // 4 ספרות — הגנת מסך בלבד, לא אבטחה אמיתית (הכול מקומי בדפדפן)
  createdAt: number;
}

const DEFAULT_PROFILE: Profile = {
  id: 'default', name: 'הצופה הראשי', avatar: '👑', color: '#c9a84c', kids: false, createdAt: Date.now(),
};

/** מעביר נתונים ישנים (מלפני מערכת הפרופילים) לפרופיל ברירת המחדל, פעם אחת */
function migrateLegacyIfNeeded() {
  const legacyWatched = localStorage.getItem(KEYS.watched);
  const alreadyNamespaced = localStorage.getItem(ns(KEYS.watched, 'default'));
  if (legacyWatched && !alreadyNamespaced) {
    write(ns(KEYS.watched, 'default'), read(KEYS.watched, []));
    write(ns(KEYS.favorites, 'default'), read(KEYS.favorites, []));
    write(ns(KEYS.progress, 'default'), read(KEYS.progress, {}));
    write(ns(KEYS.ratings, 'default'), read(KEYS.ratings, {}));
  }
}

export function getProfiles(): Profile[] {
  const list = read<Profile[]>(KEYS.profiles, []);
  if (list.length === 0) {
    migrateLegacyIfNeeded();
    write(KEYS.profiles, [DEFAULT_PROFILE]);
    return [DEFAULT_PROFILE];
  }
  return list;
}

export function saveProfiles(list: Profile[]) {
  write(KEYS.profiles, list);
}

export function getActiveProfileId(): string {
  const id = read<string | null>(KEYS.activeProfile, null);
  const profiles = getProfiles();
  if (id && profiles.some((p) => p.id === id)) return id;
  return profiles[0].id;
}

export function setActiveProfileId(id: string) {
  write(KEYS.activeProfile, id);
}

export function createProfile(name: string, avatar: string, color: string, kids = false): Profile {
  const profiles = getProfiles();
  const p: Profile = { id: `p${Date.now().toString(36)}`, name, avatar, color, kids, createdAt: Date.now() };
  saveProfiles([...profiles, p]);
  return p;
}

export function updateProfile(id: string, patch: Partial<Omit<Profile, 'id'>>): Profile[] {
  const list = getProfiles().map((p) => (p.id === id ? { ...p, ...patch } : p));
  saveProfiles(list);
  return list;
}

export function deleteProfile(id: string): Profile[] {
  const list = getProfiles().filter((p) => p.id !== id);
  const final = list.length > 0 ? list : [DEFAULT_PROFILE];
  saveProfiles(final);
  return final;
}

// ─── התקדמות צפייה (per-profile) ───
export function getAllProgress(profileId: string): Record<string, WatchProgress> {
  return read(ns(KEYS.progress, profileId), {});
}

export function getProgress(profileId: string, key: string): WatchProgress | undefined {
  return getAllProgress(profileId)[key];
}

export function saveProgress(profileId: string, key: string, time: number, duration: number) {
  const all = getAllProgress(profileId);
  all[key] = { time, duration, updatedAt: Date.now() };
  write(ns(KEYS.progress, profileId), all);
}

export function clearProgress(profileId: string, key: string) {
  const all = getAllProgress(profileId);
  delete all[key];
  write(ns(KEYS.progress, profileId), all);
}

// ─── נצפה (per-profile) ───
export function getWatched(profileId: string): string[] {
  return read(ns(KEYS.watched, profileId), []);
}

export function setWatched(profileId: string, key: string, watched: boolean): string[] {
  const set = new Set(getWatched(profileId));
  watched ? set.add(key) : set.delete(key);
  const list = [...set];
  write(ns(KEYS.watched, profileId), list);
  return list;
}

// ─── מועדפים (per-profile) ───
export function getFavorites(profileId: string): string[] {
  return read(ns(KEYS.favorites, profileId), []);
}

export function setFavorite(profileId: string, key: string, fav: boolean): string[] {
  const set = new Set(getFavorites(profileId));
  fav ? set.add(key) : set.delete(key);
  const list = [...set];
  write(ns(KEYS.favorites, profileId), list);
  return list;
}

// ─── רשימת צפייה — Watchlist (per-profile) ───
export function getWatchlist(profileId: string): string[] {
  return read(ns(KEYS.watchlist, profileId), []);
}

export function setInWatchlist(profileId: string, key: string, on: boolean): string[] {
  const set = new Set(getWatchlist(profileId));
  on ? set.add(key) : set.delete(key);
  const list = [...set];
  write(ns(KEYS.watchlist, profileId), list);
  return list;
}

// ─── דירוגי משתמש 1–5 כוכבים (per-profile) ───
export function getRatings(profileId: string): Record<string, number> {
  return read(ns(KEYS.ratings, profileId), {});
}

export function setRating(profileId: string, key: string, stars: number): Record<string, number> {
  const all = getRatings(profileId);
  if (stars <= 0) delete all[key];
  else all[key] = stars;
  write(ns(KEYS.ratings, profileId), all);
  return { ...all };
}

// ─── סימניות בתוך הסרטון (per-profile) ───
export interface Bookmark {
  time: number;
  label: string;
  ts: number;
}

export function getBookmarks(profileId: string): Record<string, Bookmark[]> {
  return read(ns(KEYS.bookmarks, profileId), {});
}

export function addBookmark(profileId: string, epKey: string, time: number, label: string): Record<string, Bookmark[]> {
  const all = getBookmarks(profileId);
  const list = [...(all[epKey] ?? []), { time, label, ts: Date.now() }].sort((a, b) => a.time - b.time);
  all[epKey] = list;
  write(ns(KEYS.bookmarks, profileId), all);
  return { ...all };
}

export function removeBookmark(profileId: string, epKey: string, ts: number): Record<string, Bookmark[]> {
  const all = getBookmarks(profileId);
  all[epKey] = (all[epKey] ?? []).filter((b) => b.ts !== ts);
  write(ns(KEYS.bookmarks, profileId), all);
  return { ...all };
}

// ─── יומן צפייה — לחישוב "הכי נצפה השבוע" והמלצות (per-profile) ───
export interface ViewEvent { key: string; ts: number }

export function getViewLog(profileId: string): ViewEvent[] {
  return read(ns(KEYS.viewLog, profileId), []);
}

export function logView(profileId: string, key: string) {
  const log = getViewLog(profileId);
  log.push({ key, ts: Date.now() });
  write(ns(KEYS.viewLog, profileId), log.slice(-500));
}

// ─── רשימות אישיות מותאמות (per-profile) ───
export interface PersonalList {
  id: string;
  name: string;
  keys: string[];
  createdAt: number;
}

export function getLists(profileId: string): PersonalList[] {
  return read(ns(KEYS.lists, profileId), []);
}

export function createList(profileId: string, name: string): PersonalList[] {
  const lists = getLists(profileId);
  const l: PersonalList = { id: `l${Date.now().toString(36)}`, name, keys: [], createdAt: Date.now() };
  const next = [...lists, l];
  write(ns(KEYS.lists, profileId), next);
  return next;
}

export function deleteList(profileId: string, listId: string): PersonalList[] {
  const next = getLists(profileId).filter((l) => l.id !== listId);
  write(ns(KEYS.lists, profileId), next);
  return next;
}

export function toggleInList(profileId: string, listId: string, epKey: string): PersonalList[] {
  const next = getLists(profileId).map((l) => {
    if (l.id !== listId) return l;
    const has = l.keys.includes(epKey);
    return { ...l, keys: has ? l.keys.filter((k) => k !== epKey) : [...l.keys, epKey] };
  });
  write(ns(KEYS.lists, profileId), next);
  return next;
}

// ─── הישגים (per-profile) ───
export function getAchievements(profileId: string): Record<string, number> {
  return read(ns(KEYS.achievements, profileId), {});
}

export function unlockAchievement(profileId: string, id: string): Record<string, number> {
  const all = getAchievements(profileId);
  if (!all[id]) all[id] = Date.now();
  write(ns(KEYS.achievements, profileId), all);
  return { ...all };
}

// ─── הגדרות Drive (גלובלי) ───
export function getSettings(): DriveSettings {
  return read(KEYS.settings, { folderUrl: '', apiKey: '' });
}

export function saveSettings(s: DriveSettings) {
  write(KEYS.settings, s);
}

// ─── תגובות (גלובלי — קהילתי, מיוחס לשם) ───
export interface EpisodeComment {
  name: string;
  text: string;
  ts: number;
  likes?: number;
}

export function getComments(): Record<string, EpisodeComment[]> {
  return read(KEYS.comments, {});
}

export function addComment(key: string, c: EpisodeComment): Record<string, EpisodeComment[]> {
  const all = getComments();
  all[key] = [...(all[key] ?? []), c];
  write(KEYS.comments, all);
  return { ...all };
}

export function deleteComment(key: string, ts: number): Record<string, EpisodeComment[]> {
  const all = getComments();
  all[key] = (all[key] ?? []).filter((c) => c.ts !== ts);
  write(KEYS.comments, all);
  return { ...all };
}

export function likeComment(key: string, ts: number): Record<string, EpisodeComment[]> {
  const all = getComments();
  all[key] = (all[key] ?? []).map((c) => (c.ts === ts ? { ...c, likes: (c.likes ?? 0) + 1 } : c));
  write(KEYS.comments, all);
  return { ...all };
}

// ─── עריכות מטא-דאטה מותאמות אישית (גלובלי — פאנל ניהול ספרייה) ───
export interface EpisodeOverride {
  title?: string;
  synopsis?: string;
  cover?: string; // data URL
}

export function getOverrides(): Record<string, EpisodeOverride> {
  return read(KEYS.overrides, {});
}

export function setOverride(key: string, patch: EpisodeOverride): Record<string, EpisodeOverride> {
  const all = getOverrides();
  all[key] = { ...all[key], ...patch };
  write(KEYS.overrides, all);
  return { ...all };
}

export function clearOverride(key: string): Record<string, EpisodeOverride> {
  const all = getOverrides();
  delete all[key];
  write(KEYS.overrides, all);
  return { ...all };
}

// ─── תגיות מותאמות אישית נוספות (גלובלי) ───
export function getCustomTags(): Record<string, string[]> {
  return read(KEYS.customTags, {});
}

export function setCustomTags(key: string, tags: string[]): Record<string, string[]> {
  const all = getCustomTags();
  all[key] = tags;
  write(KEYS.customTags, all);
  return { ...all };
}

// ─── זיהוי תוכן חדש (השוואה לסריקה קודמת, להתראה מקומית) ───
export function getSeenFileKeys(): string[] {
  return read(KEYS.seenFiles, []);
}

export function setSeenFileKeys(keys: string[]) {
  write(KEYS.seenFiles, keys);
}

// ─── העדפות עיצוב ואפקטים (גלובלי) ───
export interface UiPrefs {
  theme: 'dark' | 'light';
  snow: boolean;
  cursor: boolean;
  music: boolean;
  accent: 'gold' | 'stark' | 'lannister' | 'targaryen' | 'tyrell';
  autoNext: boolean; // מעבר אוטומטי לפרק הבא (עם ספירה לאחור)
  autoResume: boolean; // המשך צפייה אוטומטי בלי שאלה
}

export const DEFAULT_PREFS: UiPrefs = {
  theme: 'dark', snow: true, cursor: true, music: false, accent: 'gold', autoNext: true, autoResume: false,
};

export function getPrefs(): UiPrefs {
  return { ...DEFAULT_PREFS, ...read<Partial<UiPrefs>>(KEYS.prefs, {}) };
}

export function savePrefs(p: UiPrefs) {
  write(KEYS.prefs, p);
}

// ─── גיבוי מלא / ייבוא (כל המידע המקומי, קובץ JSON יחיד) ───
export function exportBackup(): string {
  const data: Record<string, unknown> = {};
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k && k.startsWith('got.')) {
      try { data[k] = JSON.parse(localStorage.getItem(k)!); } catch { /* מתעלמים משורה פגומה */ }
    }
  }
  return JSON.stringify({ exportedAt: new Date().toISOString(), data }, null, 2);
}

export function importBackup(json: string): void {
  const parsed = JSON.parse(json) as { data?: Record<string, unknown> };
  if (!parsed.data) throw new Error('קובץ הגיבוי אינו תקין');
  for (const [k, v] of Object.entries(parsed.data)) {
    if (k.startsWith('got.')) write(k, v);
  }
}
