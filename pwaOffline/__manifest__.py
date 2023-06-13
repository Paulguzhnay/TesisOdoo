{
    'name': 'PWA Offline',
    'version': '1.0',
    'summary': 'PWA para el Modulo de Punto de Venta',
    'description': 'Este modulo va a permitir usar el Point Of Sale de manera offline',
    'author': 'Universidad Politecnica Salesiana',
    'depends': ['point_of_sale'],
    'data': [
    ],

    "assets": {
        'web.assets_tests':[
            'point_of_sale/static/tests/tours/**/*',
        ],

        'point_of_sale.assets':[
            '/pwaOffline/static/src/css/style.css',
            '/pwaOffline/static/src/js/OrdenOffline.js',
            '/pwaOffline/static/src/js/BotonOffline.js',
            '/pwaOffline/static/src/js/LineaOrden.js',
            '/pwaOffline/static/src/js/PantallaOffline.js',
        ],
        "web.assets_qweb": [
            '/pwaOffline/static/src/xml/view2.xml',
        ],

        "web.assets_backend": [
            '/pwaOffline/static/src/js/pos.js',
        ],

    },
    'images': ['static/image/pwa.png'],

    'application': True,
    'installable': True,
    'auto_install': True,
}