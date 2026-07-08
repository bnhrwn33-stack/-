/** הישגים ותגי משתמש — מחושבים מקומית מתוך הפעילות, בלי שום שרת */

export interface Achievement {
  id: string;
  icon: string;
  title: string;
  desc: string;
  check: (ctx: AchievementCtx) => boolean;
}

export interface AchievementCtx {
  watchedCount: number;
  totalEpisodes: number;
  seasonsCompleted: number;
  favoritesCount: number;
  ratingsCount: number;
  commentsCount: number;
  bookmarksCount: number;
  nightOwl: boolean; // צפה בין 00:00–05:00
  bingeStreak: number; // פרקים רצופים ביום אחד
}

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'first-watch', icon: '🎬', title: 'הצעד הראשון', desc: 'צפית בפרק הראשון שלך', check: (c) => c.watchedCount >= 1 },
  { id: 'season-1', icon: '❄️', title: 'החורף הגיע', desc: 'סיימת עונה שלמה אחת', check: (c) => c.seasonsCompleted >= 1 },
  { id: 'season-4', icon: '🐺', title: 'לורד הצפון', desc: 'סיימת 4 עונות', check: (c) => c.seasonsCompleted >= 4 },
  { id: 'season-all', icon: '👑', title: 'מלך שבע הממלכות', desc: 'סיימת את כל שמונה העונות', check: (c) => c.seasonsCompleted >= 8 },
  { id: 'watched-25', icon: '📺', title: 'צופה מסור', desc: 'צפית ב-25 פרקים', check: (c) => c.watchedCount >= 25 },
  { id: 'watched-all', icon: '🏆', title: 'מייסטר של הציטדל', desc: 'צפית בכל 73 הפרקים', check: (c) => c.watchedCount >= c.totalEpisodes },
  { id: 'favorites-5', icon: '❤️', title: 'אספן', desc: 'סימנת 5 פרקים כמועדפים', check: (c) => c.favoritesCount >= 5 },
  { id: 'critic', icon: '⭐', title: 'המבקר', desc: 'דירגת 10 פרקים', check: (c) => c.ratingsCount >= 10 },
  { id: 'commenter', icon: '💬', title: 'קול בקונקלווה', desc: 'השארת תגובה ראשונה', check: (c) => c.commentsCount >= 1 },
  { id: 'bookmarker', icon: '🔖', title: 'שומר הסימנים', desc: 'שמרת 5 סימניות בתוך פרקים', check: (c) => c.bookmarksCount >= 5 },
  { id: 'night-owl', icon: '🌙', title: 'שומר הלילה', desc: 'צפית בין חצות לחמש בבוקר', check: (c) => c.nightOwl },
  { id: 'binge-5', icon: '🔥', title: 'מרתון בינג׳', desc: '5 פרקים ביום אחד', check: (c) => c.bingeStreak >= 5 },
];

export function evaluateAchievements(ctx: AchievementCtx, alreadyUnlocked: Record<string, number>): Achievement[] {
  return ACHIEVEMENTS.filter((a) => !alreadyUnlocked[a.id] && a.check(ctx));
}

/** תג משתמש דינמי לפי מספר פרקים שנצפו — מוצג ליד הפרופיל */
export function userTitle(watchedCount: number): string {
  if (watchedCount >= 73) return 'מלך שבע הממלכות';
  if (watchedCount >= 50) return 'יד המלך';
  if (watchedCount >= 25) return 'לורד/ליידי';
  if (watchedCount >= 10) return 'אביר';
  if (watchedCount >= 1) return 'טירון';
  return 'תייר בווסטרוס';
}
