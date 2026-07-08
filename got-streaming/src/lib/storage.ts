/**
 * אחסון מקומי: התקדמות צפייה, "נצפה", מועדפים והגדרות Drive.
 */
import type { DriveSettings, WatchProgress } from '../types';

const KEYS = {
  progress: 'got.progress',
  watched: 'got.watched',
  favorites: 'got.favorites',
  settings: 'got.settings',
  ratings: 'got.ratings',
  comments: 'got.comments',
  profile: 'got.profile',
  prefs: 'got.prefs',
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

// ─── התקדמות צפייה ───
export function getAllProgress(): Record<string, WatchProgress> {
  return read(KEYS.progress, {});
}

export function getProgress(key: string): WatchProgress | undefined {
  return getAllProgress()[key];
}

export function saveProgress(key: string, time: number, duration: number) {
  const all = getAllProgress();
  all[key] = { time, duration, updatedAt: Date.now() };
  write(KEYS.progress, all);
}

export function clearProgress(key: string) {
  const all = getAllProgress();
  delete all[key];
  write(KEYS.progress, all);
}

// ─── נצפה ───
export function getWatched(): string[] {
  return read(KEYS.watched, []);
}

export function setWatched(key: string, watched: boolean): string[] {
  const set = new Set(getWatched());
  watched ? set.add(key) : set.delete(key);
  const list = [...set];
  write(KEYS.watched, list);
  return list;
}

// ─── מועדפים ───
export function getFavorites(): string[] {
  return read(KEYS.favorites, []);
}

export function setFavorite(key: string, fav: boolean): string[] {
  const set = new Set(getFavorites());
  fav ? set.add(key) : set.delete(key);
  const list = [...set];
  write(KEYS.favorites, list);
  return list;
}

// ─── הגדרות Drive ───
export function getSettings(): DriveSettings {
  return read(KEYS.settings, { folderUrl: '', apiKey: '' });
}

export function saveSettings(s: DriveSettings) {
  write(KEYS.settings, s);
}

// ─── דירוגי משתמש (1–5 כוכבים) ───
export function getRatings(): Record<string, number> {
  return read(KEYS.ratings, {});
}

export function setRating(key: string, stars: number): Record<string, number> {
  const all = getRatings();
  if (stars <= 0) delete all[key];
  else all[key] = stars;
  write(KEYS.ratings, all);
  return { ...all };
}

// ─── תגובות ───
export interface EpisodeComment {
  name: string;
  text: string;
  ts: number;
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

// ─── פרופיל משתמש מקומי ───
export interface Profile {
  name: string;
}

export function getProfile(): Profile | null {
  return read<Profile | null>(KEYS.profile, null);
}

export function saveProfile(p: Profile | null) {
  write(KEYS.profile, p);
}

// ─── העדפות עיצוב ואפקטים ───
export interface UiPrefs {
  theme: 'dark' | 'light';
  snow: boolean;
  cursor: boolean;
  music: boolean;
}

export const DEFAULT_PREFS: UiPrefs = { theme: 'dark', snow: true, cursor: true, music: false };

export function getPrefs(): UiPrefs {
  return { ...DEFAULT_PREFS, ...read<Partial<UiPrefs>>(KEYS.prefs, {}) };
}

export function savePrefs(p: UiPrefs) {
  write(KEYS.prefs, p);
}
