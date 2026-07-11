export const currentUser = {
  id: 1,
  name: 'דניאל כהן',
  avatar: '👨‍💻',
  streak: 14,
  totalLogs: 287,
  joinDate: '2026-01-15',
  peakHour: '10:00',
  syncScore: 87,
  level: 'מנהל אנרגיה',
  points: 2840,
};

export const friends = [
  { id: 2, name: 'מיה לוי', avatar: '👩‍🎨', energy: 4, streak: 22, syncScore: 87 },
  { id: 3, name: 'עמית שרון', avatar: '🧑‍💼', energy: 2, streak: 8, syncScore: 61 },
  { id: 4, name: 'נועה גולן', avatar: '👩‍🔬', energy: 5, streak: 31, syncScore: 73 },
  { id: 5, name: 'רון אלון', avatar: '🧑‍🎤', energy: 3, streak: 5, syncScore: 44 },
  { id: 6, name: 'שירה כץ', avatar: '👩‍💻', energy: 4, streak: 19, syncScore: 92 },
];

export const weeklyData = [
  { day: 'א', entries: [2, 3, 4, 5, 4, 3, 2] },
  { day: 'ב', entries: [3, 4, 5, 5, 4, 3, 2] },
  { day: 'ג', entries: [1, 2, 3, 4, 3, 2, 1] },
  { day: 'ד', entries: [3, 4, 5, 5, 5, 4, 3] },
  { day: 'ה', entries: [2, 3, 4, 5, 4, 4, 3] },
  { day: 'ו', entries: [4, 5, 5, 4, 3, 2, 2] },
  { day: 'ש', entries: [3, 3, 4, 4, 3, 2, 1] },
];

export const hourlyPattern = [
  { hour: '06', avg: 2.1 },
  { hour: '07', avg: 2.8 },
  { hour: '08', avg: 3.4 },
  { hour: '09', avg: 4.1 },
  { hour: '10', avg: 4.8 },
  { hour: '11', avg: 4.6 },
  { hour: '12', avg: 3.9 },
  { hour: '13', avg: 3.1 },
  { hour: '14', avg: 2.8 },
  { hour: '15', avg: 3.3 },
  { hour: '16', avg: 3.7 },
  { hour: '17', avg: 3.4 },
  { hour: '18', avg: 2.9 },
  { hour: '19', avg: 2.4 },
  { hour: '20', avg: 2.1 },
  { hour: '21', avg: 1.8 },
];

export const recentLogs = [
  { id: 1, energy: 5, time: '10:15', note: 'שתיתי קפה ויצאתי לריצה, מרגיש מעולה!', mood: '⚡' },
  { id: 2, energy: 4, time: '13:30', note: 'אחרי אוכל, קצת עייף אבל בסדר', mood: '😊' },
  { id: 3, energy: 3, time: '16:00', note: '', mood: '😐' },
  { id: 4, energy: 2, time: '19:45', note: 'יום ארוך, עייף', mood: '😴' },
];

export const insights = [
  {
    id: 1,
    icon: '⚡',
    title: 'שיא האנרגיה שלך',
    description: 'אתה בשיאך בין 09:00–11:00. קבע פגישות חשובות בזמן הזה.',
    type: 'peak',
    color: 'purple',
  },
  {
    id: 2,
    icon: '🎯',
    title: 'אחרי הצהריים',
    description: 'ירידה קבועה ב-14:00. מומלץ לפעילות שגרתית, לא יצירתית.',
    type: 'dip',
    color: 'amber',
  },
  {
    id: 3,
    icon: '🔗',
    title: 'סינכרון עם מיה',
    description: 'אתה ומיה סינכרוניים ב-87%! הזמן מצוין לשיתופי פעולה.',
    type: 'sync',
    color: 'cyan',
  },
  {
    id: 4,
    icon: '🏆',
    title: '14 יום רצוף!',
    description: 'שבועיים של מעקב מתמיד. אתה בטופ 5% של המשתמשים.',
    type: 'achievement',
    color: 'green',
  },
];

export const notifications = [
  { id: 1, type: 'reminder', text: 'הגיע הזמן לדווח על האנרגיה שלך', time: 'עכשיו', read: false, icon: '⏰' },
  { id: 2, type: 'friend', text: 'מיה לוי השיגה רצף של 22 ימים!', time: 'לפני 20 דקות', read: false, icon: '🏆' },
  { id: 3, type: 'insight', text: 'תובנה חדשה: האנרגיה שלך גבוהה יותר בימי ד\'', time: 'לפני שעה', read: false, icon: '💡' },
  { id: 4, type: 'sync', text: 'נועה גולן רוצה להשוות סינכרון איתך', time: 'לפני 2 שעות', read: true, icon: '🔗' },
  { id: 5, type: 'achievement', text: 'פתחת הישג: "לוחם הבוקר" - 7 ימים עם אנרגיה גבוהה בבוקר', time: 'אתמול', read: true, icon: '🌅' },
];

export const achievements = [
  { id: 1, icon: '🔥', name: 'מתחיל', desc: 'הרצף הראשון שלך', unlocked: true, progress: 100 },
  { id: 2, icon: '⚡', name: 'אנרגטי', desc: '5 ימים ברמה 5', unlocked: true, progress: 100 },
  { id: 3, icon: '🌅', name: 'לוחם הבוקר', desc: '7 בוקרים עם אנרגיה גבוהה', unlocked: true, progress: 100 },
  { id: 4, icon: '🎯', name: 'עקבי', desc: '14 ימי מעקב רצוף', unlocked: true, progress: 100 },
  { id: 5, icon: '🦅', name: 'מלך האנרגיה', desc: '30 ימי מעקב רצוף', unlocked: false, progress: 46 },
  { id: 6, icon: '🔗', name: 'קשרים', desc: 'סינכרן עם 5 חברים', unlocked: false, progress: 60 },
];

export const energyLabels = {
  1: { label: 'שרוט לגמרי', emoji: '😵', color: '#ef4444' },
  2: { label: 'עייף', emoji: '😴', color: '#f97316' },
  3: { label: 'בסדר', emoji: '😐', color: '#eab308' },
  4: { label: 'טוב', emoji: '😊', color: '#22c55e' },
  5: { label: 'בשיא!', emoji: '⚡', color: '#8b5cf6' },
};
