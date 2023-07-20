import json
from odoo.addons.http_routing.models.ir_http import url_for
from odoo.addons.point_of_sale.controllers.main import PosController
from odoo import http
from odoo.http import request
from odoo.modules.module import get_module_resource
from odoo.tools import ustr


class POS_Offline(PosController):
    @http.route('/pos-cache', type='http', auth='user', methods=['GET'], sitemap=False)
    def pos_cache(self):
        services_worker = get_module_resource('pwa_offline', 'static/src/js/lib/cache.js')
        with open(services_worker, 'rb') as fp:
            body = fp.read()
        response = request.make_response(body, [
            ('Content-Type', 'text/javascript'),
            ('Service-Worker-Allowed', url_for('/pos/')),
        ])
        return response

    @http.route('/pos/__manifest__', type='http', auth='user', methods=['GET'], sitemap=False)
    def manifest(self):
        manifest = {
            'name': 'Point of Sale',
            'short_name': 'POS',
            'scope': url_for('/pos/'),
            'display': 'standalone',
            'background_color': '#ffffff',
            'theme_color': '#875A7B',
            'icon': '/point_of_sale/static/description/icon.png',
        }
        body = json.dumps(manifest, default=ustr)
        response = request.make_response(body, [
            ('Content-Type', 'application/manifest+json'),
        ])
        return response
