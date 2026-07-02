// ===================== DATA =====================

const MOVIES = [
  // Phase 1
  {t:"איירון מן", y:2008, order:1, chrono:5, phase:1, type:"movie"},
  {t:"האלק המדהים", y:2008, order:2, chrono:6, phase:1, type:"movie"},
  {t:"איירון מן 2", y:2010, order:3, chrono:7, phase:1, type:"movie"},
  {t:"ת'ור", y:2011, order:4, chrono:3, phase:1, type:"movie"},
  {t:"קפטן אמריקה: הנוקם הראשון", y:2011, order:5, chrono:2, phase:1, type:"movie"},
  {t:"הנוקמים", y:2012, order:6, chrono:8, phase:1, type:"movie"},
  // Phase 2
  {t:"איירון מן 3", y:2013, order:7, chrono:10, phase:2, type:"movie"},
  {t:"ת'ור: העולם האפל", y:2013, order:8, chrono:9, phase:2, type:"movie"},
  {t:"קפטן אמריקה: חייל החורף", y:2014, order:9, chrono:11, phase:2, type:"movie"},
  {t:"שומרי הגלקסיה", y:2014, order:10, chrono:4, phase:2, type:"movie"},
  {t:"הנוקמים: עידן אולטרון", y:2015, order:11, chrono:12, phase:2, type:"movie"},
  {t:"אנט-מן", y:2015, order:12, chrono:13, phase:2, type:"movie"},
  // Phase 3
  {t:"קפטן אמריקה: מלחמת האזרחים", y:2016, order:13, chrono:14, phase:3, type:"movie"},
  {t:"דוקטור סטריינג'", y:2016, order:14, chrono:15, phase:3, type:"movie"},
  {t:"שומרי הגלקסיה 2", y:2017, order:15, chrono:16, phase:3, type:"movie"},
  {t:"ספיידר-מן: הומקאמינג", y:2017, order:16, chrono:17, phase:3, type:"movie"},
  {t:"ת'ור: רגנרוק", y:2017, order:17, chrono:18, phase:3, type:"movie"},
  {t:"בלאק פנתר", y:2018, order:18, chrono:19, phase:3, type:"movie"},
  {t:"הנוקמים: מלחמת האינסוף", y:2018, order:19, chrono:20, phase:3, type:"movie"},
  {t:"אנט-מן והוואספ", y:2018, order:20, chrono:21, phase:3, type:"movie"},
  {t:"קפטן מארוול", y:2019, order:21, chrono:1, phase:3, type:"movie"},
  {t:"הנוקמים: סוף המשחק", y:2019, order:22, chrono:22, phase:3, type:"movie"},
  {t:"ספיידר-מן: הרחק מהבית", y:2019, order:23, chrono:23, phase:3, type:"movie"},
  // Phase 4
  {t:"וונדה-ויז'ן", y:2021, order:24, chrono:24, phase:4, type:"show"},
  {t:"הפלקון וחייל החורף", y:2021, order:25, chrono:25, phase:4, type:"show"},
  {t:"האלמנה השחורה", y:2021, order:26, chrono:9.5, phase:4, type:"movie"},
  {t:"לוקי (עונה 1)", y:2021, order:27, chrono:26, phase:4, type:"show"},
  {t:"שאנג-צ'י ואגדת עשרת הטבעות", y:2021, order:28, chrono:27, phase:4, type:"movie"},
  {t:"מה אם...? (עונה 1)", y:2021, order:29, chrono:0, phase:4, type:"show"},
  {t:"עיניים של נץ", y:2021, order:30, chrono:28, phase:4, type:"show"},
  {t:"האטרנלס", y:2021, order:31, chrono:29, phase:4, type:"movie"},
  {t:"ספיידר-מן: no way home", y:2021, order:32, chrono:30, phase:4, type:"movie"},
  {t:"אביר הירח", y:2022, order:33, chrono:31, phase:4, type:"show"},
  {t:"דוקטור סטריינג' בריבוי הטירוף", y:2022, order:34, chrono:32, phase:4, type:"movie"},
  {t:"מיס מארוול", y:2022, order:35, chrono:33, phase:4, type:"show"},
  {t:"ת'ור: אהבה ורעם", y:2022, order:36, chrono:34, phase:4, type:"movie"},
  {t:"היא-האלק", y:2022, order:37, chrono:35, phase:4, type:"show"},
  {t:"בלאק פנתר: וקנדה לנצח", y:2022, order:38, chrono:36, phase:4, type:"movie"},
  // Phase 5
  {t:"פלישה חשאית", y:2023, order:39, chrono:37, phase:5, type:"show"},
  {t:"אנט-מן והוואספ: קוונטומאניה", y:2023, order:40, chrono:38, phase:5, type:"movie"},
  {t:"לוקי (עונה 2)", y:2023, order:41, chrono:39, phase:5, type:"show"},
  {t:"שומרי הגלקסיה 3", y:2023, order:42, chrono:40, phase:5, type:"movie"},
  {t:"אקו", y:2024, order:43, chrono:41, phase:5, type:"show"},
  {t:"המארוולס", y:2023, order:44, chrono:42, phase:5, type:"movie"},
  {t:"אגתה מכל הכיוונים", y:2024, order:45, chrono:43, phase:5, type:"show"},
  {t:"דדפול ווולברין", y:2024, order:46, chrono:44, phase:5, type:"movie"},
  // Phase 6
  {t:"קפטן אמריקה: עולם חדש ואמיץ", y:2025, order:47, chrono:45, phase:6, type:"movie"},
  {t:"ת'אנדרבולטס*", y:2025, order:48, chrono:46, phase:6, type:"movie"},
  {t:"הארבעה הפנטסטיים: הצעדים הראשונים", y:2025, order:49, chrono:47, phase:6, type:"movie"},
  {t:"הנוקמים: יום הדין", y:2026, order:50, chrono:48, phase:6, type:"movie"},
  {t:"הנוקמים: מלחמת הסודות", y:2027, order:51, chrono:49, phase:6, type:"movie"},
];

