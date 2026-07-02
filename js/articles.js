const articleGrid = document.getElementById('articleGrid');

articleGrid.innerHTML = ARTICLES.map((a, i) => `
  <div class="acard" data-id="${a.id}" style="animation-delay:${Math.min(i*0.05,0.5)}s">
    <div class="acard-banner">
      <span class="acard-cat">${a.cat}</span>
      ${a.e}
    </div>
    <div class="acard-body">
      <div class="acard-title">${a.title}</div>
      <p class="acard-excerpt">${a.excerpt}</p>
      <div class="acard-read">${a.read} ←</div>
    </div>
  </div>
`).join('');

const modalOverlay = document.getElementById('modalOverlay');
const modalCard = document.getElementById('modalCard');

function openArticle(id) {
  const a = ARTICLES.find(x => x.id === id);
  if (!a) return;
  modalCard.innerHTML = `
    <button class="modal-close" id="modalClose">✕</button>
    <span class="am-cat">${a.cat}</span>
    <div class="am-banner">${a.e}</div>
    <h3>${a.title}</h3>
    <span class="am-read">${a.read}</span>
    ${a.body.map(p => `<p>${p}</p>`).join('')}
  `;
  modalOverlay.classList.add('open');
  document.getElementById('modalClose').addEventListener('click', closeModal);
}

function closeModal() {
  modalOverlay.classList.remove('open');
}

articleGrid.querySelectorAll('.acard').forEach(card => {
  card.addEventListener('click', () => openArticle(card.dataset.id));
});

modalOverlay.addEventListener('click', e => {
  if (e.target === modalOverlay) closeModal();
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
});
