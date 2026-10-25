// Expandia HQ home-screen app (version 47): network first, so every new version of the game loads as soon as it is
// published; the last copy that loaded is kept so the app still opens without a connection.
const CACHE = 'expandia-hq-app';
self.addEventListener('install', e => { self.skipWaiting(); });
self.addEventListener('activate', e => { e.waitUntil(self.clients.claim()); });
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  e.respondWith((async () => {
    try {
      const res = await fetch(req, { cache: 'no-store' });
      if (res.ok) { const c = await caches.open(CACHE); c.put(req.mode === 'navigate' ? './' : req, res.clone()); }
      return res;
    } catch (err) {
      const c = await caches.open(CACHE);
      return (await c.match(req.mode === 'navigate' ? './' : req)) || (await c.match('./')) || Response.error();
    }
  })());
});
