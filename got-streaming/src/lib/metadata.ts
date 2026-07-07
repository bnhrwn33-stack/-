/**
 * מטא-דאטה מלא של כל עונות ופרקי "משחקי הכס".
 * משמש כשלד הקטלוג — קבצי הווידאו מ-Google Drive מוצמדים אליו אוטומטית.
 */

export interface EpisodeMeta {
  season: number;
  episode: number;
  title: string;
  titleHe: string;
  synopsis: string;
}

export interface SeasonMeta {
  number: number;
  year: string;
  description: string;
}

export const SEASONS_META: SeasonMeta[] = [
  { number: 1, year: '2011', description: 'החורף מתקרב. בית סטארק נקרע בין הצפון לחצר המלוכה, ומעבר לים נרקמת שושלת אבודה.' },
  { number: 2, year: '2012', description: 'מלחמת חמשת המלכים. הממלכה מתפצלת, וכל בית נלחם על הכס.' },
  { number: 3, year: '2013', description: 'בריתות נשברות, חתונות הופכות לשדה קרב, ואם הדרקונים אוספת צבא.' },
  { number: 4, year: '2014', description: 'קינגס לנדינג רועדת. משפטים, דו-קרבות, והחומה עומדת בפני המתקפה הגדולה.' },
  { number: 5, year: '2015', description: 'האמונה מרימה ראש, מירין בוערת, והמתים מתקרבים אל הארדהום.' },
  { number: 6, year: '2016', description: 'תחיות, קרבות ממזרים, וסודות עתיקים נחשפים מתחת לעץ הלב.' },
  { number: 7, year: '2017', description: 'הקרח והאש נפגשים. דנריס חוזרת לווסטרוס והמלחמה האמיתית מתחילה.' },
  { number: 8, year: '2019', description: 'הפרק האחרון של המשחק. הלילה הארוך מגיע, והכס תובע את קורבנו האחרון.' },
];

