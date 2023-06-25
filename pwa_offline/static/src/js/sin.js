window.addEventListener('offline', function() {
  console.log('No hay conexión a Internet. Refrescando Odoo 16 con Service Worker...');
  if ('serviceWorker' in navigator && 'SyncManager' in window) {
    navigator.serviceWorker.ready.then(function(registration) {
      return registration.sync.register('refresh');
    }).catch(function(error) {
      console.log('Error al registrar la sincronización:', error);
    });
  }
});