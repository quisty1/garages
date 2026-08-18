// ── Service Worker: Metall Montage 33 ────────────────

const CACHE_PREFIX = 'mm33-';
const CACHE_VERSION = 'v12';
const PRECACHE_CACHE = `${CACHE_PREFIX}precache-${CACHE_VERSION}`;
const RUNTIME_CACHE = `${CACHE_PREFIX}runtime-${CACHE_VERSION}`;
const CURRENT_CACHES = new Set([PRECACHE_CACHE, RUNTIME_CACHE]);

const SCOPE_URL = new URL(self.registration.scope);
const INDEX_URL = new URL('index.html', SCOPE_URL).href;

// Offline app shell: code plus the immediately visible/installation assets.
// Lazy gallery images remain runtime-only.
const PRECACHE_URLS = [
  'index.html',
  'styles.css',
  'css/tokens.css',
  'css/base.css',
  'css/header.css',
  'css/hero.css',
  'css/sections.css',
  'css/gallery.css',
  'css/workflow-faq.css',
  'css/contact.css',
  'css/overlays.css',
  'site-data.js',
  'js/shared.js',
  'js/theme.js',
  'js/content.js',
  'js/seo.js',
  'js/ui.js',
  'js/pwa.js',
  'js/main.js',
  'manifest.json',
  'favicon.ico',
  'assets/favicon.svg',
  'assets/favicon-48.png',
  'assets/favicon-96.png',
  'assets/apple-touch-icon.png',
  'assets/icon-192.png',
  'assets/icon-192.webp',
  'assets/icon-512.png',
  'assets/icon-512.webp',
  'assets/logo-hero-680.webp',
  'assets/logo-hero.webp',
].map((path) => new URL(path, SCOPE_URL).href);

const NETWORK_FIRST_URLS = new Set(
  [
    'index.html',
    'styles.css',
    'css/tokens.css',
    'css/base.css',
    'css/header.css',
    'css/hero.css',
    'css/sections.css',
    'css/gallery.css',
    'css/workflow-faq.css',
    'css/contact.css',
    'css/overlays.css',
    'site-data.js',
    'js/shared.js',
    'js/theme.js',
    'js/content.js',
    'js/seo.js',
    'js/ui.js',
    'js/pwa.js',
    'js/main.js',
    'manifest.json',
  ].map((path) => new URL(path, SCOPE_URL).href),
);
const PRECACHED_ASSET_URLS = new Set(
  PRECACHE_URLS.filter((url) => !NETWORK_FIRST_URLS.has(url)),
);
const ASSETS_PATH = new URL('assets/', SCOPE_URL).pathname;
const MANIFEST_PATH = new URL('manifest.json', SCOPE_URL).pathname;
const FAVICON_PATH = new URL('favicon.ico', SCOPE_URL).pathname;
const IMAGE_EXTENSION = /\.(?:avif|gif|ico|jpe?g|png|svg|webp)$/i;
const MAX_RUNTIME_ENTRIES = 48;
const NAVIGATION_TIMEOUT_MS = 5000;

// Strip search/hash so UTM and cache-buster query strings share one cache key.
function canonicalCacheKey(input) {
  const url = new URL(typeof input === 'string' ? input : input.url);
  url.search = '';
  url.hash = '';
  return url.href;
}

// Only same-origin 200 OK responses without no-store/private or Vary: * may be cached.
function isCacheable(response) {
  if (
    response.status !== 200 ||
    !['basic', 'default'].includes(response.type)
  ) {
    return false;
  }

  const cacheControl = response.headers.get('Cache-Control') || '';
  const vary = response.headers.get('Vary') || '';
  return (
    !/(?:^|,)\s*(?:no-store|private)\b/i.test(cacheControl) &&
    !vary.split(',').some((value) => value.trim() === '*')
  );
}

// A cache write must never turn a successful network response into a failure.
async function putSafely(cache, cacheKey, response) {
  if (!isCacheable(response)) return false;
  try {
    await cache.put(cacheKey, response.clone());
    return true;
  } catch (error) {
    console.warn('[MM33 SW] Cache write failed.', error);
    return false;
  }
}

