if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/pwaOffline/static/src/js/service-worker.js')
        .then(function(registration) {
            console.log('Service worker registered:', registration);
        })
        .catch(function(error) {
            console.log('Service worker registration failed:', error);
        });
}