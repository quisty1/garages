/* ── Service Worker: Металл Монтаж 33 ───────────────── */

/** Версия кэша — инкрементировать при изменении PRECACHE или стратегий. */
const CACHE = 'mm33-v10';

/**
 * Файлы для precache при install.
 * Критичные для первого экрана: HTML, CSS, JS, логотипы, иконки PWA.
 * Превью каруселей (*-560.webp) и полноразмерные фото — cache-first при первом запросе.
 */
const PRECACHE = [
  './',
  './index.html',
  './styles.css',
  './main.js',
  './manifest.json',
  './favicon.ico',
  './assets/favicon.svg',
  './assets/favicon-48.png',
  './assets/favicon-96.png',
  './assets/apple-touch-icon.png',
  './assets/logo-48.webp',
  './assets/logo-44.webp',
  './assets/logo-hero-680.webp',
  './assets/logo-og.webp',
  './assets/icon-192.webp',
  './assets/icon-512.webp',
  './assets/icon-192.png',
  './assets/icon-512.png',
];

/** Типы запросов, для которых применяется network-first. */
const NETWORK_FIRST_DESTINATIONS = new Set(['document', 'script', 'style']);

/**
 * HTML, CSS, JS — network-first: свежая версия при наличии сети,
 * fallback на кэш при офлайне.
 * Изображения и прочее — cache-first (см. обработчик fetch).
 */
function shouldUseNetworkFirst(request) {
  if (NETWORK_FIRST_DESTINATIONS.has(request.destination)) return true;
  return /\.(?:html?|css|js)$/.test(new URL(request.url).pathname);
}

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(PRECACHE)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)),
        ),
      ),
  );
  self.clients.claim();
});

/** Network-first: сеть → обновление кэша; при ошибке — из кэша. */
async function networkFirst(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await caches.match(request);
    if (cached) return cached;
    throw new Error('Offline and not in cache');
  }
}

/** Cache-first: кэш → сеть; при успехе — дополнение кэша. */
async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  if (response.ok) {
    const cache = await caches.open(CACHE);
    cache.put(request, response.clone());
  }
  return response;
}

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    shouldUseNetworkFirst(event.request)
      ? networkFirst(event.request)
      : cacheFirst(event.request),
  );
});
