const updatesFeed = document.getElementById('updatesFeed');

const sorted = [...UPDATES].sort((a, b) => new Date(a.date) - new Date(b.date));

updatesFeed.innerHTML = sorted.map((u, i) => `
  <div class="ucard" style="animation-delay:${Math.min(i*0.05,0.6)}s">
    <div class="ucard-inner">
      <div class="ucard-meta">
        <span class="ucard-date">${u.date}</span>
        <span class="ucard-tag">${u.tag}</span>
      </div>
      <div class="ucard-title">${u.title}</div>
      <p class="ucard-text">${u.text}</p>
    </div>
  </div>
`).join('');
