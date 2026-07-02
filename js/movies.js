const movieGrid = document.getElementById('movieGrid');
const galleryCount = document.getElementById('galleryCount');
const searchBox = document.getElementById('searchBox');
const typeChips = document.getElementById('typeChips');
const phaseChips = document.getElementById('phaseChips');

let activeType = 'all';
let activePhase = 'all';

function renderGrid() {
  const q = searchBox.value.trim();
  const sorted = [...MOVIES].sort((a,b) => a.order - b.order);
  const filtered = sorted.filter(m => {
    const matchesType = activeType === 'all' || m.type === activeType;
    const matchesPhase = activePhase === 'all' || String(m.phase) === activePhase;
    const matchesQuery = !q || m.t.includes(q);
    return matchesType && matchesPhase && matchesQuery;
  });

  galleryCount.textContent = `מציג ${filtered.length} מתוך ${MOVIES.length} כותרים`;

  movieGrid.innerHTML = filtered.length ? filtered.map((m, i) => `
    <div class="movie-card" data-order="${m.order}" style="animation-delay:${Math.min(i*0.03,0.6)}s">
      ${posterHTML(m)}
      <div class="movie-card-body">
        <div class="mc-year">${m.y}</div>
        <div class="mc-title">${m.t}</div>
        <span class="mc-badge ${m.type === 'show' ? 'show' : ''}">${m.type === 'show' ? 'סדרה' : 'סרט'}</span>
      </div>
    </div>
  `).join('') : `<p class="no-results">לא נמצאו תוצאות תואמות. נסו מונח אחר.</p>`;

  movieGrid.querySelectorAll('.movie-card').forEach(card => {
    card.addEventListener('click', () => openModal(Number(card.dataset.order)));
  });
}

searchBox.addEventListener('input', renderGrid);

typeChips.querySelectorAll('.chip').forEach(chip => {
  chip.addEventListener('click', () => {
    typeChips.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    activeType = chip.dataset.type;
    renderGrid();
  });
});

phaseChips.querySelectorAll('.chip').forEach(chip => {
  chip.addEventListener('click', () => {
    phaseChips.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    activePhase = chip.dataset.phase;
    renderGrid();
  });
});

// ===================== MODAL =====================
const modalOverlay = document.getElementById('modalOverlay');
const modalCard = document.getElementById('modalCard');

function openModal(order) {
  const m = MOVIES.find(x => x.order === order);
  if (!m) return;
  modalCard.innerHTML = `
    <button class="modal-close" id="modalClose">✕</button>
    ${posterHTML(m)}
    <h3>${m.t}</h3>
    <p class="mc-meta">${m.y} · ${m.type === 'show' ? 'סדרה' : 'סרט'} · פאזה ${m.phase}</p>
    <p class="mc-desc">${m.d}</p>
  `;
  modalOverlay.classList.add('open');
  document.getElementById('modalClose').addEventListener('click', closeModal);
}

function closeModal() {
  modalOverlay.classList.remove('open');
}

modalOverlay.addEventListener('click', e => {
  if (e.target === modalOverlay) closeModal();
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
});

renderGrid();
