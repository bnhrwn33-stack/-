/**
 * שכבת Google Drive — קריאת תיקייה ציבורית (משותפת עם "כל מי שיש לו קישור")
 * באמצעות Google Drive API v3 עם מפתח API.
 */

export interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  size?: string;
  videoMediaMetadata?: { durationMillis?: string; width?: number; height?: number };
  thumbnailLink?: string;
  parentFolderName?: string;
}

const API = 'https://www.googleapis.com/drive/v3/files';
const FIELDS = 'nextPageToken,files(id,name,mimeType,size,videoMediaMetadata(durationMillis,width,height),thumbnailLink)';
const FOLDER_MIME = 'application/vnd.google-apps.folder';

/** מחלץ מזהה תיקייה מכל צורת קישור של Google Drive */
export function extractFolderId(url: string): string | null {
  const trimmed = url.trim();
  const patterns = [
    /\/folders\/([a-zA-Z0-9_-]{10,})/,
    /[?&]id=([a-zA-Z0-9_-]{10,})/,
    /^([a-zA-Z0-9_-]{25,})$/, // מזהה גולמי
  ];
  for (const re of patterns) {
    const m = trimmed.match(re);
    if (m) return m[1];
  }
  return null;
}

async function listChildren(folderId: string, apiKey: string): Promise<DriveFile[]> {
  const out: DriveFile[] = [];
  let pageToken: string | undefined;
  do {
    const params = new URLSearchParams({
      q: `'${folderId}' in parents and trashed=false`,
      fields: FIELDS,
      pageSize: '1000',
      key: apiKey,
    });
    if (pageToken) params.set('pageToken', pageToken);
    const res = await fetch(`${API}?${params}`);
    if (!res.ok) {
      const body = await res.text().catch(() => '');
      if (res.status === 403 || res.status === 400) {
        throw new Error('מפתח ה-API נדחה או שהתיקייה אינה משותפת כ"כל מי שיש לו קישור". ' + body.slice(0, 200));
      }
      if (res.status === 404) throw new Error('התיקייה לא נמצאה — ודא שהקישור תקין ושהתיקייה משותפת.');
      throw new Error(`שגיאת Drive (${res.status})`);
    }
    const data = await res.json();
    out.push(...(data.files ?? []));
    pageToken = data.nextPageToken;
  } while (pageToken);
  return out;
}

/** סורק תיקייה רקורסיבית (עד עומק 3) ומחזיר את כל קובצי הווידאו, עם שם תיקיית האב כרמז לעונה */
export async function scanDriveFolder(folderId: string, apiKey: string, depth = 0, parentName = ''): Promise<DriveFile[]> {
  if (depth > 3) return [];
  const children = await listChildren(folderId, apiKey);
  const videos: DriveFile[] = [];
  const subFolders = children.filter((f) => f.mimeType === FOLDER_MIME);

  for (const f of children) {
    if (f.mimeType.startsWith('video/')) {
      videos.push({ ...f, parentFolderName: parentName });
    }
  }
  const nested = await Promise.all(
    subFolders.map((sub) => scanDriveFolder(sub.id, apiKey, depth + 1, sub.name)),
  );
  for (const list of nested) videos.push(...list);
  return videos;
}

/** URL להזרמה ישירה (תומך ב-Range → ניתן לדלג בנגן) */
export function streamUrl(fileId: string, apiKey: string): string {
  return `${API}/${fileId}?alt=media&key=${apiKey}`;
}

export function downloadUrl(fileId: string): string {
  return `https://drive.google.com/uc?export=download&id=${fileId}`;
}

/** נגן ה-iframe המובנה של Drive — גיבוי כשההזרמה הישירה נכשלת */
export function previewUrl(fileId: string): string {
  return `https://drive.google.com/file/d/${fileId}/preview`;
}

export function shareUrl(fileId: string): string {
  return `https://drive.google.com/file/d/${fileId}/view`;
}
