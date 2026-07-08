/** דירוגי פרקים (בהשראת דירוגי הקהל ב-IMDb, סולם 1–10) */

const R: number[][] = [
  // עונה 1
  [9.0, 8.7, 8.6, 8.7, 9.0, 9.1, 9.2, 8.9, 9.6, 9.4],
  // עונה 2
  [8.7, 8.4, 8.7, 8.6, 8.7, 8.9, 8.8, 8.6, 9.7, 9.4],
  // עונה 3
  [8.7, 8.5, 8.8, 9.5, 8.9, 8.8, 8.6, 8.9, 9.9, 9.1],
  // עונה 4
  [9.0, 9.7, 8.8, 8.7, 8.6, 9.7, 9.0, 9.7, 9.6, 9.6],
  // עונה 5
  [8.4, 8.4, 8.4, 8.6, 8.5, 8.0, 8.8, 9.8, 9.4, 9.0],
  // עונה 6
  [8.4, 9.3, 8.6, 9.0, 9.7, 8.3, 8.5, 8.3, 9.9, 9.9],
  // עונה 7
  [8.5, 8.8, 9.1, 9.7, 8.7, 9.0, 9.4],
  // עונה 8
  [7.5, 7.8, 7.5, 5.5, 6.0, 4.0],
];

export function episodeRating(season: number, episode: number): number | undefined {
  return R[season - 1]?.[episode - 1];
}

export function topRatedKeys(count: number): { season: number; episode: number; rating: number }[] {
  const all: { season: number; episode: number; rating: number }[] = [];
  R.forEach((eps, si) => eps.forEach((r, ei) => all.push({ season: si + 1, episode: ei + 1, rating: r })));
  return all.sort((a, b) => b.rating - a.rating).slice(0, count);
}
