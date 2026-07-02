const villainGrid = document.getElementById('villainGrid');

villainGrid.innerHTML = VILLAINS.map((v, i) => `
  <div class="vcard" style="animation-delay:${Math.min(i*0.06,0.6)}s">
    <div class="vcard-top">
      <div class="vcard-emoji">${v.e}</div>
      <div>
        <div class="vcard-name">${v.n}</div>
        <div class="vcard-real">${v.r}</div>
        <div class="vcard-first">הופעה ראשונה: ${v.first}</div>
      </div>
    </div>
    <p class="vcard-quote">"${v.quote}"</p>
    <p class="vcard-desc">${v.d}</p>
    ${Object.entries(v.stats).map(([k,val]) => `
      <div class="stat-row">
        <span>${k}</span>
        <div class="stat-bar"><div class="stat-fill" style="width:${val*10}%"></div></div>
      </div>
    `).join('')}
  </div>
`).join('');
