(function () {
    'use strict'

    var CACHE_SHELL = 'pwa-news-shell-v4';
    var CACHE_DATA = 'pwa-news-data-v1';

    var API = 'https://newsapi.org/v2/';
    var FILES_SHELL = [
        '/',
        '/css/core.css',
        '/css/main.css',
        '/js/api.js',
        '/image/placeholder-image.png',
        '/library/jquery-3.3.1.min.js',
        '/library/moment.min.js',
    ];


    self.addEventListener('install', function (event) {
        event.waitUntil(
            self.caches.open(CACHE_SHELL).then(function (cache) {
                    return cache.addAll(FILES_SHELL);
                })
            )        
                
    });

// remover um service worker antigo, não pode deixar as versões antigas(temos que remover as antigas). 
    self.addEventListener('activate', function (event) {
        var cacheList = [CACHE_SHELL, CACHE_DATA];
        console.log("SW - Activate");
        return event.waitUntil(
            self.caches.keys().then(function (cacheName) {
                console.log(cacheName);
                // Usa o primise all para fazer tuudo de uma vez de forma assincrona
                // Obrigatoriamente temos que gerenciar os caches antigos
                // Nunca passe de 3 segundos para iniciar uma aplicação - DICA
                return Promise.all(cacheName.map(function name(params) {
                    if (cacheList.indexOf(params) === -1) {
                        self.caches.delete(cacheName);
                    }
                }))

            })
        )

    });

    self.addEventListener('fetch', function (event) {
        if (event.request.url.indexOf(API) === -1) {
            event.respondWith(
                caches.match(event.request)
                    .then(function (response) {
                        if (response) {
                            return response;
                        }
                        return fetch(event.request);
                    })
            )
        } else {
            event.respondWith(
                // using network first 
                self.fetch(event.request)
                    .then(function (response) {
                        return caches.open(CACHE_DATA)
                            .then(function (cache) {
                                cache.put(event.request.url, response.clone());
                                return response;
                            });
                    }).catch(function (error) {

                        return caches.match(event.request);
                    })
            )
        }
    });

    self.addEventListener('push', function(event) {
        console.log('[Service Worker] Push Received.');
        console.log(`[Service Worker] Push had this data: "${event.data.text()}"`);
        const notificationBody = `${event.data.text()}`;
        const title = 'Push PWA News';
        const options = {
          body: notificationBody,
          icon: 'image/favicon-32x32.png'
        };
        event.waitUntil(self.registration.showNotification(title, options));
      });
    
}());
