// Service Worker DÉSACTIVÉ — Ce fichier désinstalle le SW automatiquement
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.map(k => caches.delete(k))))
      .then(() => self.clients.claim())
      .then(() => {
        // Force reload de tous les clients pour utiliser la nouvelle version
        return self.clients.matchAll({ type: 'window' });
      })
      .then(clients => {
        clients.forEach(client => client.navigate(client.url));
      })
  );
});
// Passe tout en réseau direct, aucun cache
self.addEventListener('fetch', event => {
  event.respondWith(fetch(event.request, { cache: 'reload' }));
});
