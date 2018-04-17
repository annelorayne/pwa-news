(function () {
    'use strict';

    var eventInstall;
    var btInstall = $("#bt-install");
    window.addEventListener('beforeinstallprompt', function (event) {
        console.log('beforeinstallprompt >>> event');
        eventInstall = event; // captura o evento 
        event.preventDefault(); 
        btInstall.show();
    });

    btInstall.click(function () {
        if (eventInstall) {
            eventInstall.prompt(); // mostra a permissão de instalação 
            // tratar a escolha do usuário 
            eventInstall.userChoice.then(function (choiceResult) {
                if (choiceResult.outcome == "dismissed") {
                    alert("A aplicação não foi instalada");
                } else {
                    alert("A aplicação foi instalada com sucesso"); 
                }
            });
            eventInstall = null;
            btInstall.hide();
        }
    });

})();