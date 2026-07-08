/** מפת העולם: מיקומים, קרבות, ציר זמן וציטוטים */

export interface WorldLocation {
  id: string;
  name: string;
  nameHe: string;
  type: 'castle' | 'city' | 'landmark';
  x: number; // אחוזים על המפה
  y: number;
  region: string;
  houseId?: string;
  description: string;
  events: string[];
}

export const LOCATIONS: WorldLocation[] = [
  {
    id: 'the-wall', name: 'The Wall', nameHe: 'החומה', type: 'landmark', x: 50, y: 8,
    region: 'גבול הצפון',
    description: 'חומת קרח בגובה 200 מטר ובאורך 480 ק"מ, שנבנתה לפני שמונת אלפים שנה בעזרת קסם כדי לעצור את המהלכים הלבנים. עליה שומר משמר הלילה מקאסל בלאק.',
    events: ['שבועת ג׳ון סנואו למשמר (ע1)', 'הקרב על החומה מול מאנס ריידר (ע4 פ9)', 'נפילת החומה בידי ויסריון (ע7 פ7)'],
  },
  {
    id: 'winterfell', name: 'Winterfell', nameHe: 'ווינטרפל', type: 'castle', x: 46, y: 24,
    region: 'הצפון', houseId: 'stark',
    description: 'מושב בית סטארק ובירת הצפון, בנויה מעל מעיינות חמים. חומותיה ראו את נפילת הבית, את עריצות בולטון — ואת הקרב הגדול בתולדות האנושות מול צבא המתים.',
    events: ['ביקור המלך רוברט (ע1 פ1)', 'נפילתה בידי תיאון (ע2)', 'קרב הממזרים (ע6 פ9)', 'הלילה הארוך (ע8 פ3)'],
  },
  {
    id: 'kings-landing', name: "King's Landing", nameHe: 'קינגס לנדינג', type: 'city', x: 62, y: 62,
    region: 'ארצות הכתר', houseId: 'lannister',
    description: 'בירת שבע הממלכות ומושב כס הברזל, עיר של מיליון נפשות, אינטריגות וריח דגים. כאן נערף ראשו של נד, כאן פוצצה סרסיי את הספטה — וכאן ירדה האש מהשמיים.',
    events: ['הוצאת נד להורג (ע1 פ9)', 'קרב בלאקווטר (ע2 פ9)', 'החתונה הסגולה (ע4 פ2)', 'פיצוץ הספטה (ע6 פ10)', 'שריפת העיר (ע8 פ5)'],
  },
  {
    id: 'casterly-rock', name: 'Casterly Rock', nameHe: 'קסטרלי רוק', type: 'castle', x: 34, y: 55,
    region: 'ארצות המערב', houseId: 'lannister',
    description: 'מבצר בית לאניסטר, חצוב בסלע ענק מעל מכרות הזהב שהפכו את הבית לעשיר בווסטרוס. "אין עוד זהב במכרות" — הסוד ששמר טייווין עד יומו האחרון.',
    events: ['כיבוש בידי הבלתי-מוכתמים (ע7 פ3) — שהתגלה כמלכודת ריקה'],
  },
  {
    id: 'the-eyrie', name: 'The Eyrie', nameHe: 'העיירי', type: 'castle', x: 58, y: 42,
    region: 'העמק', houseId: 'baratheon',
    description: 'מבצר בית ארין על פסגת הר, שלא נכבש מעולם. מפורסם בזכות "דלת הירח" — הפתח ברצפה שדרכו עפים אל מותם אורחים לא רצויים.',
    events: ['משפט טיריון ודו-קרב ברון (ע1 פ6)', 'ליטלפינגר דוחף את לייסה מדלת הירח (ע4 פ7)'],
  },
  {
    id: 'pyke', name: 'Pyke', nameHe: 'פייק', type: 'castle', x: 28, y: 40,
    region: 'איי הברזל', houseId: 'greyjoy',
    description: 'מבצר בית גרייג׳וי, בנוי על צוקים שהים מכרסם בהם — מגדלים המחוברים בגשרי חבלים מעל התהום. ביתם של בני הברזל שאינם זורעים.',
    events: ['שובו של תיאון והכתרתו-מחדש כבן ברזל (ע2)', 'הרצחו של ביילון בידי יורון (ע6 פ2)'],
  },
  {
    id: 'highgarden', name: 'Highgarden', nameHe: 'הייגארדן', type: 'castle', x: 40, y: 72,
    region: 'הריץ׳', houseId: 'tyrell',
    description: 'ארמון בית טירל בלב אסם התבואה של ווסטרוס — גנים, כרמים ושדות עד האופק. העושר החקלאי שמאכיל את קינגס לנדינג, והקוץ שבצד של בית לאניסטר.',
    events: ['נפילת הבית וסופה של אולנה "מלכת הקוצים" (ע7 פ3): "תגיד לסרסיי — אני רוצה שהיא תדע שזו הייתי אני"'],
  },
  {
    id: 'sunspear', name: 'Sunspear', nameHe: 'סאנספיר', type: 'city', x: 60, y: 84,
    region: 'דורן', houseId: 'martell',
    description: 'בירת דורן ומושב בית מרטל, בקצה המדברי-דרומי של היבשת. הממלכה היחידה שלא נכנעה מעולם לדרקונים — לא כורעים, לא נכנעים, לא נשברים.',
    events: ['מזימת בנות החול ורצח דוראן (ע6)', 'מות מירסלה בנשיקת הרעל (ע5 פ10)'],
  },
  {
    id: 'dragonstone', name: 'Dragonstone', nameHe: 'דרקונסטון', type: 'castle', x: 68, y: 54,
    region: 'הים הצר', houseId: 'targaryen',
    description: 'אי געשי ומבצר אבן-הדרקון העתיק של בית טארגריין, מלא בזכוכית דרקונים. מכאן יצא סטאניס, לכאן שבה דנריס — הצעד הראשון שלה על אדמת מולדתה.',
    events: ['לידת הצל של מלישנדרה (ע2)', 'שובה של דנריס הביתה (ע7 פ1)', 'כריית זכוכית הדרקונים לקרב הגדול'],
  },
  {
    id: 'braavos', name: 'Braavos', nameHe: 'בראבוס', type: 'city', x: 88, y: 30,
    region: 'אסוס — הערים החופשיות',
    description: 'העיר החופשית העשירה שמעבר לים הצר, ביתם של הבנק המצולק, הטיטאן הענק בפתח הנמל — והבית השחור-לבן של חסרי הפנים.',
    events: ['אימוני אריה אצל חסרי הפנים (ע5–6)', '"ילדה אין לה שם"', 'אריה מחזירה לעצמה את שמה (ע6 פ8)'],
  },
  {
    id: 'meereen', name: 'Meereen', nameHe: 'מירין', type: 'city', x: 93, y: 62,
    region: 'אסוס — מפרץ העבדים',
    description: 'הגדולה בערי מפרץ העבדים, עם פירמידות אבן ענקיות. דנריס שחררה אותה, שלטה בה ולמדה בה את מחיר הכתר — לפני שהפליגה מערבה.',
    events: ['שחרור העיר (ע4)', 'מרד בני ההרפיה (ע5)', 'קרב מפרץ העבדים (ע6 פ9)'],
  },
  {
    id: 'hardhome', name: 'Hardhome', nameHe: 'הארדהום', type: 'landmark', x: 60, y: 4,
    region: 'מעבר לחומה',
    description: 'יישוב בני החורין על חוף מפרץ קפוא, מעבר לחומה. כאן ראה העולם לראשונה את גודל האסון: מלך הלילה מרים את המתים באלפיהם, מול עיניו של ג׳ון.',
    events: ['טבח הארדהום (ע5 פ8) — מהסצנות הגדולות של הסדרה'],
  },
];

