(function () {
  'use strict';

  var swPush;
  var publicKey = "BCA_sy3hTD11GN3BYHzuci4XO0vi3rsD71bDZQXB32_LfAaffiPt8oOE31MNkiHKvPTIIr0w2nUCVfsatn6WFgQ";

  if ('serviceWorker' in navigator && 'PushManager' in window) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('sw-pws-news.js').then(function (swRegister) {
        swPush = swRegister;
        console.log('Service Worker is registered', swRegister);
            getSubscription();
          });
      });
  } else {
    console.warn('Push messaging is not supported');
  }

  function getSubscription() {
      if (swPush) {
          swPush.pushManager.getSubscription().then(function (subscription) {
            if (subscription) {
                   console.log("User is subscribed");
            } else {
                  console.log("User is NOT subscribed");
                  registerUser();
            }      

        });
      }
  }


  function registerUser() {
    const applicationServerKey = urlB64ToUint8Array(publicKey);
    swPush.pushManager.subscribe({userVisibleOnly: true,
      applicationServerKey: applicationServerKey
    }).then(function (subscription) {
          console.log('User is subscribed.');
          console.log('=>>>>>>>>>>>>>', JSON.stringify(subscription));
    }).catch(function(err) {
        console.log('Failed to subscribe the user: ', err);
    }); 

  }

  function urlB64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, '+')
      .replace(/_/g, '/');
  
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
  
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }





}

)();
