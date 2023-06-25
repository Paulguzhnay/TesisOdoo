if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/pwaOffline/static/src/js/service-worker.js')
        .then(function(registration) {
            console.log('Service worker funcinonando:', registration);
        })
        .catch(function(error) {
            console.log('Service worker FALLO:', error);
        });

}