// Avoid waiting for the browser's long network timeout on offline navigation.
async function fetchWithTimeout(request, timeoutMs) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(request, { signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
}

// True for the site root and the canonical index.html under this SW scope.
function isAppEntry(url) {
  return (
    url.pathname === SCOPE_URL.pathname ||
    url.pathname === new URL(INDEX_URL).pathname
  );
}

// Only known, same-origin static resources may enter the runtime cache.
function isSafeRuntimeResource(request, url) {
  if (url.pathname === MANIFEST_PATH) {
    return request.destination === 'manifest' || request.destination === '';
  }

  const isAllowedImagePath =
    url.pathname === FAVICON_PATH || url.pathname.startsWith(ASSETS_PATH);

  return (
    isAllowedImagePath &&
    IMAGE_EXTENSION.test(url.pathname) &&
    (request.destination === 'image' || request.destination === '')
  );
}

// Drop the oldest runtime entries once the cache exceeds MAX_RUNTIME_ENTRIES.
async function trimRuntimeCache(cache) {
  const keys = await cache.keys();
  const excess = keys.length - MAX_RUNTIME_ENTRIES;
  if (excess <= 0) return;

  await Promise.all(keys.slice(0, excess).map((key) => cache.delete(key)));
}

// Precache the app shell, then activate this worker immediately.
self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(PRECACHE_CACHE);
      await cache.addAll(PRECACHE_URLS);
      await self.skipWaiting();
    })(),
  );
});

// Delete stale mm33-* caches and take control of open clients.
self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter(
            (key) => key.startsWith(CACHE_PREFIX) && !CURRENT_CACHES.has(key),
          )
          .map((key) => caches.delete(key)),
      );
      await self.clients.claim();
    })(),
  );
});

// Offline fallback for navigations: the one canonical index.html entry.
async function cachedIndex() {
  const cache = await caches.open(PRECACHE_CACHE);
  return cache.match(INDEX_URL);
}

// Documents use the network when it is healthy. A server error or offline
// request falls back to the one canonical index entry, so UTM/query variants
// never create extra cache records.
async function navigationNetworkFirst(request) {
  try {
    const response = await fetchWithTimeout(request, NAVIGATION_TIMEOUT_MS);

    if (response.status >= 500) {
      return (await cachedIndex()) || response;
    }

    if (
      response.ok &&
      isAppEntry(new URL(request.url)) &&
      isCacheable(response)
    ) {
      const cache = await caches.open(PRECACHE_CACHE);
      await putSafely(cache, INDEX_URL, response);
    }

    return response;
  } catch (error) {
    const cached = await cachedIndex();
    if (cached) return cached;
    throw error;
  }
}

// Network-first for the small, explicitly listed app shell only.
async function appShellNetworkFirst(request) {
  const cache = await caches.open(PRECACHE_CACHE);
  const cacheKey = canonicalCacheKey(request);

  try {
    const response = await fetch(request);

    if (response.status >= 500) {
      return (await cache.match(cacheKey)) || response;
    }

    await putSafely(cache, cacheKey, response);

    return response;
  } catch (error) {
    const cached = await cache.match(cacheKey);
    if (cached) return cached;
    throw error;
  }
}

// Return a runtime resource immediately when cached, while refreshing it in
// the background. Cache keys intentionally omit query strings.
function staleWhileRevalidate(
  request,
  event,
  cacheName = RUNTIME_CACHE,
  shouldTrim = true,
) {
  const cacheKey = canonicalCacheKey(request);
  const cachePromise = caches.open(cacheName);
  const updatePromise = cachePromise.then(async (cache) => {
    const response = await fetch(request);
    if (await putSafely(cache, cacheKey, response)) {
      if (shouldTrim) {
        try {
          await trimRuntimeCache(cache);
        } catch (error) {
          console.warn('[MM33 SW] Runtime cache trim failed.', error);
        }
      }
    }
    return response;
  });

  event.waitUntil(
    updatePromise.then(
      () => undefined,
      () => undefined,
    ),
  );

  return cachePromise.then(async (cache) => {
    const cached = await cache.match(cacheKey);
    return cached || updatePromise;
  });
}

// Route GET same-origin requests: navigation, app shell, precached assets, runtime images.
self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  if (request.headers.has('range')) return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === 'navigate' || request.destination === 'document') {
    event.respondWith(navigationNetworkFirst(request));
    return;
  }

  const cacheKey = canonicalCacheKey(request);
  if (NETWORK_FIRST_URLS.has(cacheKey)) {
    event.respondWith(appShellNetworkFirst(request));
    return;
  }

  if (PRECACHED_ASSET_URLS.has(cacheKey)) {
    event.respondWith(
      staleWhileRevalidate(request, event, PRECACHE_CACHE, false),
    );
    return;
  }

  if (isSafeRuntimeResource(request, url)) {
    event.respondWith(staleWhileRevalidate(request, event));
  }
});