const PHASES = {
  1:{name:"פאזה 1", sub:"סאגת האינסוף", years:"2008–2012", desc:"הכל מתחיל כאן - טוני סטארק בונה חליפה במערה, וכעבור כמה סרטים כבר יש לנו נוקמים. הפאזה שהוכיחה שיקום קולנועי משותף בכלל אפשרי."},
  2:{name:"פאזה 2", sub:"סאגת האינסוף", years:"2013–2015", desc:"היקום מתרחב - שומרי הגלקסיה מוסיפים קוסמוס, ואולטרון מוכיח שאפילו רובוט יכול לפחד מסוף העולם."},
  3:{name:"פאזה 3", sub:"סאגת האינסוף", years:"2016–2019", desc:"השיא הגדול. תנוס אוסף את כל אבני האינסוף, חצי מהיקום נעלם, והנוקמים חייבים למצוא דרך חזרה. מסתיימת ב'סוף המשחק' - אחד הסרטים הגדולים בהיסטוריה."},
  4:{name:"פאזה 4", sub:"סאגת הריבוי", years:"2021–2022", desc:"אחרי אנדגיים היקום צריך להתאושש. פה נכנסים לתמונה סדרות הדיסני+, ריבוי היקומים מתחיל להיפתח, וגיבורים חדשים כמו שאנג-צ'י ומיס מארוול מצטרפים."},
  5:{name:"פאזה 5", sub:"סאגת הריבוי", years:"2023–2024", desc:"קאנג מסתמן כאיום הבא, אבל התוכניות משתנות. הפאזה שבה מארוול מתנסה הכי הרבה - מקוונטומאניה ועד דדפול ווולברין שמצטרף רשמית ליקום."},
  6:{name:"פאזה 6", sub:"סאגת הריבוי", years:"2025–2027", desc:"הצעדים האחרונים לפני שיא חדש - הארבעה הפנטסטיים מצטרפים סוף סוף, ושני סרטי הנוקמים הענקיים 'יום הדין' ו'מלחמת הסודות' סוגרים את הסאגה."},
};

const HEROES = [
  {n:"איירון מן", r:"טוני סטארק", e:"🦾", stats:{כוח:6,מהירות:5,מוח:10,פופ:10}},
  {n:"קפטן אמריקה", r:"סטיב רוג'רס", e:"🛡️", stats:{כוח:7,מהירות:6,מוח:8,פופ:9}},
  {n:"ת'ור", r:"אל הרעם", e:"⚡", stats:{כוח:10,מהירות:8,מוח:6,פופ:9}},
  {n:"האלמנה השחורה", r:"נטשה רומנוף", e:"🕷️", stats:{כוח:5,מהירות:8,מוח:9,פופ:8}},
  {n:"האלק", r:"בראס בנר", e:"💚", stats:{כוח:10,מהירות:4,מוח:9,פופ:8}},
  {n:"ספיידר-מן", r:"פיטר פרקר", e:"🕸️", stats:{כוח:7,מהירות:9,מוח:8,פופ:10}},
  {n:"בלאק פנתר", r:"טצ'אלה", e:"🐾", stats:{כוח:7,מהירות:7,מוח:9,פופ:9}},
  {n:"דוקטור סטריינג'", r:"סטיבן סטריינג'", e:"🔮", stats:{כוח:4,מהירות:5,מוח:10,פופ:8}},
  {n:"קפטן מארוול", r:"קרול דנוורס", e:"✨", stats:{כוח:10,מהירות:9,מוח:7,פופ:7}},
  {n:"סקרלט וויץ'", r:"ונדה מקסימוף", e:"🩸", stats:{כוח:10,מהירות:6,מוח:8,פופ:9}},
];

