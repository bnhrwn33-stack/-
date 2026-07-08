/**
 * הגדרות ברירת מחדל של הספרייה.
 * תיקיית ה-Drive של העונות והפרקים כבר מוגדרת כאן — נדרש רק מפתח Google API
 * (ראה README) כדי שהאתר יסרוק ויחבר את הכול אוטומטית.
 */

export const DEFAULT_DRIVE_FOLDER_URL =
  'https://drive.google.com/drive/folders/1hbV7JmKt0HlgKgpGQHFVrk-4o2fE_irw';

/**
 * אופציונלי: הדבק כאן מפתח API כדי שהאתר יתחבר אוטומטית בכל פתיחה,
 * בלי להזין אותו בחלון ההגדרות. (האתר רץ מקומית בלבד — המפתח לא נחשף לרשת.)
 */
export const DEFAULT_API_KEY = '';
