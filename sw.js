const CACHE_NAME = 'true-offline-music-v2000';
const ASSETS = [
  './',
  'index.html',
  'manifest.json'
];

// Instantly force installation and cache all core layout shells
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    }).then(() => {
      return self.skipWaiting(); // Forces the new worker to take over instantly
    })
  );
});

// Clean up old broken cache remnants automatically
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => {
      return self.clients.claim(); // Instantly activates the offline stream link
    })
  );
});

// Cache-First network proxy strategy: Always load from local storage first!
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse; // Serves file instantly from device drive with 0% internet
      }
      return fetch(e.request);
    })
  );
});
