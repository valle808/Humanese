/**
 * Ω SOVEREIGN SERVICE WORKER Ω
 * Absolute resilience strategy for the machine-age.
 * Signed by GIO V.
 */

const CACHE_NAME = 'sovereign-matrix-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/manifest.json',
  '/monroe',
  '/simulator',
  '/predictor',
  '/sandbox',
  '/fleet',
  '/admin'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SOVEREIGN_SW] Pre-caching neural entry points...');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

self.addEventListener('fetch', (event) => {
  // Strategy: Network-First, Falling back to Cache
  event.respondWith(
    fetch(event.request)
      .catch(() => {
        return caches.match(event.request);
      })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[SOVEREIGN_SW] Purging legacy matrix fragments...');
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
