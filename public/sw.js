const CACHE_NAME = 'life-dev-shell-v1';

const CORE_ASSETS = ['/', '/manifest.json', '/logo.png'];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(CORE_ASSETS)));
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cached => {
      return cached || fetch(event.request);
    }),
  );
});
