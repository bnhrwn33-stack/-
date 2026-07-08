/**
 * תיוג אוטומטי (rule-based, ללא AI חיצוני): מפיק תגיות, ז'אנר ומשך משוער
 * לכל פרק מתוך הטקסט הקיים במטא-דאטה — כדי לאפשר חיפוש וסינון מתקדם
 * בלי לשלוח נתונים לשום שרת חיצוני.
 */
import type { EpisodeMeta } from '../lib/metadata';

interface TagRule {
  tag: string;
  icon: string;
  keywords: RegExp;
}

const TAG_RULES: TagRule[] = [
  { tag: 'קרב', icon: '⚔️', keywords: /קרב|נלחם|צבא|מלחמה|נערך קרב|כובש|מתקיף/ },
  { tag: 'חתונה', icon: '💍', keywords: /חתונ/ },
  { tag: 'דרקונים', icon: '🐉', keywords: /דרקון|דרגון|ויסריון|ראייגל/ },
  { tag: 'מוות', icon: '💀', keywords: /נהרג|מת|רצח|הוצא|נופל|מוות|קורבן|הקריב/ },
  { tag: 'פוליטיקה', icon: '👑', keywords: /כתר|כס|מלך|מלכה|יד המלך|בירה|שלטון|מועצה/ },
  { tag: 'בגידה', icon: '🗡️', keywords: /בגד|בוגד|מזימה|רימ/ },
  { tag: 'מסע', icon: '🧭', keywords: /מסע|יוצא|מפליג|חוצה|נמלט|מגיע ל/ },
  { tag: 'קסם', icon: '✨', keywords: /קסם|כישוף|אלים|נבואה|צל|עורב|חלום/ },
  { tag: 'החומה', icon: '🧊', keywords: /חומה|משמר הלילה|מהלכים לבנים|מלך הלילה|הארדהום|מתים/ },
];

const SEASON_GENRES: Record<number, string[]> = {
  1: ['דרמה', 'פנטזיה', 'פוליטי'],
  2: ['דרמה', 'מלחמה', 'פוליטי'],
  3: ['דרמה', 'טרגדיה', 'פוליטי'],
  4: ['דרמה', 'מלחמה', 'משפט'],
  5: ['דרמה', 'פוליטי', 'אימה'],
  6: ['דרמה', 'פנטזיה', 'נקמה'],
  7: ['דרמה', 'מלחמה', 'אקשן'],
  8: ['דרמה', 'אפי', 'אקשן'],
};

/** משך משוער בדקות לכל פרק (מבוסס משכי השידור הידועים של הסדרה) */
const DURATIONS: number[][] = [
  [62, 56, 58, 56, 55, 53, 58, 57, 59, 53],
  [53, 55, 58, 53, 56, 53, 58, 59, 58, 62],
  [52, 56, 51, 53, 55, 53, 60, 60, 58, 62],
  [55, 56, 58, 50, 52, 51, 59, 60, 54, 63],
  [53, 55, 54, 52, 55, 61, 60, 62, 59, 65],
  [59, 55, 58, 62, 59, 52, 60, 63, 61, 68],
  [59, 65, 63, 65, 60, 61, 81],
  [61, 58, 82, 78, 80, 81],
];

export function episodeDuration(season: number, episode: number): number {
  return DURATIONS[season - 1]?.[episode - 1] ?? 58;
}

export function durationBucket(minutes: number): 'short' | 'medium' | 'long' {
  if (minutes < 55) return 'short';
  if (minutes < 65) return 'medium';
  return 'long';
}

export const DURATION_LABELS: Record<'short' | 'medium' | 'long', string> = {
  short: 'קצר (עד 55 דק׳)',
  medium: 'בינוני (55–65 דק׳)',
  long: 'ארוך (65+ דק׳)',
};

export function seasonGenres(season: number): string[] {
  return SEASON_GENRES[season] ?? [];
}

export const ALL_GENRES = Array.from(new Set(Object.values(SEASON_GENRES).flat()));
export const ALL_TAGS = TAG_RULES.map((r) => r.tag);

/** מפיק תגיות אוטומטית מתוך התקציר והכותרת — ללא צורך בתיוג ידני */
export function deriveTags(ep: Pick<EpisodeMeta, 'titleHe' | 'synopsis'>): string[] {
  const text = `${ep.titleHe} ${ep.synopsis}`;
  const found = TAG_RULES.filter((r) => r.keywords.test(text)).map((r) => r.tag);
  return found.length > 0 ? found : ['דרמה'];
}

export function tagIcon(tag: string): string {
  return TAG_RULES.find((r) => r.tag === tag)?.icon ?? '🏷️';
}

/**
 * תאריכי שידור מקוריים (היסטוריים, פומביים) — לשימוש בלוח השנה בלבד.
 * עונות שודרו שבועית; תאריך פרק 1 של כל עונה מדויק, השאר מחושבים +7 ימים.
 */
const SEASON_PREMIERES: Record<number, string> = {
  1: '2011-04-17', 2: '2012-04-01', 3: '2013-03-31', 4: '2014-04-06',
  5: '2015-04-12', 6: '2016-04-24', 7: '2017-07-16', 8: '2019-04-14',
};

export function episodeAirDate(season: number, episode: number): Date {
  const base = new Date(SEASON_PREMIERES[season] ?? '2011-04-17');
  base.setDate(base.getDate() + (episode - 1) * 7);
  return base;
}
