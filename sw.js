// Service Worker CréditTrack PRO — Gestion de cache intelligente & Mises à jour instantanées
const CACHE_VERSION = 'credittrack-v4.9.2-saspay';
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const DYNAMIC_CACHE = `${CACHE_VERSION}-dynamic`;

const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/logo_3d.png',
  '/favicon.ico'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS).catch((err) => {
        console.warn('[SW] Pré-cache partiel ignoré:', err);
      });
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== STATIC_CACHE && key !== DYNAMIC_CACHE) {
            console.log('[SW] Suppression ancien cache obsolète:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);

  if (request.method !== 'GET') return;
  if (url.origin !== self.location.origin) {
    if (url.hostname.includes('fonts.googleapis.com') || url.hostname.includes('fonts.gstatic.com') || url.hostname.includes('unpkg.com')) {
      event.respondWith(staleWhileRevalidate(request, STATIC_CACHE));
    }
    return;
  }

  if (url.pathname.startsWith('/api/') || url.pathname === '/version.json' || url.pathname.includes('/auth/')) {
    event.respondWith(
      fetch(request, { cache: 'no-store' }).catch(() => {
        return new Response(JSON.stringify({ error: 'Réseau indisponible' }), {
          headers: { 'Content-Type': 'application/json' },
          status: 503
        });
      })
    );
    return;
  }

  // HTML / Navigation : NETWORK FIRST STRICT
  if (request.mode === 'navigate' || request.destination === 'document' || url.pathname.endsWith('.html') || url.pathname === '/') {
    event.respondWith(networkFirstWithTimeout(request, DYNAMIC_CACHE, 2500));
    return;
  }

  // JS & CSS avec query string de version : Cache First ou Network First
  if (url.pathname.endsWith('.js') || url.pathname.endsWith('.css')) {
    event.respondWith(networkFirstWithTimeout(request, STATIC_CACHE, 2000));
    return;
  }

  // Images, Icons
  if (request.destination === 'image' || request.destination === 'font' || url.pathname === '/manifest.json') {
    event.respondWith(staleWhileRevalidate(request, STATIC_CACHE));
    return;
  }

  event.respondWith(networkFirstWithTimeout(request, DYNAMIC_CACHE, 3000));
});

async function networkFirstWithTimeout(request, cacheName, timeoutMs = 2500) {
  let timeoutId;
  const timeoutPromise = new Promise((resolve) => {
    timeoutId = setTimeout(async () => {
      const cached = await caches.match(request);
      if (cached) resolve(cached);
    }, timeoutMs);
  });

  try {
    const networkPromise = fetch(request).then(async (response) => {
      clearTimeout(timeoutId);
      if (response && response.status === 200 && response.type === 'basic') {
        const responseClone = response.clone();
        caches.open(cacheName).then((cache) => cache.put(request, responseClone));
      }
      return response;
    });

    return await Promise.race([networkPromise, timeoutPromise]);
  } catch (error) {
    clearTimeout(timeoutId);
    const cachedResponse = await caches.match(request);
    if (cachedResponse) return cachedResponse;
    if (request.mode === 'navigate') {
      const homeCached = await caches.match('/index.html') || await caches.match('/');
      if (homeCached) return homeCached;
    }
    throw error;
  }
}

async function staleWhileRevalidate(request, cacheName) {
  const cached = await caches.match(request);
  const networkFetch = fetch(request).then((response) => {
    if (response && response.status === 200) {
      const responseClone = response.clone();
      caches.open(cacheName).then((cache) => cache.put(request, responseClone));
    }
    return response;
  }).catch(() => null);

  return cached || await networkFetch;
}

self.addEventListener('message', (event) => {
  if (!event.data) return;
  if (event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
