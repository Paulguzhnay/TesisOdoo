import json
from odoo.http import Controller, request, route
from odoo import models, fields, api


class PWA(Controller):

    @route('/pwa_offline/manifest.webmanifest', type='http', auth='public')
    def pwa_manifest(self):

        manifest_data = {
            "name": "Odoo PWA",
            "short_name": "Odoo PWA",
            "start_url": "/pos/web",
            "display": "standalone",
            "background_color": "#FFFFFF",
            "theme_color": "#875A7B",
            "icons": [
                {
                    "src": "/pwa_offline/static/img/icons/icon-128x128.png",
                    "sizes": "128x128",
                    "type": "image/png"
                },
                {
                    "src": "/pwa_offline/static/img/icons/icon-144x144.png",
                    "sizes": "144x144",
                    "type": "image/png"
                },
                {
                    "src": "/pwa_offline/static/img/icons/icon-152x152.png",
                    "sizes": "152x152",
                    "type": "image/png"
                },
                {
                    "src": "/pwa_offline/static/img/icons/icon-192x192.png",
                    "sizes": "192x192",
                    "type": "image/png"
                },
                {
                    "src": "/pwa_offline/static/img/icons/icon-256x256.png",
                    "sizes": "256x256",
                    "type": "image/png"
                },
                {
                    "src": "/pwa_offline/static/img/icons/icon-512x512.png",
                    "sizes": "512x512",
                    "type": "image/png"
                },
            ],
        }

        return request.make_response(
            json.dumps(manifest_data),
            headers=[("Content-Type", "application/json;charset=utf-8")],
        )


