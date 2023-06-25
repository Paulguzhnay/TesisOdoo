# -*- coding: utf-8 -*-
{
    "name": "PWA Offline POS",
    "version": "16.0",
    "category": "PWA",
    "author": "Paul Guzhñay - Joseph Reinoso",
    "license": "LGPL-3",
    "application": True,
    "installable": True,
    "depends": ["base","web", "mail"],
    "data": [
        "views/templates.xml",
        #"views/views.xml",
        ],
    "assets": {
        "web.assets_backend": [
            "/pwa_offline/static/src/js/pwa_manager.js",
            "/pwa_offline/static/src/js/webclient.js",
        ],
        'point_of_sale.assets': [
            '/pwa_offline/static/src/css/pos.css',
#-----------------------------------------------------------------------------------------
            '/pwa_offline/static/src/js/OfflineOrderInfo.js',
            '/pwa_offline/static/src/js/OfflineOrderManagementButton.js',
            '/pwa_offline/static/src/js/OfflineOrderManagementScreen.js',
            '/pwa_offline/static/src/js/OrderLine.js',
#-----------------------------------------------------------------------------------------
            '/pwa_offline/static/src/js/OfflineClientInfo.js',
            '/pwa_offline/static/src/js/OfflineClientManagementButton.js',
            '/pwa_offline/static/src/js/OfflineClientManagementScreen.js',
            '/pwa_offline/static/src/js/ClientLines.js',
#-----------------------------------------------------------------------------------------
            '/pwa_offline/static/src/xml/pos.xml',
            '/pwa_offline/static/src/xml/pos_Customer.xml',
        ],

    },
    "images": ["static/description/pwa.png"],
}

