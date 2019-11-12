const cacheName = 'pwa-conf-v1';
const staticAssets = ['./', './index.html', './images/login_bg.png', './css/stylesheet.css','./lib/fontawesome/css/all.min.css','./scripts/app.js','./images/icons/icon-128x128.png','./images/icons/icon-144x144.png','./images/icons/icon-152x152.png','./images/icons/icon-192x192.png','./images/icons/icon-384x384.png','./images/icons/icon-512x512.png','./images/icons/icon-72x72.png','./images/icons/icon-96x96.png'];

self.addEventListener('install', async event => {
    const cache = await caches.open(cacheName);
    await cache.addAll(staticAssets);
});
self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', event => {
    const req = event.request;

    if (/.*(json)$/.test(req.url)) {
        event.respondWith(networkFirst(req));
    } else {
        event.respondWith(cacheFirst(req));
    }
});

async function cacheFirst(req) {
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(req);
    return cachedResponse || networkFirst(req);
}

async function networkFirst(req) {
    const cache = await caches.open(cacheName);
    try {
        const fresh = await fetch(req);
        cache.put(req, fresh.clone());
        return fresh;
    } catch (e) {
        const cachedResponse = await cache.match(req);
        return cachedResponse;
    }
}