/**
 * אחסון מקומי: התקדמות צפייה, "נצפה", מועדפים והגדרות Drive.
 */
import type { DriveSettings, WatchProgress } from '../types';

const KEYS = {
  progress: 'got.progress',
  watched: 'got.watched',
  favorites: 'got.favorites',
  settings: 'got.settings',
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
