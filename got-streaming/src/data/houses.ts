/** בתי האצולה הגדולים — סמלים, מוטו, מושב, חברים ועץ משפחה */

export interface TreeNode {
  name: string;
  characterId?: string;
  note?: string;
  children?: TreeNode[];
}

export interface House {
  id: string;
  name: string;
  nameHe: string;
  sigil: string; // אימוג׳י של סמל הבית
  colors: [string, string];
  motto: string;
  mottoHe: string;
  seat: string;
  region: string;
  founder: string;
  description: string;
  memberIds: string[];
  extraMembers: string[];
  tree: TreeNode;
}

export const HOUSES: House[] = [
  {
    id: 'stark', name: 'House Stark', nameHe: 'בית סטארק', sigil: '🐺',
    colors: ['#b9bfc9', '#3a4351'],
    motto: 'Winter Is Coming', mottoHe: 'החורף מגיע',
    seat: 'ווינטרפל', region: 'הצפון', founder: 'ברנדון הבונה (עידן הגיבורים)',
    description: 'שומרי הצפון מזה שמונת אלפים שנה. בית של כבוד, חובה ונאמנות — שמשלם על ערכיו את המחיר הכבד ביותר במלחמת הכס, וקם מן האפר שוב ושוב. הזאב הבודד מת, אך הלהקה שורדת.',
    memberIds: ['ned', 'robb', 'sansa', 'arya', 'bran', 'jon-snow'],
    extraMembers: ['קייטלין סטארק', 'ריקון סטארק', 'ליאנה סטארק', 'בנג׳ן סטארק'],
    tree: {
      name: 'ריקארד סטארק',
      children: [
        {
          name: 'נד סטארק', characterId: 'ned', note: '+ קייטלין טאלי',
          children: [
            { name: 'רוב', characterId: 'robb' },
            { name: 'סאנסה', characterId: 'sansa' },
            { name: 'אריה', characterId: 'arya' },
            { name: 'ברן', characterId: 'bran' },
            { name: 'ריקון' },
          ],
        },
        { name: 'ברנדון סטארק', note: 'נרצח בידי המלך המטורף' },
        {
          name: 'ליאנה סטארק', note: '+ רייגר טארגריין',
          children: [{ name: 'ג׳ון סנואו (אייגון טארגריין)', characterId: 'jon-snow' }],
        },
        { name: 'בנג׳ן סטארק', note: 'משמר הלילה' },
      ],
    },
  },
  {
    id: 'lannister', name: 'House Lannister', nameHe: 'בית לאניסטר', sigil: '🦁',
    colors: ['#e3c46e', '#8f1d22'],
    motto: 'Hear Me Roar!', mottoHe: 'שמעו את שאגתי! (ובפועל: לאניסטר תמיד פורע את חובותיו)',
    seat: 'קסטרלי רוק', region: 'ארצות המערב', founder: 'לאן החכם (עידן הגיבורים)',
    description: 'הבית העשיר ביותר בווסטרוס, שזהב מכרותיו מממן כתרים ומלחמות. גאווה, יופי ואכזריות — משפחה שאוהבת את עצמה יותר מכל ממלכה, וקורסת מבפנים בגלל זה בדיוק.',
    memberIds: ['tyrion', 'cersei', 'jaime', 'hound'],
    extraMembers: ['טייווין לאניסטר', 'ג׳ופרי באראתיאון', 'מירסלה', 'טומן', 'קיוואן לאניסטר'],
    tree: {
      name: 'טייטוס לאניסטר',
      children: [
        {
          name: 'טייווין לאניסטר', note: '+ ג׳ואנה לאניסטר',
          children: [
            {
              name: 'סרסיי', characterId: 'cersei', note: '+ רוברט (רשמית) / ג׳יימי',
              children: [{ name: 'ג׳ופרי' }, { name: 'מירסלה' }, { name: 'טומן' }],
            },
            { name: 'ג׳יימי', characterId: 'jaime' },
            { name: 'טיריון', characterId: 'tyrion' },
          ],
        },
        { name: 'קיוואן לאניסטר', children: [{ name: 'לנסל לאניסטר', note: 'הדרורים' }] },
      ],
    },
  },
  {
    id: 'targaryen', name: 'House Targaryen', nameHe: 'בית טארגריין', sigil: '🐉',
    colors: ['#d64545', '#1a1a22'],
    motto: 'Fire and Blood', mottoHe: 'אש ודם',
    seat: 'דרקונסטון (בעבר: המצודה האדומה)', region: 'הים הצר · ולריה העתיקה',
    founder: 'אייגון הכובש ואחיותיו',
    description: 'שושלת אדוני הדרקונים מוולריה, ששלטה בווסטרוס שלוש מאות שנה. דם הדרקון זורם בעורקיהם — ואיתו גם מטבע שמתהפך בין גדולה לשיגעון. "בכל פעם שנולד טארגריין, האלים מטילים מטבע".',
    memberIds: ['daenerys', 'jon-snow', 'varys', 'melisandre'],
    extraMembers: ['אירי׳ס השני "המלך המטורף"', 'רייגר טארגריין', 'ויסריס טארגריין'],
    tree: {
      name: 'אירי׳ס השני "המלך המטורף"',
      children: [
        {
          name: 'רייגר טארגריין', note: '+ ליאנה סטארק',
          children: [{ name: 'ג׳ון סנואו (אייגון)', characterId: 'jon-snow' }],
        },
        { name: 'ויסריס טארגריין', note: '"כתר של זהב"' },
        { name: 'דנריס טארגריין', characterId: 'daenerys', note: 'אם הדרקונים' },
      ],
    },
  },
  {
    id: 'baratheon', name: 'House Baratheon', nameHe: 'בית באראתיאון', sigil: '🦌',
    colors: ['#e3c46e', '#141414'],
    motto: 'Ours Is the Fury', mottoHe: 'שלנו הוא הזעם',
    seat: 'סטורמס אנד', region: 'ארצות הסערה', founder: 'אוריס באראתיאון, מצביאו של אייגון הכובש',
    description: 'בית הסערה שלקח את הכס במרד רוברט — ואיבד אותו במלחמת האחים בין רוברט, סטאניס ורנלי. שלושה אחים, שלושה מלכים, ואף יורש אמיתי אחד על הכס.',
    memberIds: ['brienne', 'littlefinger'],
    extraMembers: ['רוברט באראתיאון', 'סטאניס באראתיאון', 'רנלי באראתיאון', 'שירין באראתיאון', 'ג׳נדרי'],
    tree: {
      name: 'סטפון באראתיאון',
      children: [
        {
          name: 'רוברט באראתיאון', note: 'המלך',
          children: [{ name: 'ג׳נדרי (ממזר מוכר)', note: 'לורד סטורמס אנד' }],
        },
        { name: 'סטאניס באראתיאון', children: [{ name: 'שירין', note: 'הוקרבה לאל האדום' }] },
        { name: 'רנלי באראתיאון', note: '+ מרג׳רי טירל' },
      ],
    },
  },
  {
    id: 'greyjoy', name: 'House Greyjoy', nameHe: 'בית גרייג׳וי', sigil: '🦑',
    colors: ['#c9a84c', '#101418'],
    motto: 'We Do Not Sow', mottoHe: 'אנחנו לא זורעים',
    seat: 'פייק', region: 'איי הברזל', founder: 'האיש האפור (מלכי המלח והסלע)',
    description: 'בני הברזל חיים ממה שהים והביזה נותנים. "מה שמת לעולם לא ימות" — דת האל הטבוע, מסורת של שודדי ים, ומרד אחד כושל שעלה לביילון בשני בנים ובן ערובה שלישי.',
    memberIds: ['theon'],
    extraMembers: ['ביילון גרייג׳וי', 'יארה גרייג׳וי', 'יורון גרייג׳וי'],
    tree: {
      name: 'קווילון גרייג׳וי',
      children: [
        {
          name: 'ביילון גרייג׳וי', note: 'מלך איי הברזל',
          children: [
            { name: 'יארה גרייג׳וי', note: 'מלכת האיים' },
            { name: 'תיאון גרייג׳וי', characterId: 'theon' },
          ],
        },
        { name: 'יורון גרייג׳וי', note: '"העורב־עין"' },
      ],
    },
  },
  {
    id: 'tyrell', name: 'House Tyrell', nameHe: 'בית טירל', sigil: '🌹',
    colors: ['#c9a84c', '#274d2c'],
    motto: 'Growing Strong', mottoHe: 'צומחים חזקים',
    seat: 'הייגארדן', region: 'הריץ׳', founder: 'גארת׳ גרינהאנד (לפי המסורת)',
    description: 'הבית העשיר בתבואה ובוורדים — ובקוצים נסתרים. מרג׳רי שיחקה את משחק הכס בחן, וסבתה אולנה "מלכת הקוצים" הייתה מהשחקניות החדות בממלכה. הבית כולו נמחק באש הספטה ובנפילת הייגארדן.',
    memberIds: [],
    extraMembers: ['אולנה טירל "מלכת הקוצים"', 'מייס טירל', 'מרג׳רי טירל', 'לוראס טירל'],
    tree: {
      name: 'אולנה טירל "מלכת הקוצים"',
      children: [
        {
          name: 'מייס טירל',
          children: [
            { name: 'מרג׳רי טירל', note: 'שלוש פעמים מלכה' },
            { name: 'לוראס טירל', note: '"אביר הפרחים"' },
          ],
        },
      ],
    },
  },
  {
    id: 'martell', name: 'House Martell', nameHe: 'בית מרטל', sigil: '☀️',
    colors: ['#e07b39', '#7d2a1c'],
    motto: 'Unbowed, Unbent, Unbroken', mottoHe: 'לא כורעים, לא נכנעים, לא נשברים',
    seat: 'סאנספיר', region: 'דורן', founder: 'מורס מרטל והנסיכה נימריה',
    description: 'הבית היחיד שמעולם לא נכנע לדרקונים של אייגון. דורן החמה, החופשית והגאה — ביתם של אוברין "הצפע האדום", אחיו הנסיך דוראן, ובנות החול הנוקמות.',
    memberIds: [],
    extraMembers: ['אוברין מרטל "הצפע האדום"', 'דוראן מרטל', 'אלריה סאנד', 'בנות החול'],
    tree: {
      name: 'הנסיכה מרטל',
      children: [
        { name: 'דוראן מרטל', note: 'נסיך דורן', children: [{ name: 'טריסטן מרטל' }] },
        { name: 'אליה מרטל', note: '+ רייגר טארגריין' },
        { name: 'אוברין מרטל', note: '"הצפע האדום" + אלריה סאנד', children: [{ name: 'בנות החול' }] },
      ],
    },
  },
  {
    id: 'white-walkers', name: 'The White Walkers', nameHe: 'המהלכים הלבנים', sigil: '❄️',
    colors: ['#9fd3e8', '#0a1420'],
    motto: 'The Long Night', mottoHe: 'הלילה הארוך',
    seat: 'ארצות הלילה הנצחי', region: 'מעבר לחומה', founder: 'ילדי היער — כנשק נגד בני האדם',
    description: 'לא בית אצולה אלא הקץ המהלך. נוצרו בידי ילדי היער לפני שמונת אלפים שנה, נעצרו בחומה — וחזרו כשהעולם שכח שהם קיימים. המוות עצמו, שצועד לאט, בשקט, ובכיוון אחד: דרומה.',
    memberIds: ['night-king'],
    extraMembers: ['המהלכים הלבנים', 'צבא המתים', 'ויסריון (דרקון הקרח)'],
    tree: {
      name: 'ילדי היער',
      children: [
        {
          name: 'מלך הלילה', characterId: 'night-king',
          children: [{ name: 'המהלכים הלבנים' }, { name: 'צבא המתים' }],
        },
      ],
    },
  },
];

export function houseById(id: string): House | undefined {
  return HOUSES.find((h) => h.id === id);
}
