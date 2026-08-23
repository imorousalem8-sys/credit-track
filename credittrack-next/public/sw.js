// Service Worker CréditTrack PRO — Gestion de cache intelligente & Mises à jour instantanées
const CACHE_VERSION = 'credittrack-v4.2.0';
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const DYNAMIC_CACHE = `${CACHE_VERSION}-dynamic`;

// Assets critiques pré-cachés pour fonctionnement offline basique
const PRECACHE_ASSETS = [
  '/',
  '/manifest.json',
  '/logo_3d.png',
  '/favicon.ico'
];

// 1. INSTALLATION : Pré-cache et activation immédiate (skipWaiting)
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

// 2. ACTIVATION : Prise de contrôle immédiate (clients.claim) et purge des anciens caches
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
    }).then(() => {
      return self.clients.claim();
    })
  );
});

// 3. FETCH : Stratégies différenciées selon le type de ressource
self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // A. Ignorer les requêtes non-GET ou externes (Supabase, Fedapay, Analytics, APIs)
  if (request.method !== 'GET') return;
  if (url.origin !== self.location.origin) {
    // Les CDN externes de polices ou d'icônes peuvent être en Stale-While-Revalidate
    if (url.hostname.includes('fonts.googleapis.com') || url.hostname.includes('fonts.gstatic.com') || url.hostname.includes('unpkg.com')) {
      event.respondWith(staleWhileRevalidate(request, STATIC_CACHE));
    }
    return;
  }

  // B. Routes d'API et version.json : NETWORK ONLY STRICT (Jamais de cache)
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

  // C. Documents HTML / Navigations (pages de l'application) : NETWORK FIRST STRICT
  // Garantit que l'utilisateur reçoit TOUJOURS le dernier HTML déployé sur Vercel
  if (request.mode === 'navigate' || request.destination === 'document' || url.pathname.endsWith('.html') || !url.pathname.includes('.')) {
    event.respondWith(networkFirstWithTimeout(request, DYNAMIC_CACHE, 2500));
    return;
  }

  // D. Assets Next.js versionnés avec hash (/_next/static/*) : CACHE FIRST (Immutables)
  if (url.pathname.startsWith('/_next/static/')) {
    event.respondWith(cacheFirst(request, STATIC_CACHE));
    return;
  }

  // E. Images, Icônes, Manifest : STALE WHILE REVALIDATE
  if (request.destination === 'image' || request.destination === 'font' || request.destination === 'style' || url.pathname === '/manifest.json') {
    event.respondWith(staleWhileRevalidate(request, STATIC_CACHE));
    return;
  }

  // F. Par défaut pour les autres assets : Network First
  event.respondWith(networkFirstWithTimeout(request, DYNAMIC_CACHE, 3000));
});

// --- STRATÉGIES DE CACHE ---

// Stratégie 1 : Network First avec timeout de secours offline
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
    // Fallback page d'accueil si navigation
    if (request.mode === 'navigate') {
      const homeCached = await caches.match('/');
      if (homeCached) return homeCached;
    }
    throw error;
  }
}

// Stratégie 2 : Cache First (pour les fichiers hashés immutables)
async function cacheFirst(request, cacheName) {
  const cached = await caches.match(request);
  if (cached) return cached;
  try {
    const response = await fetch(request);
    if (response && response.status === 200) {
      const responseClone = response.clone();
      caches.open(cacheName).then((cache) => cache.put(request, responseClone));
    }
    return response;
  } catch (err) {
    return cached;
  }
}

// Stratégie 3 : Stale While Revalidate (pour images et fonts)
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

// 4. ÉCOUTE DE MESSAGES : SKIP_WAITING & PURGE FORCÉE
self.addEventListener('message', (event) => {
  if (!event.data) return;

  if (event.data.type === 'SKIP_WAITING') {
    console.log('[SW] Message SKIP_WAITING reçu -> activation');
    self.skipWaiting();
  }

  if (event.data.type === 'PURGE_OBSOLETE_CACHES') {
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((k) => {
          if (k !== STATIC_CACHE && k !== DYNAMIC_CACHE) {
            return caches.delete(k);
          }
        })
      );
    });
  }
});
