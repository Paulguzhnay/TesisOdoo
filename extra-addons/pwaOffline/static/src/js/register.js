if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
        navigator.serviceWorker.register('/sw.js')
            .then(function (registration) {
                // Registration was successful
                console.log('ServiceWorker registro exitoso', registration.scope);
            }, function (err) {
                // registration failed :(
                console.log('ServiceWorker registro fallido: ', err);
            }).catch(function (err) {
            console.log(err)
        });
    });
} else {
    console.log('service worker no esta trabajando');
}