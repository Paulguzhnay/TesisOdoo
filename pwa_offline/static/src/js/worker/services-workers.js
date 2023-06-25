let urls_to_cache = [
                '/',
                "/web/static/src/core/assets.js",
                "/web/static/lib/underscore/underscore.js",
                "/pwa_offline/static/src/js/worker/jquery-sw-compat.js",
                "/web/static/src/legacy/js/promise_extension.js",
                "/web/static/src/boot.js",
                "/web/static/src/legacy/js/core/class.js",
                "/pwa_offline/static/src/js/worker/pwa.js",

];
let PWA_CACHE_NAME ='cache-odoo';


self.addEventListener('activate', event => {
    const cacheWhitelist = [PWA_CACHE_NAME];
    event.waitUntil(
        caches.keys()
            .then(keyList =>
                Promise.all(keyList.map(key => {
                    if (!cacheWhitelist.includes(key)) {
                        console.debug('Eliminar Cache: ' + key)
                        return caches.delete(key);
                    }
                }))
            )
    );
    self.clients.claim();
});

self.addEventListener('install', function (event) {
    event.waitUntil(
        caches.open(PWA_CACHE_NAME).then(function (cache) {
            return cache.addAll(urls_to_cache);
        }),
    );
    self.skipWaiting();
});

self.addEventListener('fetch', function (event) {
    if (event.request.cache === 'only-if-cached' && event.request.mode !== 'same-origin') {
        return;
    }
    event.respondWith(
        caches.open(PWA_CACHE_NAME).then(function (cache) {
            let url = event.request.url;
            return cache.match(event.request).then(function (cachedResponse) {
                if (cachedResponse && cachedResponse.ok) {
                    return cachedResponse
                }
                return fetch(event.request).then(function (networkResponse) {
                    if (networkResponse && networkResponse.ok) {
                        if (
                            url.includes('/web/image') ||
                            url.includes('/web/assets') ||
                            url.includes('/static/src')
                        ) {
                            cache.add(event.request);
                        }
                    }
                    return networkResponse
                }).catch(function () {
                    console.debug('returning cached offline page:', url);
                    return cache.match('/pwa_offline/manifest.webmanifest');
                })
            });
        })
    );
});


