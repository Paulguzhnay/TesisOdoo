let urls_to_cache;
let PWA_CACHE_NAME='cache-v2';


self.addEventListener('activate', event => {
    const cacheWhitelist = [PWA_CACHE_NAME];
    event.waitUntil(
        caches.keys()
            .then(keyList =>
                Promise.all(keyList.map(key => {
                    if (!cacheWhitelist.includes(key)) {
                        console.debug('Deleting cache: ' + key)
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
            return cache.addAll([
                '/',
                'pos2.js',
                //'xml/view2.xml',
               // '/pos2.js'

              //  '/addons/point_of_sale/static/src/js'
            ]);
        }),
    );
    self.skipWaiting();
});
/*
self.addEventListener('fetch', function (event) {
    if (event.request.cache === 'only-if-cached' && event.request.mode !== 'same-origin') {
        return;
    }
    event.respondWith(
        caches.open(PWA_CACHE_NAME).then(function (cache) {
            let url = event.request.url;
            return cache.match(event.request).then(function (cachedResponse) {
                if (cachedResponse && cachedResponse.ok) {
                    // console.log('returning cached response:', url)
                    return cachedResponse
                }
                return fetch(event.request).then(function (networkResponse) {
                    if (networkResponse && networkResponse.ok) {
                        // console.log('returning network response:', url)
                        if (
                            //url.includes('/web/image') ||
                            //url.includes('/web/assets') ||
                            //url.includes('/static/src')
                        ) {
                            // console.log('cached:', url);
                            cache.add(event.request);
                        }
                    }
                    return networkResponse
                }).catch(function () {
                    console.debug('returning cached offline page:', url);
                    return cache.match('/pwa_offline_page.html');
                })
            });
        })
    );
}); */
