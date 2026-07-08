/** חידון טריוויה + מחשבון "לאיזה בית אתה שייך?" */

export interface TriviaQuestion {
  q: string;
  options: string[];
  answer: number; // אינדקס התשובה הנכונה
  explain: string;
}

export const TRIVIA: TriviaQuestion[] = [
  { q: 'מהו המוטו של בית סטארק?', options: ['שמעו את שאגתי', 'החורף מגיע', 'אש ודם', 'שלנו הוא הזעם'], answer: 1, explain: '"Winter Is Coming" — המוטו היחיד שהוא אזהרה ולא התפארות.' },
  { q: 'מי דחף את ברן מהמגדל בפרק הראשון?', options: ['ג׳ופרי', 'טיריון', 'ג׳יימי לאניסטר', 'ליטלפינגר'], answer: 2, explain: '"הדברים שאני עושה בשביל אהבה" — ג׳יימי, אחרי שברן ראה אותו עם סרסיי.' },
  { q: 'איך קוראים לחרב של אריה?', options: ['Needle (מחט)', 'Ice (קרח)', 'Oathkeeper', 'Longclaw'], answer: 0, explain: 'ג׳ון העניק לה את "מחט" לפני שנפרדו בעונה הראשונה.' },
  { q: 'מי הרג את מלך הלילה?', options: ['ג׳ון סנואו', 'דנריס', 'אריה סטארק', 'ברן'], answer: 2, explain: 'בסכין הוולריאני — עם תרגיל החלפת הידיים המפורסם.' },
  { q: 'מהו שמו האמיתי של ג׳ון סנואו?', options: ['ג׳אהריס טארגריין', 'אייגון טארגריין', 'אימון טארגריין', 'דוראן מרטל'], answer: 1, explain: 'בנם החוקי של רייגר טארגריין וליאנה סטארק.' },
  { q: 'איזה דרקון הפך לדרקון קרח של מלך הלילה?', options: ['דרוגון', 'רייגל', 'ויסריון', 'באלריון'], answer: 2, explain: 'ויסריון נפל בקרב האגם הקפוא (ע7 פ6) והוקם מחדש.' },
  { q: 'מה אומרים לאל המוות?', options: ['ואלאר מורגוליס', 'לא היום', 'ואלאר דוהאריס', 'דרקאריס'], answer: 1, explain: 'השיעור של סוריו פורל, שליווה את אריה עד הלילה הארוך.' },
  { q: 'מי פוצץ את הספטה הגדולה של באלור?', options: ['טיריון', 'דנריס', 'סרסיי', 'קייבורן'], answer: 2, explain: 'במטמוני האש הירוקה של המלך המטורף (ע6 פ10).' },
  { q: 'באיזו עיר התאמנה אריה אצל חסרי הפנים?', options: ['פנטוס', 'בראבוס', 'מירין', 'וולנטיס'], answer: 1, explain: 'בבית השחור-לבן בבראבוס, אצל יאקן ה׳גאר.' },
  { q: 'מי נבחר למלך בסוף הסדרה?', options: ['ג׳ון סנואו', 'סאנסה', 'ג׳נדרי', 'ברן סטארק'], answer: 3, explain: '"למי יש סיפור טוב יותר מברן השבור?" — הצעת טיריון.' },
];

export interface SortingOption {
  label: string;
  points: Record<string, number>; // houseId -> נקודות
}

export interface SortingQuestion {
  q: string;
  options: SortingOption[];
}

export const SORTING_QUIZ: SortingQuestion[] = [
  {
    q: 'מה הכי חשוב לך?',
    options: [
      { label: 'כבוד ומשפחה', points: { stark: 3 } },
      { label: 'כוח והשפעה', points: { lannister: 3 } },
      { label: 'גורל וייעוד', points: { targaryen: 3 } },
      { label: 'חופש בלי חוקים', points: { greyjoy: 3 } },
    ],
  },
  {
    q: 'איך אתה מנצח ויכוח?',
    options: [
      { label: 'אומר את האמת גם כשקשה', points: { stark: 3 } },
      { label: 'בשנינות חדה', points: { lannister: 2, tyrell: 1 } },
      { label: 'בלהט שאי אפשר לעמוד בפניו', points: { targaryen: 3 } },
      { label: 'לא מתווכח. פועל.', points: { greyjoy: 2, martell: 1 } },
    ],
  },
  {
    q: 'מקום החלומות שלך:',
    options: [
      { label: 'יער מושלג ושקט', points: { stark: 3 } },
      { label: 'ארמון מפואר עם נוף', points: { lannister: 2, tyrell: 1 } },
      { label: 'צוק מעל ים סוער', points: { greyjoy: 3 } },
      { label: 'חוף חם עם יין מתובל', points: { martell: 3 } },
    ],
  },
  {
    q: 'הבוגד נתפס. מה עושים?',
    options: [
      { label: 'אני מניף את החרב בעצמי', points: { stark: 3 } },
      { label: 'משלם את החוב — בריבית', points: { lannister: 3 } },
      { label: 'דרקאריס', points: { targaryen: 3 } },
      { label: 'סליחה בפומבי, נקמה בסתר', points: { martell: 2, tyrell: 1 } },
    ],
  },
  {
    q: 'החולשה הגדולה שלך:',
    options: [
      { label: 'יותר מדי כבוד', points: { stark: 3 } },
      { label: 'גאווה', points: { lannister: 2, targaryen: 1 } },
      { label: 'אימפולסיביות', points: { targaryen: 2, greyjoy: 1 } },
      { label: 'אני נהנה מהמשחק יותר מדי', points: { tyrell: 2, martell: 1 } },
    ],
  },
  {
    q: 'בעל ברית אידיאלי:',
    options: [
      { label: 'מי שמחזיק במילה שלו', points: { stark: 3 } },
      { label: 'מי שחייב לי כסף', points: { lannister: 3 } },
      { label: 'צבא נאמן שילך באש', points: { targaryen: 2, greyjoy: 1 } },
      { label: 'מי שיודע סודות', points: { tyrell: 2, martell: 1 } },
    ],
  },
  {
    q: 'המשפט שהכי מדבר אליך:',
    options: [
      { label: '"הזאב הבודד מת, הלהקה שורדת"', points: { stark: 3 } },
      { label: '"כוח הוא כוח"', points: { lannister: 3 } },
      { label: '"אני אשבור את הגלגל"', points: { targaryen: 3 } },
      { label: '"אנחנו לא זורעים"', points: { greyjoy: 3 } },
    ],
  },
];
