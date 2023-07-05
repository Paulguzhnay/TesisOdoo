odoo.define('pwa_offline.web_client', function (require) {
    'use strict';
    const WebClient = require('web.web_client');
    async function registroSW() {
        if (!('serviceWorker' in navigator)) {
            return;
        }
        try {
            var registro = await navigator.serviceWorker.register('/pos-cache', {scope: '/pos/'});
        } catch (error) {
            console.error(error);
        }
    }
    async function inicializar_App(webClient) {
        await registroSW();
    }
    inicializar_App(WebClient);
    return WebClient;
});
