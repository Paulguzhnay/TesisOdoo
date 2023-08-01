{
    "name": "PWA Offline POS",
    "version": "16.0",
    "category": "PWA",
    "author": "Paul Guzhñay - Joseph Reinoso",
    "license": "LGPL-3",
    "application": True,
    "installable": True,
    "depends": ["base", "web", "mail", "point_of_sale"],
    "data": [
        "views/templates.xml",
        'data/libraries.xml',
    ],
    "assets": {
        'web.assets_backend': [

        ],
        'point_of_sale.assets': [
            '/pwa_offline/static/src/js/pwa_manager.js',
            '/pwa_offline/static/src/js/webclient.js',

            '/pwa_offline/static/src/css/pos.css',
            # -----------------------------------------------------------------------------------------
            '/pwa_offline/static/src/js/OfflineOrderInfo.js',
            '/pwa_offline/static/src/js/OfflineOrderManagementButton.js',
            '/pwa_offline/static/src/js/OfflineOrderManagementScreen.js',
            '/pwa_offline/static/src/js/OrderLine.js',
            # -----------------------------------------------------------------------------------------
            '/pwa_offline/static/src/js/OfflineClientInfo.js',
            '/pwa_offline/static/src/js/OfflineClientManagementButton.js',
            '/pwa_offline/static/src/js/OfflineClientManagementScreen.js',
            '/pwa_offline/static/src/js/ClientLines.js',
            # ----------------------------------------------------------------------------------------
            '/pwa_offline/static/src/js/modelsClients.js',
            '/pwa_offline/static/src/js/OfflineClientRegistration.js',
            # -----------------------------------------------------------------------------------------
            '/pwa_offline/static/src/js/lib/idb-keyval.js',
            '/pwa_offline/static/src/js/lib/indexedDB.js',
            '/pwa_offline/static/src/js/models.js',
            '/pwa_offline/static/src/js/PosWebClient.js',
            # -----------------------------------------------------------------------------------------
            '/pwa_offline/static/src/xml/pos.xml',
            '/pwa_offline/static/src/xml/pos_Customer.xml',
            '/pwa_offline/static/src/xml/PartnerDetailsEdit.xml',

        ],
        'web.assets_qweb': [
            '/pwa_offline/static/src/js/removeDB.js',
            '/pwa_offline/static/src/js/lib/idb-keyval.js',
            '/pwa_offline/static/src/js/lib/indexedDB.js',
            '/pwa_offline/static/src/js/PosWebClient.js',

        ],
    },
    "images": ["static/description/pwa.png"],
}
