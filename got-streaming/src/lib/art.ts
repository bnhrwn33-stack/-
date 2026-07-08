/**
 * תמונות חכמות: קודם מנסים תמונה אמיתית מ-public/images (שהמשתמש מעלה),
 * ואם אין — נוצרת עטיפה דרמטית ב-SVG (זהב על שחור) כך שהאתר תמיד נראה שלם.
 */

const GOLD = '#c9a84c';

function svgDataUri(svg: string): string {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

/** עטיפת פרק גנרית — מספר פרק גדול על רקע מעושן */
export function episodePoster(season: number, episode: number, w = 640, h = 360): string {
  const seed = season * 31 + episode * 7;
  const hue1 = 30 + (seed % 20) - 10;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <radialGradient id="g" cx="${25 + (seed % 50)}%" cy="30%" r="90%">
      <stop offset="0%" stop-color="hsl(${hue1},45%,16%)"/>
      <stop offset="55%" stop-color="#0c0c10"/>
      <stop offset="100%" stop-color="#050507"/>
    </radialGradient>
    <linearGradient id="tx" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#f0d99a"/>
      <stop offset="100%" stop-color="${GOLD}"/>
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#g)"/>
  <g opacity="0.14" stroke="${GOLD}" stroke-width="2" fill="none">
    ${Array.from({ length: 9 }, (_, i) => {
      const x = (w / 10) * (i + 1) + ((seed * (i + 3)) % 14) - 7;
      const hh = h * (0.35 + ((seed * (i + 1)) % 30) / 100);
      return `<path d="M${x} ${h} L${x - 5} ${h - hh} L${x} ${h - hh - 18} L${x + 5} ${h - hh} Z"/>`;
    }).join('')}
  </g>
  <text x="50%" y="46%" text-anchor="middle" font-family="Cinzel, serif" font-weight="900"
    font-size="${h * 0.42}" fill="url(#tx)" opacity="0.92">${episode}</text>
  <text x="50%" y="72%" text-anchor="middle" font-family="Cinzel, serif" font-weight="700"
    font-size="${h * 0.09}" letter-spacing="6" fill="#8e96a3">SEASON ${season}</text>
  <rect width="${w}" height="${h}" fill="none" stroke="${GOLD}" stroke-opacity="0.25" stroke-width="2"/>
</svg>`;
  return svgDataUri(svg);
}

/** עטיפת עונה — ספרה רומית גדולה */
const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];
export function seasonPoster(season: number, w = 480, h = 680): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <radialGradient id="g" cx="50%" cy="22%" r="95%">
      <stop offset="0%" stop-color="#2a2416"/>
      <stop offset="50%" stop-color="#0e0e13"/>
      <stop offset="100%" stop-color="#050507"/>
    </radialGradient>
    <linearGradient id="tx" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#f0d99a"/>
      <stop offset="100%" stop-color="#a8863a"/>
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#g)"/>
  <g opacity="0.15" stroke="${GOLD}" fill="none" stroke-width="2">
    ${Array.from({ length: 13 }, (_, i) => {
      const x = (w / 14) * (i + 1);
      const hh = h * (0.18 + Math.abs(6.5 - i) * -0.012 + 0.14 * Math.sin(i * 2.1) + 0.2);
      return `<path d="M${x} ${h} L${x - 4} ${h - hh} L${x} ${h - hh - 16} L${x + 4} ${h - hh} Z"/>`;
    }).join('')}
  </g>
  <text x="50%" y="42%" text-anchor="middle" font-family="Cinzel, serif" font-weight="900"
    font-size="${h * 0.28}" fill="url(#tx)">${ROMAN[season - 1] ?? season}</text>
  <text x="50%" y="56%" text-anchor="middle" font-family="Cinzel, serif" font-weight="700"
    font-size="${h * 0.045}" letter-spacing="8" fill="#8e96a3">SEASON ${season}</text>
  <rect x="10" y="10" width="${w - 20}" height="${h - 20}" fill="none" stroke="${GOLD}" stroke-opacity="0.3"/>
</svg>`;
  return svgDataUri(svg);
}

/** דיוקן דמות גנרי — מונוגרמה בצבעי הבית */
export function characterPortrait(nameHe: string, c1: string, c2: string, w = 480, h = 600): string {
  const initial = nameHe.trim().charAt(0);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <radialGradient id="g" cx="50%" cy="30%" r="90%">
      <stop offset="0%" stop-color="${c2}"/>
      <stop offset="70%" stop-color="#0b0b10"/>
      <stop offset="100%" stop-color="#050507"/>
    </radialGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#g)"/>
  <circle cx="${w / 2}" cy="${h * 0.42}" r="${w * 0.3}" fill="none" stroke="${c1}" stroke-opacity="0.4" stroke-width="3"/>
  <circle cx="${w / 2}" cy="${h * 0.42}" r="${w * 0.34}" fill="none" stroke="${c1}" stroke-opacity="0.15" stroke-width="1.5"/>
  <text x="50%" y="${h * 0.42}" dy="0.36em" text-anchor="middle" font-family="Heebo, sans-serif" font-weight="800"
    font-size="${w * 0.32}" fill="${c1}">${initial}</text>
  <rect x="10" y="10" width="${w - 20}" height="${h - 20}" fill="none" stroke="${c1}" stroke-opacity="0.25"/>
</svg>`;
  return svgDataUri(svg);
}

/** אריח גלריה גנרי */
export function galleryTile(label: string, seed: number, w = 640, h = 400): string {
  const hue = (seed * 47) % 50 + 20;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <radialGradient id="g" cx="${20 + (seed * 13) % 60}%" cy="${20 + (seed * 29) % 50}%" r="100%">
      <stop offset="0%" stop-color="hsl(${hue},40%,18%)"/>
      <stop offset="60%" stop-color="#0b0b10"/>
      <stop offset="100%" stop-color="#050507"/>
    </radialGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#g)"/>
  <g opacity="0.2" stroke="${GOLD}" fill="none" stroke-width="1.5">
    ${Array.from({ length: 6 }, (_, i) => {
      const cx = ((seed * (i + 2) * 89) % w);
      const cy = ((seed * (i + 3) * 53) % h);
      const r = 14 + ((seed * (i + 1)) % 42);
      return `<circle cx="${cx}" cy="${cy}" r="${r}"/>`;
    }).join('')}
  </g>
  <text x="50%" y="52%" text-anchor="middle" font-family="Cinzel, Heebo, serif" font-weight="700"
    font-size="${h * 0.09}" letter-spacing="3" fill="${GOLD}" fill-opacity="0.85">${label}</text>
</svg>`;
  return svgDataUri(svg);
}

/** נתיבי תמונות שהמשתמש יכול להעלות ל-public/images — נטענות אוטומטית אם קיימות */
export const IMAGE_PATHS = {
  hero: '/images/hero.jpg',
  logo: '/images/logo.png',
  banner: '/images/banner.jpg',
  season: (n: number) => `/images/seasons/s${n}.jpg`,
  episode: (s: number, e: number) => `/images/episodes/s${s}e${e}.jpg`,
  character: (id: string) => `/images/characters/${id}.jpg`,
  house: (id: string) => `/images/houses/${id}.jpg`,
  location: (id: string) => `/images/locations/${id}.jpg`,
  gallery: (category: string, n: number) => `/images/gallery/${category}/${n}.jpg`,
  heroVideo: '/videos/hero.mp4',
  trailer: '/videos/trailer.mp4',
};
