// ── Service Worker: Metall Montage 33 (Next.js static export) ────────────────

const CACHE_PREFIX = 'mm33-';
// Replaced after every production build with a hash of the generated shell.
const CACHE_VERSION = 'v22-__BUILD_HASH__';
const PRECACHE_CACHE = `${CACHE_PREFIX}precache-${CACHE_VERSION}`;
const RUNTIME_CACHE = `${CACHE_PREFIX}runtime-${CACHE_VERSION}`;
const CURRENT_CACHES = new Set([PRECACHE_CACHE, RUNTIME_CACHE]);
// Keep one previous generation so open tabs survive FTP deploys that drop old hashes.
const MAX_CACHE_GENERATIONS = 2;

const SCOPE_URL = new URL(self.registration.scope);
const INDEX_URL = new URL('index.html', SCOPE_URL).href;

// Filled by scripts/patch-sw-precache.mjs after `next build` (hashed /_next JS+CSS).
const NEXT_SHELL_FILES = [];

// Offline app shell: stable public assets + build-specific Next shell chunks.
const PRECACHE_URLS = [
  './',
  'index.html',
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
  'assets/garage-project-8-8-v2-560.webp',
  'assets/garage-project-8-8-v2-960.webp',
  'assets/garage-project-8-8-v2.webp',
  ...NEXT_SHELL_FILES,
].map((path) => new URL(path, SCOPE_URL).href);

const NETWORK_FIRST_URLS = new Set(
  ['./', 'index.html', 'manifest.json'].map(
    (path) => new URL(path, SCOPE_URL).href,
  ),
);

const ASSETS_PATH = new URL('assets/', SCOPE_URL).pathname;
const NEXT_STATIC_PATH = new URL('_next/static/', SCOPE_URL).pathname;
const MANIFEST_PATH = new URL('manifest.json', SCOPE_URL).pathname;
const FAVICON_PATH = new URL('favicon.ico', SCOPE_URL).pathname;
const IMAGE_EXTENSION = /\.(?:avif|gif|ico|jpe?g|png|svg|webp)$/i;
const MAX_RUNTIME_ENTRIES = 48;
const NAVIGATION_TIMEOUT_MS = 5000;

const PRECACHED_ASSET_URLS = new Set(
  PRECACHE_URLS.filter((url) => {
    if (NETWORK_FIRST_URLS.has(url)) return false;
    return !new URL(url).pathname.startsWith(NEXT_STATIC_PATH);
  }),
);

function canonicalCacheKey(input) {
  const url = new URL(typeof input === 'string' ? input : input.url);
  url.search = '';
  url.hash = '';
  return url.href;
}

function isCacheable(response) {
  // Skip opaque/error responses and anything marked no-store / private / Vary:*.
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

async function fetchWithTimeout(request, timeoutMs) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(request, { signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
}

function isAppEntry(url) {
  return (
    url.pathname === SCOPE_URL.pathname ||
    url.pathname === new URL(INDEX_URL).pathname
  );
}

function isNextStatic(url) {
  return url.pathname.startsWith(NEXT_STATIC_PATH);
}

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

async function trimRuntimeCache(cache) {
  const keys = await cache.keys();
  const excess = keys.length - MAX_RUNTIME_ENTRIES;
  if (excess <= 0) return;
  await Promise.all(keys.slice(0, excess).map((key) => cache.delete(key)));
}

async function precacheUrls(cache, urls) {
  // Prefer per-URL puts over addAll: one failure must not abort the whole install.
  await Promise.all(
    urls.map(async (url) => {
      try {
        const response = await fetch(url, { cache: 'reload' });
        if (!(await putSafely(cache, url, response))) {
          console.warn('[MM33 SW] Precache skipped non-cacheable URL.', url);
        }
      } catch (error) {
        console.warn('[MM33 SW] Precache failed for URL.', url, error);
      }
    }),
  );
}

async function matchInOwnCaches(cacheKey) {
  const keys = await caches.keys();
  for (const key of keys) {
    if (!key.startsWith(CACHE_PREFIX)) continue;
    const cache = await caches.open(key);
    const hit = await cache.match(cacheKey);
    if (hit) return hit;
  }
  return undefined;
}

function sortNewestFirst(names) {
  return [...names].sort((a, b) => b.localeCompare(a));
}

async function deleteStaleCaches() {
  const keys = await caches.keys();
  const ours = keys.filter((key) => key.startsWith(CACHE_PREFIX));
  const precacheKeys = sortNewestFirst(
    ours.filter((key) => key.includes('precache-')),
  );
  const runtimeKeys = sortNewestFirst(
    ours.filter((key) => key.includes('runtime-')),
  );
  const retain = new Set([
    ...precacheKeys.slice(0, MAX_CACHE_GENERATIONS),
    ...runtimeKeys.slice(0, MAX_CACHE_GENERATIONS),
    ...CURRENT_CACHES,
  ]);

  await Promise.all(
    ours.filter((key) => !retain.has(key)).map((key) => caches.delete(key)),
  );
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(PRECACHE_CACHE);
      await precacheUrls(cache, PRECACHE_URLS);
      await self.skipWaiting();
    })(),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      await deleteStaleCaches();
      await self.clients.claim();
    })(),
  );
});

async function cachedIndex() {
  const root = new URL('./', SCOPE_URL).href;
  // Some static servers redirect /index.html to /. A redirected cached response
  // cannot be returned for a navigation request in Chromium, so prefer the
  // non-redirected scope root. Search current + previous generations.
  return (
    (await matchInOwnCaches(root)) ||
    (await matchInOwnCaches(INDEX_URL))
  );
}

async function navigationNetworkFirst(request) {
  const cache = await caches.open(PRECACHE_CACHE);
  const cacheKey = canonicalCacheKey(request);
  const fallback = async () =>
    (await matchInOwnCaches(cacheKey)) ||
    (isAppEntry(new URL(request.url)) ? await cachedIndex() : undefined);
  try {
    const response = await fetchWithTimeout(request, NAVIGATION_TIMEOUT_MS);

    if (response.status >= 500) {
      return (await fallback()) || response;
    }

    if (response.ok && isCacheable(response)) {
      await putSafely(cache, cacheKey, response);
    }

    return response;
  } catch (error) {
    const cached = await fallback();
    if (cached) return cached;
    throw error;
  }
}

async function appShellNetworkFirst(request) {
  const cache = await caches.open(PRECACHE_CACHE);
  const cacheKey = canonicalCacheKey(request);

  try {
    const response = await fetch(request);

    if (response.status >= 500) {
      return (await matchInOwnCaches(cacheKey)) || response;
    }

    await putSafely(cache, cacheKey, response);
    return response;
  } catch (error) {
    const cached = await matchInOwnCaches(cacheKey);
    if (cached) return cached;
    throw error;
  }
}

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
    const cached =
      (await cache.match(cacheKey)) || (await matchInOwnCaches(cacheKey));
    return cached || updatePromise;
  });
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  // Partial/media range requests must go to the network (cache can't splice).
  if (request.headers.has('range')) return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === 'navigate' || request.destination === 'document') {
    event.respondWith(navigationNetworkFirst(request));
    return;
  }

  const cacheKey = canonicalCacheKey(request);
  // HTML shell + hashed Next chunks prefer fresh network, cache as fallback.
  if (NETWORK_FIRST_URLS.has(cacheKey) || isNextStatic(url)) {
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
