// Data (MOVIES, PHASES, PHASE_GRADIENTS, HEROES, TRIVIA, STATS, posterHTML) comes from js/data.js
// Navbar / cursor glow / reveal-on-scroll come from js/common.js

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
        <div class="tl-card-main">
          ${posterHTML(m, 'mini')}
          <div>
            <div class="tl-year">${m.y}</div>
            <div class="tl-title">${m.t}</div>
          </div>
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
            ${posterHTML(m)}
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
