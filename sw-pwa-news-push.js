( function () {
  'use strict';


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
})();
