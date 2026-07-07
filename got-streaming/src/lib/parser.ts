/**
 * זיהוי עונה ופרק מתוך שמות קבצים — תומך במגוון רחב של דפוסים:
 * S01E01, s1.e1, 1x01, "עונה 1 פרק 3", "Season 2 Episode 5", "פרק 7" (עם עונה מתיקיית האב) ועוד.
 */

export interface ParsedEpisode {
  season: number;
  episode: number;
}

const PATTERNS: RegExp[] = [
  /s(\d{1,2})[\s._-]*e(\d{1,3})/i, // S01E01, s1.e1, S01_E01
  /(\d{1,2})\s*x\s*(\d{1,3})/i, // 1x01
  /עונה\s*(\d{1,2})[\s\S]{0,12}?פרק\s*(\d{1,3})/, // עונה 1 פרק 3
  /season[\s._-]*(\d{1,2})[\s\S]{0,15}?(?:episode|ep)[\s._-]*(\d{1,3})/i,
  /\b(\d{1,2})(\d{2})\b(?=[\s._-]|$)/, // 101, 205 (עונה+פרק מחוברים)
];

const EPISODE_ONLY: RegExp[] = [
  /פרק\s*(\d{1,3})/,
  /(?:episode|ep)[\s._-]*(\d{1,3})/i,
  /\be(\d{1,3})\b/i,
  /\b(\d{1,3})\b/,
];

const SEASON_HINT: RegExp[] = [
  /s(?:eason)?[\s._-]*(\d{1,2})/i,
  /עונה\s*(\d{1,2})/,
];

/** מחלץ מספר עונה משם תיקייה ("Season 3", "עונה 3", "S03") */
export function parseSeasonHint(folderName: string): number | null {
  for (const re of SEASON_HINT) {
    const m = folderName.match(re);
    if (m) {
      const s = parseInt(m[1], 10);
      if (s >= 1 && s <= 30) return s;
    }
  }
  return null;
}

/** מנתח שם קובץ; seasonHint מגיע מהתיקייה המכילה אם קיים */
export function parseEpisodeFileName(fileName: string, seasonHint?: number | null): ParsedEpisode | null {
  const name = fileName.replace(/\.[a-z0-9]{2,4}$/i, ''); // הסרת סיומת

  for (const re of PATTERNS) {
    const m = name.match(re);
    if (m) {
      const season = parseInt(m[1], 10);
      const episode = parseInt(m[2], 10);
      if (season >= 1 && season <= 30 && episode >= 1 && episode <= 99) {
        return { season, episode };
      }
    }
  }

  // אין דפוס עונה+פרק מלא — ננסה פרק בלבד בעזרת רמז העונה מהתיקייה
  if (seasonHint) {
    for (const re of EPISODE_ONLY) {
      const m = name.match(re);
      if (m) {
        const episode = parseInt(m[1], 10);
        if (episode >= 1 && episode <= 99) return { season: seasonHint, episode };
      }
    }
  }

  return null;
}

/** מזהה תווית איכות משם הקובץ (1080p / 720p / 4K...) */
export function parseQualityLabel(fileName: string): string {
  const m = fileName.match(/\b(2160p|4k|1080p|720p|480p)\b/i);
  if (!m) return 'מקור';
  const q = m[1].toLowerCase();
  return q === '4k' ? '2160p' : q;
}

export function episodeKey(season: number, episode: number): string {
  return `s${season}e${episode}`;
}
