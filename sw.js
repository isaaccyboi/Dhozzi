const CACHE_NAME = 'dhozzi-cache-v1';
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/index.tsx',
  '/manifest.json',
  '/icon.svg',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Opened cache and precaching assets');
      return cache.addAll(PRECACHE_ASSETS);
    }).catch(err => {
        console.error('Failed to pre-cache assets:', err);
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', (event) => {
  // We only want to cache GET requests.
  if (event.request.method !== 'GET') {
    return;
  }
  
  // For requests to Google Fonts, use a network-first strategy.
  if (event.request.url.startsWith('https://fonts.googleapis.com') || event.request.url.startsWith('https://fonts.gstatic.com')) {
      event.respondWith(
          caches.open(CACHE_NAME).then(async (cache) => {
              try {
                  const networkResponse = await fetch(event.request);
                  // Clone the response because it's a stream and can only be consumed once.
                  cache.put(event.request, networkResponse.clone());
                  return networkResponse;
              } catch (error) {
                  // If network fails, try to get it from the cache.
                  const cachedResponse = await cache.match(event.request);
                  return cachedResponse || Response.error();
              }
          })
      );
      return;
  }
  
  // For all other GET requests, use a cache-first strategy.
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request).then((networkResponse) => {
        // Only cache successful responses and ignore chrome-extension requests.
        if (networkResponse && networkResponse.status === 200 && !event.request.url.startsWith('chrome-extension://')) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      }).catch(error => {
          console.error("Fetch failed, likely due to being offline.", error);
          // The browser will handle the error for the failed fetch.
      });
    })
  );
});