export interface Battle {
  id: string;
  nameHe: string;
  locationId: string;
  season: number;
  episode: number;
  sides: string;
  outcome: string;
}

export const BATTLES: Battle[] = [
  { id: 'blackwater', nameHe: 'קרב בלאקווטר', locationId: 'kings-landing', season: 2, episode: 9, sides: 'סטאניס נגד בית לאניסטר-טירל', outcome: 'אש ירוקה מכלה את הצי; טייווין מציל את העיר ברגע האחרון.' },
  { id: 'castle-black', nameHe: 'הקרב על החומה', locationId: 'the-wall', season: 4, episode: 9, sides: 'משמר הלילה נגד צבא בני החורין', outcome: 'המשמר מחזיק בחומה; מאנס נעצר בידי סטאניס.' },
  { id: 'hardhome-battle', nameHe: 'טבח הארדהום', locationId: 'hardhome', season: 5, episode: 8, sides: 'משמר הלילה ובני החורין נגד צבא המתים', outcome: 'נסיגה בבהלה; מלך הלילה מרים את הנופלים אל שורותיו.' },
  { id: 'bastards', nameHe: 'קרב הממזרים', locationId: 'winterfell', season: 6, episode: 9, sides: 'ג׳ון סנואו נגד רמזי בולטון', outcome: 'אבירי העמק מכריעים; ווינטרפל חוזרת לבית סטארק.' },
  { id: 'goldroad', nameHe: 'קרב דרך הזהב', locationId: 'highgarden', season: 7, episode: 4, sides: 'דנריס ודרוגון נגד צבא לאניסטר', outcome: 'שיירת הזהב באפר; ווסטרוס רואה דרקון בקרב לראשונה מזה מאות שנים.' },
  { id: 'frozen-lake', nameHe: 'הקרב על האגם הקפוא', locationId: 'hardhome', season: 7, episode: 6, sides: 'משלחת ג׳ון נגד צבא המתים', outcome: 'ויסריון נופל — ומצטרף לצד הלא נכון.' },
  { id: 'long-night', nameHe: 'הלילה הארוך', locationId: 'winterfell', season: 8, episode: 3, sides: 'החיים נגד המתים', outcome: 'אריה סטארק מסיימת את מלך הלילה בסכין ולריאני.' },
  { id: 'bells', nameHe: 'נפילת קינגס לנדינג', locationId: 'kings-landing', season: 8, episode: 5, sides: 'דנריס נגד סרסיי', outcome: 'הפעמונים מצלצלים — והעיר נשרפת בכל זאת.' },
];

