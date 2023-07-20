from odoo import models, fields, api
from odoo.http import Controller, route, request
import json

class PWAManifest(models.Model):
    _name = 'pwa.manifest'
    _description = 'PWA Manifest'

    name = fields.Char('Name')
    short_name = fields.Char('Short Name')
    start_url = fields.Char('Start URL')
    display = fields.Selection([('standalone', 'Standalone')], string='Display', default='standalone')
    background_color = fields.Char('Background Color')
    theme_color = fields.Char('Theme Color')
    icons = fields.Json('Icons')
    pos_session_id = fields.Many2one('pos.session', string='POS Session')

    @api.model
    def create_or_update_manifest(self, pos_session):
        # Aquí es donde configuras los datos de tu manifiesto PWA.
        # Puedes personalizar esto para adaptarlo a tus necesidades.
        manifest_values = {
            'name': f'Odoo PWA - Caja {pos_session.id}',
            'short_name': f'Odoo PWA - Caja {pos_session.id}',
            'start_url': f'/pos/web/session/{pos_session.id}',
            'display': 'standalone',
            'background_color': '#ffffff',
            'theme_color': '#000000',
            'icons': [
                {
                    'src': '/pwa_offline/static/img/icons/icon-128x128.png',
                    'sizes': '128x128',
                    'type': 'image/png'
                },
                {
                    'src': '/pwa_offline/static/img/icons/icon-144x144.png',
                    'sizes': '144x144',
                    'type': 'image/png'
                },
                {
                    'src': '/pwa_offline/static/img/icons/icon-152x152.png',
                    'sizes': '152x152',
                    'type': 'image/png'
                },
                {
                    'src': '/pwa_offline/static/img/icons/icon-192x192.png',
                    'sizes': '192x192',
                    'type': 'image/png'
                },
                {
                    'src': '/pwa_offline/static/img/icons/icon-256x256.png',
                    'sizes': '256x256',
                    'type': 'image/png'
                },
                {
                    'src': '/pwa_offline/static/img/icons/icon-512x512.png',
                    'sizes': '512x512',
                    'type': 'image/png'
                }
            ],
            'pos_session_id': pos_session.id,
        }

        # Verificar si ya existe un manifiesto PWA para esta sesión
        existing_manifest = self.search([('pos_session_id', '=', pos_session.id)], limit=1)
        if existing_manifest:
            # Actualizar el manifiesto existente
            existing_manifest.write(manifest_values)
            return existing_manifest
        else:
            # Crear un nuevo manifiesto
            return self.create(manifest_values)


class PosSession(models.Model):
    _inherit = 'pos.session'

    pwa_manifest_ids = fields.One2many('pwa.manifest', 'pos_session_id', string='PWA Manifests')

    def button_open_session_cb(self):
        res = super(PosSession, self).button_open_session_cb()
        if self.config_id.pwa_enabled:
            manifest = self.env['pwa.manifest'].create_or_update_manifest(self)
            self.pwa_manifest_ids |= manifest
        return res


class PWAController(Controller):
    @route('/pwa_offline/manifest.webmanifest/<int:pos_session_id>', type='http', auth='public')
    def pwa_manifest(self, pos_session_id):
        pos_session = self.env['pos.session'].browse(pos_session_id)

        manifest_data = {
            'name': 'Caja',
            'short_name': 'Caja',
            'start_url': f'http://localhost:8070/pos/ui?config_id=1&session_id={pos_session_id}',
            'display': 'standalone',
            'background_color': '#FFFFFF',
            'theme_color': '#875A7B',
            'icons': [
                {
                    'src': '/pwa_offline/static/img/icons/icon-128x128.png',
                    'sizes': '128x128',
                    'type': 'image/png'
                },
                {
                    'src': '/pwa_offline/static/img/icons/icon-144x144.png',
                    'sizes': '144x144',
                    'type': 'image/png'
                },
                {
                    'src': '/pwa_offline/static/img/icons/icon-152x152.png',
                    'sizes': '152x152',
                    'type': 'image/png'
                },
                {
                    'src': '/pwa_offline/static/img/icons/icon-192x192.png',
                    'sizes': '192x192',
                    'type': 'image/png'
                },
                {
                    'src': '/pwa_offline/static/img/icons/icon-256x256.png',
                    'sizes': '256x256',
                    'type': 'image/png'
                },
                {
                    'src': '/pwa_offline/static/img/icons/icon-512x512.png',
                    'sizes': '512x512',
                    'type': 'image/png'
                }
            ],
        }

        return request.make_response(
            json.dumps(manifest_data),
            headers=[('Content-Type', 'application/json;charset=utf-8')],
        )
'''
import json
from odoo import http
from odoo.http import request


class MyController(http.Controller):

    @http.route('/pwa_offline/manifest.webmanifest/<int:pos_session_id>', type='http', auth='public')
    def pwa_manifest(self, pos_session_id):
        # Obtener la sesión de la caja utilizando pos_session_id
        pos_session = request.env['pos.session'].browse(pos_session_id)

        # Verificar si la sesión de la caja existe y está abierta
        if pos_session and pos_session.state == 'opened':
            # Construir el objeto del manifiesto PWA con los detalles de la sesión de la caja
            manifest_data = {
                "name": f"POS PWA - Session {pos_session.id}",
                "short_name": f"POS PWA - Session {pos_session.id}",
                "start_url": f"/pos/web/session/{pos_session.id}",
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
        else:
            # Si la sesión de la caja no existe o no está abierta, retornar un error o redireccionar a otra página
            return request.render('pwa_offline.session_not_found')
'''