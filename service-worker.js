const CACHE_NAME = 'kaspi-id-v1';
const ASSETS = [
  './',
  './v2/',
  './index.html',
  './style.css',
  './script.js',
  './060131500086-20250603111642292.pdf',
  './afina.jpg',
  './qr-icon.jpeg',
  './send-icon.jpeg',
  './qr_4783412.png',
  './pwa.js',
  './manifest.webmanifest',
  './favicon.png',
  './apple-touch-icon.png',
  './icon-192.png',
  './icon-512.png',
  './v2/index.html',
  './v2/style.css',
  './v2/script.js',
  './v2/udost_ai.jpg',
  './v2/qr-icon.jpeg',
  './v2/send-icon.jpeg',
  './v2/qr_4783412.png',
  './v2/060131500086-20250603111642292.pdf'
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
    ))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});