export interface TimelineEvent {
  season: number;
  episode: number;
  title: string;
  description: string;
}

export const TIMELINE: TimelineEvent[] = [
  { season: 1, episode: 1, title: 'החורף מגיע', description: 'המלך רוברט מגיע לווינטרפל; נד מתמנה ליד המלך; ברן נדחף מהמגדל.' },
  { season: 1, episode: 9, title: 'מותו של נד סטארק', description: 'ראשו של איש הכבוד נערף על מדרגות באלור — והמלחמה מוצתת.' },
  { season: 1, episode: 10, title: 'לידת הדרקונים', description: 'דנריס יוצאת מהמדורה עם שלושה דרקונים חיים. הקסם חוזר לעולם.' },
  { season: 2, episode: 9, title: 'קרב בלאקווטר', description: 'סטאניס בשערי הבירה; אש ירוקה מאירה את הלילה.' },
  { season: 3, episode: 9, title: 'החתונה האדומה', description: 'רוב וקייטלין נרצחים בבגידת פריי-בולטון. הצפון שובר לב.' },
  { season: 4, episode: 2, title: 'החתונה הסגולה', description: 'ג׳ופרי מורעל בחתונתו שלו. הממלכה נושמת — וטיריון נאשם.' },
  { season: 5, episode: 8, title: 'הארדהום', description: 'מלך הלילה חושף את צבאו. כללי המשחק משתנים לנצח.' },
  { season: 6, episode: 5, title: 'הודור', description: '"החזק את הדלת" — הקרבה ששוברת את הלב וחושפת את כוחו של ברן.' },
  { season: 6, episode: 9, title: 'קרב הממזרים', description: 'ג׳ון מביס את רמזי; הזאב חוזר לווינטרפל.' },
  { season: 6, episode: 10, title: 'רוחות החורף', description: 'סרסיי מפוצצת את הספטה ולוקחת את הכס; "המלך בצפון!"' },
  { season: 7, episode: 3, title: 'הקרח פוגש את האש', description: 'ג׳ון סנואו עומד לראשונה מול דנריס טארגריין בדרקונסטון.' },
  { season: 7, episode: 7, title: 'נפילת החומה', description: 'ויסריון של מלך הלילה מפיל את מה שעמד שמונת אלפים שנה.' },
  { season: 8, episode: 3, title: 'הלילה הארוך', description: 'הקרב על ווינטרפל. אריה מסיימת את האיום הגדול מכולם.' },
  { season: 8, episode: 6, title: 'כס הברזל', description: 'דרוגון ממיס את הכס; ברן השבור נבחר; המעגל נסגר.' },
];