const TRIVIA = [
  {q:"מי הרעיין את מארוול סטודיוז?", a:"קווין פייגי מכהן כנשיא מארוול סטודיוז מאז 2007, וניצח כמעט על כל סרטי היקום מאיירון מן ועד היום."},
  {q:"איזה סרט פתח את היקום?", a:"'איירון מן' (2008) עם רוברט דאוני ג'וניור - הוא זה שהתחיל את כל היקום הקולנועי, כולל סצנת הקרדיטים הראשונה עם ניק פיורי."},
  {q:"כמה זמן לוקח לראות את כל היקום?", a:"נכון להיום, לצפות בכל הסרטים והסדרות (ברצף אחד) לוקח בערך 250+ שעות - כמעט 11 ימים רצופים!"},
  {q:"מה זה 'סצנת קרדיטים'?", a:"מארוול הייתה מהראשונות שהפכו סצנות אחרי/באמצע הקרדיטים למסורת - כלי לרמוז על עתיד היקום ולתגמל את מי שנשאר לצפות."},
  {q:"מי השחקן שגילם הכי הרבה דמויות ביקום?", a:"סטן לי עצמו הופיע כקאמאו כמעט בכל סרט עד מותו ב-2018, אך גם שחקנים כמו כריס אוונס גילמו יותר מדמות אחת ביקום."},
  {q:"מה ההבדל בין 'סאגה' ל'פאזה'?", a:"פאזה היא קבוצת סרטים/סדרות קטנה יותר, וכמה פאזות יחד מרכיבות 'סאגה' - כמו 'סאגת האינסוף' (פאזות 1-3) ו'סאגת הריבוי' (פאזות 4-6)."},
];

const STATS = [
  {n:"30+", l:"סרטי קולנוע"},
  {n:"15+", l:"סדרות טלוויזיה"},
  {n:"6", l:"פאזות"},
  {n:"2", l:"סאגות שלמות"},
  {n:"250+", l:"שעות צפייה"},
  {n:"2008", l:"שנת ההתחלה"},
];

// ===================== NAVBAR =====================
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
});

const burger = document.getElementById('burger');
const navLinks = document.getElementById('navLinks');
burger.addEventListener('click', () => {
  burger.classList.toggle('open');
  navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    burger.classList.remove('open');
    navLinks.classList.remove('open');
    navLinks.querySelectorAll('a').forEach(x => x.classList.remove('active'));
    a.classList.add('active');
  });
});

document.getElementById('toTop').addEventListener('click', () => {
  window.scrollTo({top:0, behavior:'smooth'});
});

// ===================== CURSOR GLOW =====================
const glow = document.getElementById('cursor-glow');
window.addEventListener('pointermove', e => {
  glow.style.left = e.clientX + 'px';
  glow.style.top = e.clientY + 'px';
});

// ===================== PARTICLES =====================
const particlesWrap = document.getElementById('heroParticles');
for (let i = 0; i < 40; i++) {
  const p = document.createElement('div');
  p.className = 'particle';
  const size = Math.random() * 3 + 1;
  p.style.width = size + 'px';
  p.style.height = size + 'px';
  p.style.left = Math.random() * 100 + '%';
  p.style.bottom = '-10px';
  p.style.animationDuration = (Math.random() * 10 + 8) + 's';
  p.style.animationDelay = (Math.random() * 10) + 's';
  particlesWrap.appendChild(p);
}

// ===================== REVEAL ON SCROLL =====================
const revealEls = document.querySelectorAll('.reveal, .reveal-section');
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add('in');
  });
}, {threshold:0.15});
revealEls.forEach(el => io.observe(el));

