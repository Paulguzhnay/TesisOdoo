odoo.define("pwa_offline.pwa_launch", function (require) {
    "use strict";
    var core = require("web.core");
    var PWAManager = require("pwa_offline.PWAManager");

    core.bus.on("web_client_ready", null, function () {
        this.pwa_manager = new PWAManager(this);
        const def = this.pwa_manager.start();
        return Promise.all([def]);
    });
});
