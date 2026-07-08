/**
 * מצב "תיקייה מקומית" — ניגון פרקים ישירות מקבצים על המחשב, בלי Google Drive ובלי מפתח.
 *
 * שתי דרכים:
 *  1. File System Access API (Chrome/Edge) — בחירת תיקייה + שמירת ההרשאה ל-IndexedDB,
 *     כך שהאתר מתחבר מחדש אוטומטית בכל פתיחה.
 *  2. גיבוי אוניברסלי (Firefox/Safari) — <input type="file" webkitdirectory>.
 */
import type { VideoSource } from '../types';
import { episodeKey, parseEpisodeFileName, parseQualityLabel, parseSeasonHint } from './parser';

const VIDEO_EXT = /\.(mp4|m4v|webm|mov|ogg|ogv|mkv|avi)$/i;
/** פורמטים שהדפדפן מנגן באופן אמין */
const BROWSER_FRIENDLY = /\.(mp4|m4v|webm|ogg|ogv|mov)$/i;

export interface LocalScanResult {
  sourcesByKey: Map<string, VideoSource[]>;
  total: number;
  matched: number;
  unsupported: number; // קבצים שזוהו אך הדפדפן כנראה לא ינגן (mkv/avi)
}

export function supportsDirectoryPicker(): boolean {
  return typeof (window as unknown as { showDirectoryPicker?: unknown }).showDirectoryPicker === 'function';
}

interface ScannedFile {
  file: File;
  parentFolder: string;
}

function toSources(files: ScannedFile[]): LocalScanResult {
  const map = new Map<string, VideoSource[]>();
  let matched = 0;
  let unsupported = 0;

  for (const { file, parentFolder } of files) {
    const parsed = parseEpisodeFileName(file.name, parentFolder ? parseSeasonHint(parentFolder) : null);
    if (!parsed) continue;
    const key = episodeKey(parsed.season, parsed.episode);
    const url = URL.createObjectURL(file);
    if (!BROWSER_FRIENDLY.test(file.name)) unsupported++;
    const src: VideoSource = {
      id: `local-${key}-${matched}`,
      label: parseQualityLabel(file.name),
      streamUrl: url,
      downloadUrl: url,
      size: file.size,
      fileName: file.name,
    };
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(src);
    matched++;
  }
  return { sourcesByKey: map, total: files.length, matched, unsupported };
}

/** גיבוי: סריקת FileList מ-<input webkitdirectory> */
export function scanFileList(fileList: FileList | File[]): LocalScanResult {
  const scanned: ScannedFile[] = [];
  for (const file of Array.from(fileList)) {
    if (!VIDEO_EXT.test(file.name)) continue;
    const rel = (file as File & { webkitRelativePath?: string }).webkitRelativePath ?? '';
    const parts = rel.split('/').filter(Boolean);
    const parentFolder = parts.length > 1 ? parts[parts.length - 2] : '';
    scanned.push({ file, parentFolder });
  }
  return toSources(scanned);
}

/** סריקה רקורסיבית של FileSystemDirectoryHandle (עד עומק 4) */
async function collectFromDirectory(
  dir: FileSystemDirectoryHandle,
  depth = 0,
  parentName = '',
): Promise<ScannedFile[]> {
  if (depth > 4) return [];
  const out: ScannedFile[] = [];
  // @ts-expect-error — values() קיים ב-API אך לא תמיד בטיפוסים
  for await (const entry of dir.values()) {
    if (entry.kind === 'file') {
      if (!VIDEO_EXT.test(entry.name)) continue;
      const file = await (entry as FileSystemFileHandle).getFile();
      out.push({ file, parentFolder: parentName });
    } else if (entry.kind === 'directory') {
      const nested = await collectFromDirectory(entry as FileSystemDirectoryHandle, depth + 1, entry.name);
      out.push(...nested);
    }
  }
  return out;
}

export async function scanDirectoryHandle(dir: FileSystemDirectoryHandle): Promise<LocalScanResult> {
  const files = await collectFromDirectory(dir, 0, dir.name);
  return toSources(files);
}

/**
 * פותח את חלון בחירת התיקייה.
 * מחזיר handle בהצלחה, null אם המשתמש ביטל, וזורק אם ה-API חסום
 * (למשל בתוך iframe מבודד) — כדי שאפשר יהיה ליפול חזרה ל-input רגיל.
 */
export async function pickDirectory(): Promise<FileSystemDirectoryHandle | null> {
  if (!supportsDirectoryPicker()) throw new Error('unsupported');
  const picker = (window as unknown as {
    showDirectoryPicker: (opts?: unknown) => Promise<FileSystemDirectoryHandle>;
  }).showDirectoryPicker;
  try {
    return await picker({ id: 'got-library', mode: 'read' });
  } catch (e) {
    if (e instanceof DOMException && e.name === 'AbortError') return null; // ביטול משתמש
    throw e; // חסום/שגיאה אחרת → נטפל בקורא
  }
}

// ─── שמירת ההרשאה לתיקייה ב-IndexedDB (לחיבור אוטומטי חוזר) ───
const DB_NAME = 'got-local';
const STORE = 'handles';
const HANDLE_KEY = 'library-dir';

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => req.result.createObjectStore(STORE);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function saveDirHandle(handle: FileSystemDirectoryHandle): Promise<void> {
  try {
    const db = await openDb();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE, 'readwrite');
      tx.objectStore(STORE).put(handle, HANDLE_KEY);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
    db.close();
  } catch {
    /* IndexedDB חסום — נמשיך בלי שמירה */
  }
}

export async function loadDirHandle(): Promise<FileSystemDirectoryHandle | null> {
  try {
    const db = await openDb();
    const handle = await new Promise<FileSystemDirectoryHandle | null>((resolve, reject) => {
      const tx = db.transaction(STORE, 'readonly');
      const req = tx.objectStore(STORE).get(HANDLE_KEY);
      req.onsuccess = () => resolve((req.result as FileSystemDirectoryHandle) ?? null);
      req.onerror = () => reject(req.error);
    });
    db.close();
    return handle;
  } catch {
    return null;
  }
}

export async function clearDirHandle(): Promise<void> {
  try {
    const db = await openDb();
    await new Promise<void>((resolve) => {
      const tx = db.transaction(STORE, 'readwrite');
      tx.objectStore(STORE).delete(HANDLE_KEY);
      tx.oncomplete = () => resolve();
      tx.onerror = () => resolve();
    });
    db.close();
  } catch {
    /* מתעלמים */
  }
}

/** בודק/מבקש הרשאת קריאה על תיקייה שמורה */
export async function ensurePermission(handle: FileSystemDirectoryHandle): Promise<boolean> {
  const h = handle as FileSystemDirectoryHandle & {
    queryPermission?: (o: unknown) => Promise<PermissionState>;
    requestPermission?: (o: unknown) => Promise<PermissionState>;
  };
  const opts = { mode: 'read' };
  try {
    if (h.queryPermission && (await h.queryPermission(opts)) === 'granted') return true;
    if (h.requestPermission && (await h.requestPermission(opts)) === 'granted') return true;
  } catch {
    /* לא נתמך */
  }
  return false;
}
