const CACHE_NAME = 'mason-blog-v20260612105023';
const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/assets/css/custom.css',
    '/assets/js/core-theme.js',
    '/assets/js/core-header.js',
    '/assets/js/core-footer.js',
    '/assets/js/core-taxonomy.js',
    '/assets/js/core-articles-data.js',
    '/assets/js/app-knowledge-data.js',
    '/assets/js/ui-toc-responsive.js',
    '/assets/js/ui-toc-desktop.js',
    '/assets/js/instantpage.js'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                // Use addAll safely - if some files are missing, it won't crash the whole worker
                return Promise.allSettled(
                    ASSETS_TO_CACHE.map(url => cache.add(url).catch(err => console.warn('SW Cache error for', url, err)))
                );
            })
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((name) => {
                    if (name !== CACHE_NAME) {
                        return caches.delete(name);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', (event) => {
    // Cache-First Strategy for assets, Network-First for HTML/content
    if (event.request.method !== 'GET') return;
    
    const url = new URL(event.request.url);
    if (url.pathname.startsWith('/assets/') || url.pathname.startsWith('/vendor/')) {
        event.respondWith(
            caches.match(event.request).then((response) => {
                return response || fetch(event.request).then((fetchRes) => {
                    return caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, fetchRes.clone());
                        return fetchRes;
                    });
                });
            })
        );
    } else {
        // Network first for HTML
        event.respondWith(
            fetch(event.request).catch(() => caches.match(event.request))
        );
    }
});
