{
    'name': 'PWA Offline',
    'version': '1.0',
    'summary': 'PWA para el Modulo de Punto de Venta',
    'description': 'Este modulo va a permitir usar el Point Of Sale de manera offline',
    'author': 'Universidad Politecnica Salesiana',
    'depends': ['point_of_sale',
                ],
    'data': [
        'views/view.xml',
    ],
    'application': True,
    'installable': True,
    'auto_install': False,
    "assets": {
        "web.assets_backend": [
            '/pwaOffline/static/src/js/pos.js',
        ]
    },
    'images': ['static/image/pwa.png'],
}