// ===================== ENDGAME COUNTER =====================
const ENDGAME_DATE = new Date('2019-04-26T00:00:00');
function updateCounter() {
  const now = new Date();
  let diff = now - ENDGAME_DATE;
  if (diff < 0) diff = 0;
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const min = Math.floor((diff % 3600000) / 60000);
  const sec = Math.floor((diff % 60000) / 1000);
  document.getElementById('c-days').textContent = days.toLocaleString('he-IL');
  document.getElementById('c-hours').textContent = String(hours).padStart(2,'0');
  document.getElementById('c-min').textContent = String(min).padStart(2,'0');
  document.getElementById('c-sec').textContent = String(sec).padStart(2,'0');
}
updateCounter();
setInterval(updateCounter, 1000);

// ===================== TIMELINE (ORDER) =====================
const timelineEl = document.getElementById('timeline');
function renderTimeline(mode) {
  const sorted = [...MOVIES].sort((a,b) => mode === 'release' ? a.order - b.order : a.chrono - b.chrono);
  timelineEl.innerHTML = sorted.map((m, i) => `
    <div class="tl-item" style="animation-delay:${Math.min(i*0.04,1)}s">
      <div class="tl-card">
        <div>
          <div class="tl-year">${m.y}</div>
          <div class="tl-title">${m.t}</div>
        </div>
        <span class="tl-badge ${m.type === 'show' ? 'show' : ''}">${m.type === 'show' ? 'סדרה' : 'סרט'} · פאזה ${m.phase}</span>
      </div>
    </div>
  `).join('');
}
renderTimeline('release');

document.querySelectorAll('.toggle-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderTimeline(btn.dataset.mode);
  });
});

// ===================== PHASES =====================
const phaseTabs = document.getElementById('phaseTabs');
const phaseContent = document.getElementById('phaseContent');

phaseTabs.innerHTML = Object.keys(PHASES).map(k => `
  <button class="phase-tab ${k === '1' ? 'active' : ''}" data-phase="${k}">${PHASES[k].name}</button>
`).join('');

phaseContent.innerHTML = Object.keys(PHASES).map(k => {
  const p = PHASES[k];
  const items = MOVIES.filter(m => m.phase == k).sort((a,b) => a.order - b.order);
  return `
    <div class="phase-panel ${k === '1' ? 'active' : ''}" data-panel="${k}">
      <p class="phase-desc"><strong>${p.sub} · ${p.years}</strong><br>${p.desc}</p>
      <div class="phase-list">
        ${items.map(m => `
          <div class="phase-card">
            <div class="yr">${m.y}</div>
            <div class="nm">${m.t}</div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}).join('');

phaseTabs.querySelectorAll('.phase-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    phaseTabs.querySelectorAll('.phase-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    phaseContent.querySelectorAll('.phase-panel').forEach(p => p.classList.remove('active'));
    phaseContent.querySelector(`[data-panel="${tab.dataset.phase}"]`).classList.add('active');
  });
});

// ===================== HERO CARDS =====================
const heroGrid = document.getElementById('heroGrid');
heroGrid.innerHTML = HEROES.map((h, i) => `
  <div class="hcard" data-i="${i}">
    <div class="hcard-inner">
      <div class="hcard-face hcard-front" data-emoji="${h.e}">
        <div class="hn">${h.n}</div>
        <div class="hr">${h.r}</div>
      </div>
      <div class="hcard-face hcard-back">
        ${Object.entries(h.stats).map(([k,v]) => `
          <div class="stat-row">
            <span>${k}</span>
            <div class="stat-bar"><div class="stat-fill" data-val="${v*10}"></div></div>
          </div>
        `).join('')}
      </div>
    </div>
  </div>
`).join('');

heroGrid.querySelectorAll('.hcard').forEach(card => {
  card.addEventListener('click', () => {
    card.classList.toggle('flipped');
    if (card.classList.contains('flipped')) {
      requestAnimationFrame(() => {
        card.querySelectorAll('.stat-fill').forEach(f => {
          f.style.width = f.dataset.val + '%';
        });
      });
    }
  });
});

// ===================== TRIVIA =====================
const triviaGrid = document.getElementById('triviaGrid');
triviaGrid.innerHTML = TRIVIA.map((t, i) => `
  <div class="tcard" data-i="${i}">
    <div class="q">${t.q} <small>+</small></div>
    <div class="a">${t.a}</div>
  </div>
`).join('');
triviaGrid.querySelectorAll('.tcard').forEach(card => {
  card.addEventListener('click', () => card.classList.toggle('open'));
});

// ===================== STATS =====================
const statsGrid = document.getElementById('statsGrid');
statsGrid.innerHTML = STATS.map(s => `
  <div class="stat-card">
    <div class="stat-num">${s.n}</div>
    <div class="stat-label">${s.l}</div>
  </div>
`).join('');