export const EPISODES_META: EpisodeMeta[] = [
  // ─── עונה 1 ───
  { season: 1, episode: 1, title: 'Winter Is Coming', titleHe: 'החורף מגיע', synopsis: 'נד סטארק מתבקש לשמש כיד המלך לאחר מותו המסתורי של ג׳ון ארין, ודנריס מושאת לח׳אל דרוגו.' },
  { season: 1, episode: 2, title: 'The Kingsroad', titleHe: 'דרך המלך', synopsis: 'נד יוצא דרומה עם בנותיו, ג׳ון פונה אל החומה, וברן נאבק על חייו בווינטרפל.' },
  { season: 1, episode: 3, title: 'Lord Snow', titleHe: 'לורד סנואו', synopsis: 'נד מגלה את קינגס לנדינג על מזימותיה, וג׳ון לומד את מחיר החיים במשמר הלילה.' },
  { season: 1, episode: 4, title: 'Cripples, Bastards, and Broken Things', titleHe: 'נכים, ממזרים ודברים שבורים', synopsis: 'נד חוקר את נסיבות מותו של ג׳ון ארין, וטיריון נעצר בדרכו הביתה.' },
  { season: 1, episode: 5, title: 'The Wolf and the Lion', titleHe: 'הזאב והאריה', synopsis: 'קייטלין שובה את טיריון, והעימות בין בית סטארק לבית לאניסטר מתלקח ברחובות הבירה.' },
  { season: 1, episode: 6, title: 'A Golden Crown', titleHe: 'כתר של זהב', synopsis: 'ויסריס דורש את הכתר המובטח לו, וטיריון דורש משפט בקרב בעיירי.' },
  { season: 1, episode: 7, title: 'You Win or You Die', titleHe: 'מנצחים או מתים', synopsis: 'נד מתעמת עם סרסיי על הסוד האפל שלה, והמלך רוברט נפצע אנושות בציד.' },
  { season: 1, episode: 8, title: 'The Pointy End', titleHe: 'הקצה החד', synopsis: 'בית סטארק יוצא למלחמה, ואריה נמלטת בעזרת השיעורים של סוריו.' },
  { season: 1, episode: 9, title: 'Baelor', titleHe: 'באלור', synopsis: 'רוב מסכן הכול בקרב מבריק, וגורלו של נד סטארק נחרץ על מדרגות הספטה.' },
  { season: 1, episode: 10, title: 'Fire and Blood', titleHe: 'אש ודם', synopsis: 'הצפון מכתיר מלך משלו, ודנריס יוצאת מן האש עם שלושה דרקונים.' },
  // ─── עונה 2 ───
  { season: 2, episode: 1, title: 'The North Remembers', titleHe: 'הצפון זוכר', synopsis: 'מלחמת חמשת המלכים מתחילה: סטאניס טוען לכתר, וטיריון מגיע לנהל את הבירה.' },
  { season: 2, episode: 2, title: 'The Night Lands', titleHe: 'ארצות הלילה', synopsis: 'תיאון שב לאיי הברזל ומגלה שבית גרייג׳וי אינו ממהר לקבלו בחזרה.' },
  { season: 2, episode: 3, title: 'What Is Dead May Never Die', titleHe: 'מה שמת לעולם לא ימות', synopsis: 'קייטלין מגיעה למחנהו של רנלי, ותיאון בוחר בין משפחתו לבין רוב.' },
  { season: 2, episode: 4, title: 'Garden of Bones', titleHe: 'גן של עצמות', synopsis: 'מלישנדרה יולדת צל בחשכת המערה, ואריה משרתת בהארנהאל.' },
  { season: 2, episode: 5, title: 'The Ghost of Harrenhal', titleHe: 'רוח הרפאים של הארנהאל', synopsis: 'רצח בלתי אפשרי משנה את מאזן הכוחות, ואריה זוכה בשלוש משאלות מות.' },
  { season: 2, episode: 6, title: 'The Old Gods and the New', titleHe: 'האלים הישנים והחדשים', synopsis: 'תיאון כובש את ווינטרפל, ומהומות רעב מציתות את קינגס לנדינג.' },
  { season: 2, episode: 7, title: 'A Man Without Honor', titleHe: 'אדם ללא כבוד', synopsis: 'דנריס מחפשת את הדרקונים הגנובים, וג׳יימי מנסה להימלט מהשבי.' },
  { season: 2, episode: 8, title: 'The Prince of Winterfell', titleHe: 'נסיך ווינטרפל', synopsis: 'סטאניס מפליג אל הבירה, וטיריון רוקם את הגנת העיר האחרונה.' },
  { season: 2, episode: 9, title: 'Blackwater', titleHe: 'בלאקווטר', synopsis: 'הקרב על מפרץ בלאקווטר: אש ירוקה, גבורה וייאוש בשערי קינגס לנדינג.' },
  { season: 2, episode: 10, title: 'Valar Morghulis', titleHe: 'ואלאר מורגוליס', synopsis: 'דנריס נכנסת לבית המתים, ומעבר לחומה — צבא המתים צועד.' },
  // ─── עונה 3 ───
  { season: 3, episode: 1, title: 'Valar Dohaeris', titleHe: 'ואלאר דוהאריס', synopsis: 'ג׳ון עומד בפני מאנס ריידר, ודנריס מגיעה לאסטאפור לקנות צבא.' },
  { season: 3, episode: 2, title: 'Dark Wings, Dark Words', titleHe: 'כנפיים שחורות, מילים שחורות', synopsis: 'ברן פוגש את ג׳וג׳ן ריד, וג׳יימי ובריאן ממשיכים במסען רצוף העימותים.' },
  { season: 3, episode: 3, title: 'Walk of Punishment', titleHe: 'שדרת העונשין', synopsis: 'רוב מנסה לאחות את הברית עם בית פריי, וג׳יימי משלם מחיר כבד על יהירותו.' },
  { season: 3, episode: 4, title: 'And Now His Watch Is Ended', titleHe: 'ועתה תמה משמרתו', synopsis: '"דרקאריס" — דנריס משחררת את הבלתי-מוכתמים והופכת את אסטאפור לאפר.' },
  { season: 3, episode: 5, title: 'Kissed by Fire', titleHe: 'נשוקת האש', synopsis: 'ג׳ון ואיגריט מתקרבים, וג׳יימי חושף בפני בריאן את האמת על "שוחט המלכים".' },
  { season: 3, episode: 6, title: 'The Climb', titleHe: 'הטיפוס', synopsis: 'ג׳ון ובני החורין מטפסים על החומה, וליטלפינגר נושא את נאום "הכאוס הוא סולם".' },
  { season: 3, episode: 7, title: 'The Bear and the Maiden Fair', titleHe: 'הדוב והעלמה הצחה', synopsis: 'ג׳יימי שב על עקבותיו כדי להציל את בריאן מבור הדובים.' },
  { season: 3, episode: 8, title: 'Second Sons', titleHe: 'בנים שניים', synopsis: 'טיריון וסאנסה נישאים בחתונה כפויה, ודאריו נהאריס נשבע אמונים לדנריס.' },
  { season: 3, episode: 9, title: 'The Rains of Castamere', titleHe: 'גשמי קסטמיר', synopsis: 'החתונה האדומה. בית פריי מארח את בית סטארק — והמוזיקה מתחלפת.' },
  { season: 3, episode: 10, title: 'Mhysa', titleHe: 'מיסה', synopsis: 'דנריס משחררת את עבדי יונקאי, שקוראים לה "אמא".' },
  // ─── עונה 4 ───
  { season: 4, episode: 1, title: 'Two Swords', titleHe: 'שתי חרבות', synopsis: 'אוברין מרטל, הצפע האדום, מגיע לבירה עם חשבון ישן לסגור.' },
  { season: 4, episode: 2, title: 'The Lion and the Rose', titleHe: 'האריה והשושנה', synopsis: 'החתונה הסגולה: ג׳ופרי חוגג — והגביע האחרון שלו מחכה.' },
  { season: 4, episode: 3, title: 'Breaker of Chains', titleHe: 'שוברת השרשראות', synopsis: 'טיריון נאשם ברצח המלך, ודנריס עומדת בשערי מירין.' },
  { season: 4, episode: 4, title: 'Oathkeeper', titleHe: 'שומרת השבועה', synopsis: 'בריאן יוצאת למצוא את סאנסה עם חרב חדשה ושם חדש.' },
  { season: 4, episode: 5, title: 'First of His Name', titleHe: 'הראשון לשמו', synopsis: 'טומן מוכתר למלך, וסודות מותו של ג׳ון ארין נחשפים בעיירי.' },
  { season: 4, episode: 6, title: 'The Laws of Gods and Men', titleHe: 'חוקי האלים והאנשים', synopsis: 'משפטו של טיריון הופך להצגה — עד הנאום שמרעיד את האולם.' },
  { season: 4, episode: 7, title: 'Mockingbird', titleHe: 'העפרוני', synopsis: 'אוברין מתנדב להילחם למען טיריון, וליטלפינגר חושף את כוונותיו בעיירי.' },
  { season: 4, episode: 8, title: 'The Mountain and the Viper', titleHe: 'ההר והצפע', synopsis: 'דו-הקרב הגדול: אוברין מרטל מול גרגור קלגיין, ההר הרוכב.' },
  { season: 4, episode: 9, title: 'The Watchers on the Wall', titleHe: 'הצופים על החומה', synopsis: 'הקרב על החומה: משמר הלילה מול צבאו של מאנס ריידר.' },
  { season: 4, episode: 10, title: 'The Children', titleHe: 'הילדים', synopsis: 'טיריון נמלט מהבירה אחרי מעשה שאין ממנו חזרה, וברן מוצא את עץ הלב.' },
  // ─── עונה 5 ───
  { season: 5, episode: 1, title: 'The Wars to Come', titleHe: 'המלחמות שיבואו', synopsis: 'טיריון מתעורר בפנטוס, וג׳ון נקרע בין סטאניס למאנס ריידר.' },
  { season: 5, episode: 2, title: 'The House of Black and White', titleHe: 'הבית השחור-לבן', synopsis: 'אריה מגיעה לבראבוס, אל דלתו של הבית ללא שמות.' },
  { season: 5, episode: 3, title: 'High Sparrow', titleHe: 'הדרור העליון', synopsis: 'ג׳ון נבחר למפקד משמר הלילה, וסאנסה חוזרת לווינטרפל — אל בית בולטון.' },
  { season: 5, episode: 4, title: 'Sons of the Harpy', titleHe: 'בני ההרפיה', synopsis: 'מסכות הזהב תוקפות במירין, והאמונה הצבאית משתלטת על הבירה.' },
  { season: 5, episode: 5, title: 'Kill the Boy', titleHe: 'הרוג את הנער', synopsis: 'ג׳ון מקבל החלטה שתפצל את המשמר: ברית עם בני החורין.' },
  { season: 5, episode: 6, title: 'Unbowed, Unbent, Unbroken', titleHe: 'לא כורעים, לא נכנעים, לא נשברים', synopsis: 'סאנסה נישאת לרמזי בולטון בחתונה חשוכה בווינטרפל.' },
  { season: 5, episode: 7, title: 'The Gift', titleHe: 'המתנה', synopsis: 'ג׳ורה מביא לדנריס מתנה שלא ניתן לסרב לה: טיריון לאניסטר.' },
  { season: 5, episode: 8, title: 'Hardhome', titleHe: 'הארדהום', synopsis: 'ג׳ון מפליג להארדהום — ומלך הלילה מרים את ידיו.' },
  { season: 5, episode: 9, title: 'The Dance of Dragons', titleHe: 'מחול הדרקונים', synopsis: 'סטאניס מקריב את היקר לו מכול, ודנריס ממריאה על גב דרוגון.' },
  { season: 5, episode: 10, title: "Mother's Mercy", titleHe: 'רחמי האם', synopsis: 'הליכת החרפה של סרסיי, והבגידה בג׳ון סנואו לאור הלפידים.' },
  // ─── עונה 6 ───
  { season: 6, episode: 1, title: 'The Red Woman', titleHe: 'האישה האדומה', synopsis: 'גורלו של ג׳ון סנואו על הכף, ומלישנדרה חושפת את סודה העתיק.' },
  { season: 6, episode: 2, title: 'Home', titleHe: 'הביתה', synopsis: 'ברן צופה בעבר של ווינטרפל, ובמגדל השחור — נס מתרחש.' },
  { season: 6, episode: 3, title: 'Oathbreaker', titleHe: 'מפר השבועה', synopsis: 'ג׳ון מוציא להורג את בוגדיו ומניח את גלימת המשמר.' },
  { season: 6, episode: 4, title: 'Book of the Stranger', titleHe: 'ספר הזר', synopsis: 'ג׳ון וסאנסה מתאחדים סוף סוף, ודנריס שורפת את מקדש הדוש ח׳אלין.' },
  { season: 6, episode: 5, title: 'The Door', titleHe: 'הדלת', synopsis: '"החזק את הדלת" — הסוד של הודור נחשף ברגע שובר לב.' },
  { season: 6, episode: 6, title: 'Blood of My Blood', titleHe: 'דם מדמי', synopsis: 'סאם לוקח את חרב משפחתו, ודרוגון שב אל אמו במלוא גודלו.' },
  { season: 6, episode: 7, title: 'The Broken Man', titleHe: 'האיש השבור', synopsis: 'ההאונד חי — ומוצא דרך חדשה, עד שהעבר משיג אותו.' },
  { season: 6, episode: 8, title: 'No One', titleHe: 'אף אחד', synopsis: 'אריה בוחרת: לא "אף אחד" — אלא אריה סטארק מווינטרפל.' },
  { season: 6, episode: 9, title: 'Battle of the Bastards', titleHe: 'קרב הממזרים', synopsis: 'ג׳ון מול רמזי על ווינטרפל — אחד הקרבות הגדולים שצולמו אי פעם.' },
  { season: 6, episode: 10, title: 'The Winds of Winter', titleHe: 'רוחות החורף', synopsis: 'סרסיי משמידה את הספטה הגדולה, והצפון מכריז: "המלך בצפון!"' },
  // ─── עונה 7 ───
  { season: 7, episode: 1, title: 'Dragonstone', titleHe: 'דרקונסטון', synopsis: 'דנריס דורכת סוף סוף על אדמת מולדתה, ואריה סוגרת חשבון עם בית פריי.' },
  { season: 7, episode: 2, title: 'Stormborn', titleHe: 'ילידת הסערה', synopsis: 'דנריס מתכננת את כיבוש ווסטרוס, ויורון תוקף בלב ים.' },
  { season: 7, episode: 3, title: "The Queen's Justice", titleHe: 'צדק המלכה', synopsis: 'הקרח פוגש את האש: ג׳ון סנואו עומד לראשונה מול דנריס טארגריין.' },
  { season: 7, episode: 4, title: 'The Spoils of War', titleHe: 'שלל המלחמה', synopsis: 'דנריס ודרוגון מתנפלים על שיירת הזהב של בית לאניסטר.' },
  { season: 7, episode: 5, title: 'Eastwatch', titleHe: 'מצפה המזרח', synopsis: 'תוכנית נועזת נרקמת: ללכוד מת-מהלך ולהביאו אל המלכות.' },
  { season: 7, episode: 6, title: 'Beyond the Wall', titleHe: 'מעבר לחומה', synopsis: 'הקרב על האגם הקפוא — ומלך הלילה מטיל את חניתו.' },
  { season: 7, episode: 7, title: 'The Dragon and the Wolf', titleHe: 'הדרקון והזאב', synopsis: 'פסגה גורלית בבירה, אמת עתיקה נחשפת — והחומה נופלת.' },
  // ─── עונה 8 ───
  { season: 8, episode: 1, title: 'Winterfell', titleHe: 'ווינטרפל', synopsis: 'דנריס וג׳ון מגיעים לווינטרפל, והאיחודים מהולים בחשדות.' },
  { season: 8, episode: 2, title: 'A Knight of the Seven Kingdoms', titleHe: 'אבירת שבע הממלכות', synopsis: 'הלילה שלפני הקרב: וידויים, שירים, ובריאן מקבלת את המגיע לה.' },
  { season: 8, episode: 3, title: 'The Long Night', titleHe: 'הלילה הארוך', synopsis: 'הקרב על ווינטרפל. החיים מול המתים — ומלך הלילה מגיע אל עץ הלב.' },
  { season: 8, episode: 4, title: 'The Last of the Starks', titleHe: 'אחרוני הסטארקים', synopsis: 'הניצחון גובה מחיר, והמלחמה על הכס פונה דרומה.' },
  { season: 8, episode: 5, title: 'The Bells', titleHe: 'הפעמונים', synopsis: 'הפעמונים מצלצלים בקינגס לנדינג — אבל הדרקון לא עוצר.' },
  { season: 8, episode: 6, title: 'The Iron Throne', titleHe: 'כס הברזל', synopsis: 'הפרק האחרון: גורל הכס, גורל הממלכה, וגורלם של האחרונים שנותרו.' },
];

export const SHOW_TAGLINE = 'כשמשחקים במשחקי הכס — מנצחים או מתים';