export interface Quote {
  he: string;
  en: string;
  by: string;
}

export const QUOTES: Quote[] = [
  { he: 'כשמשחקים במשחקי הכס — מנצחים או מתים. אין דרך ביניים.', en: 'When you play the game of thrones, you win or you die.', by: 'סרסיי לאניסטר' },
  { he: 'החורף מגיע.', en: 'Winter is coming.', by: 'בית סטארק' },
  { he: 'אדם שמכריז את גזר הדין — צריך להניף את החרב.', en: 'The man who passes the sentence should swing the sword.', by: 'נד סטארק' },
  { he: 'הכאוס אינו בור. הכאוס הוא סולם.', en: 'Chaos isn’t a pit. Chaos is a ladder.', by: 'פיטר בייליש' },
  { he: 'לילה אפל הוא, ומלא אימה.', en: 'The night is dark and full of terrors.', by: 'מלישנדרה' },
  { he: 'אני שותה ואני יודע דברים.', en: 'I drink and I know things.', by: 'טיריון לאניסטר' },
  { he: 'ואלאר מורגוליס — כל בני האדם חייבים למות.', en: 'Valar Morghulis — all men must die.', by: 'יאקן ה׳גאר' },
  { he: 'מה אנחנו אומרים לאל המוות? לא היום.', en: 'What do we say to the god of death? Not today.', by: 'סוריו פורל' },
  { he: 'אישה אין לה שם.', en: 'A girl has no name.', by: 'אריה סטארק' },
  { he: 'אני לא אפסיק את הגלגל. אני אשבור את הגלגל.', en: 'I’m not going to stop the wheel. I’m going to break the wheel.', by: 'דנריס טארגריין' },
  { he: 'לעולם אל תשכח מה שאתה — כי העולם לא ישכח.', en: 'Never forget what you are. The rest of the world will not.', by: 'טיריון לאניסטר' },
  { he: 'הזאב הבודד מת, אבל הלהקה שורדת.', en: 'The lone wolf dies, but the pack survives.', by: 'נד סטארק' },
  { he: 'כל מה שהיה לפני המילה "אבל" — לא נחשב.', en: 'Everything before the word "but" is horse shit.', by: 'ג׳ון סנואו' },
  { he: 'כוח הוא כוח.', en: 'Power is power.', by: 'סרסיי לאניסטר' },
  { he: 'המלך בצפון!', en: 'The King in the North!', by: 'לורדי הצפון' },
  { he: 'הודור.', en: 'Hold the door.', by: 'הודור' },
];

export function randomQuote(): Quote {
  return QUOTES[Math.floor(Math.random() * QUOTES.length)];
}
