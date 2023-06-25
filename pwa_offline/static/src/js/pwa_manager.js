odoo.define("pwa_offline.PWAManager", function (require) {
    "use strict";

    var core = require("web.core");
    var config = require("web.config");
    var Widget = require("web.Widget");

    var _t = core._t;
    let deferredPrompt;
    /**
     * @returns {Boolean}
     */
    function isPWAStandalone() {
        return (
            window.navigator.standalone ||
            document.referrer.includes("android-app://") ||
            window.matchMedia("(display-mode: standalone)").matches
        );
    }

    if (isPWAStandalone()) {
        config.device.isMobile = true;
    }

    var PWAManager = Widget.extend({
        /**
         * @override
         */
        init: function () {
            this._super.apply(this, arguments);
            this._isServiceWorkerSupported = "serviceWorker" in navigator;
            if (!this._isServiceWorkerSupported) {
                console.error(
                    _t(
                        "No soporta los Service Worker"
                    )
                );
            } else {
                this._service_worker = navigator.serviceWorker;
                this.registerServiceWorker("/pwa_offline/static/src/js/worker/services-workers.js", {
                    updateViaCache: "none",
                });
            }
        },

        /**
         * @param {String} sw_script
         * @returns {Promise}
         */
        registerServiceWorker: function (sw_script, options) {
            return this._service_worker
                .register(sw_script, options)
                .then(this._onRegisterServiceWorker.bind(this))
                .catch(function (error) {
                    console.log(_t("El Registro del Service Worker falló: "), error);
                });
        },

        /**
         * @returns {Boolean}
         */
        isPWAStandalone: function () {
            return isPWAStandalone();
        },

        /**
         * @private
         * @param {ServiceWorkerRegistration} registration
         */
        _onRegisterServiceWorker: function (registration) {
            console.log(_t("Service Worker Registrado:"), registration);
        },
    });
    return PWAManager;
});
