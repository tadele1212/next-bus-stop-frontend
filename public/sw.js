const CACHE_NAME = 'bus-tracker-v1';

// Add Vite-specific files to cache
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon.svg',
  '/src/main.jsx',
  '/@vite/client',
  '/@react-refresh'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .catch(() => {
        return caches.match(event.request)
          .then(response => {
            if (response) {
              return response;
            }
            if (event.request.mode === 'navigate') {
              return caches.match('/');
            }
            return new Response('Not found', {
              status: 404,
              statusText: 'Not found'
            });
          });
      })
  );
}); 