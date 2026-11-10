const CACHE_NAME = 'kaspi-id-single-folder-v28';
const CORE_FILES = [
  './',
  './index.html',
  './style.css?v=20261110-28',
  './script.js?v=20261110-28',
  './pwa.js?v=20261110-28',
  './manifest.webmanifest',
  './favicon.png',
  './apple-touch-icon.png',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_FILES)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== self.location.origin) return;

  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);

    if (request.mode === 'navigate') {
      try {
        const response = await fetch(request);
        if (response.ok) await cache.put(request, response.clone());
        return response;
      } catch {
        return (await cache.match(request)) || (await cache.match('./index.html'));
      }
    }

    try {
      const response = await fetch(request);
      if (response.ok && url.pathname.startsWith(new URL('./', self.registration.scope).pathname)) {
        await cache.put(request, response.clone());
      }
      return response;
    } catch {
      const cached = await cache.match(request);
      if (cached) return cached;
      throw new Error('Offline resource is not cached');
    }
  })());
});
