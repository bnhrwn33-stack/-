/* Service Worker — מטמון אפליקציה בסיסי לטעינה מהירה ועבודה כ-PWA */
const CACHE = 'got-app-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE).then((c) => c.addAll(['./', './index.html'])));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))),
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  // רק קבצי האפליקציה עצמה — לא וידאו/דרייב
  if (event.request.method !== 'GET' || url.origin !== location.origin) return;
  if (url.pathname.startsWith('/videos/')) return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      const network = fetch(event.request)
        .then((res) => {
          if (res.ok) {
            const clone = res.clone();
            caches.open(CACHE).then((c) => c.put(event.request, clone));
          }
          return res;
        })
        .catch(() => cached);
      return cached ?? network;
    }),
  );
});
