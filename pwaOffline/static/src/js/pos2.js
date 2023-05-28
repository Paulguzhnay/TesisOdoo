odoo.define('pwaOffline', function (require) {
    "use strict";

    var PaymentScreen = require('point_of_sale.screens').PaymentScreen;

    PaymentScreen.include({
        update_payment_summary: function () {
            // Tu lógica personalizada aquí
            // ...
            this._super(); // Llama a la implementación original
        },
    });

    return PaymentScreen;
});
