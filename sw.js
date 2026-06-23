const CACHE = 'mm33-v5';

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
  './assets/icon-192.webp',
  './assets/icon-512.webp',
  './assets/icon-192.png',
  './assets/icon-512.png',
];

const NETWORK_FIRST_DESTINATIONS = new Set(['document', 'script', 'style']);

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
