odoo.define("pwa_offline.PWA", function (require) {
    "use strict";

    const OdooClass = require("web.Class");

    const PWA = OdooClass.extend({
        init: function (params) {
            this._sw_version = params.sw_version;
        },
        /**
         * @returns {Promise}
         */
        start: function () {
            return Promise.resolve();
        },

        /**
         * @returns {Promise}
         */
        installWorker: function () {
            return Promise.resolve();
        },

        /**
         * @returns {Promise}
         */
        activateWorker: function (forced) {
            return Promise.resolve();
        },

        /**
         * @returns {Promise}
         */
        processRequest: function (request) {
            return fetch(request);
        },
    });

    return PWA;
});
