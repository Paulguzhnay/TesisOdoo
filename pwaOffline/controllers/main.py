# -*- coding: utf-8 -*-
import json

from odoo.addons.web.controllers import main as web
from odoo.addons.web.controllers.main import ensure_db


from odoo import tools, SUPERUSER_ID
from odoo.http import request, route


class PWA(web.Home):
    cache_version_pattern = 'pwa-cache-v{}'
    cache_version = 0

    @staticmethod
    def _get_pwa_icons(manifest):
        icons = []
        for icon in manifest.icons:
            icons.append({
                'src': icon.url,
                'sizes': icon.sizes,
                'type': icon.type,
                'purpose': icon.purpose,
            })
        return icons

    def _get_manifest(self):
        return request.env['pwa.manifest'].with_user(SUPERUSER_ID).search([], limit=1)

    def _get_pwa_manifest(self):
        manifest = self._get_manifest()
        if manifest:
            return {
                'name': manifest.name,
                'short_name': manifest.short_name,
                'icons': self._get_pwa_icons(manifest),
                'start_url': manifest.start_url,
                'display': manifest.display,
                'orientation': manifest.orientation,
                'categories': manifest.categories.mapped('name'),
                'background_color': manifest.background_color,
                'theme_color': manifest.theme_color,
                "scope": manifest.scope,
            }
        else:
            return {
                'name': 'PWA',
                'icons': [{'src': '/web/binary/company_logo'}, ],
                'start_url': '/web',
                'display': 'standalone',
                'orientation': 'portrait-primary',
                'scope': '/',
            }

    def get_cache_version(self):
        installed_modules = request.env['ir.module.module'].installed_modules_version_info()
        installed_modules_hash = request.env['ir.module.module'].get_installed_modules_hash(installed_modules)
        self.cache_version = self.cache_version_pattern.format(installed_modules_hash)
        return self.cache_version

    def get_assets_to_cache(self):
        """
        Can be used to return list of url with assets to pre-cache
        :return:
        """
        return [
            '/web/binary/company_logo',
        ]

    def get_pages_to_cache(self):
        pages = ['/pwa_offline_page.html']
        manifest = self._get_manifest()
        if manifest:
            pages.append('/pwa_manifest.json')
        return pages

    @route("/pwa_sw.js", type="http", auth="none")
    def pwa_sw(self, **kw):
        ensure_db()
        self.get_cache_version();
        js_path = 'js_pwa/static/src/js/pwa/sw.js'
        with tools.file_open(js_path, 'r') as js_file:
            js_file_content = self.replace_js_variables(js_file.read())
            return request.make_response(
                js_file_content,
                headers=[("Content-Type", "text/javascript;charset=utf-8")],
            )

    def replace_js_variables(self, js_file_content):
        assets_to_cache = self.get_assets_to_cache()
        pages_to_cache = self.get_pages_to_cache()
        urls_to_cache = assets_to_cache + pages_to_cache
        replace_rules = [(
            'let PWA_CACHE_NAME;',
            'const PWA_CACHE_NAME = "{}";'.format(self.cache_version)
        )]
        if urls_to_cache:
            replace_rules.append((
                'let urls_to_cache;',
                'const urls_to_cache = {};'.format(json.dumps(urls_to_cache))
            ))

        for replace_rule in replace_rules:
            js_file_content = js_file_content.replace(replace_rule[0], replace_rule[1])
        return js_file_content

    @route("/pwa_manifest.json", type="http", auth="none")
    def pwa_manifest(self, **kw):
        ensure_db()
        """Returns the manifest used to install the page as app"""
        return request.make_response(
            json.dumps(self._get_pwa_manifest()),
            headers=[("Content-Type", "application/json;charset=utf-8")],
        )

    @route('/pwa_offline_page.html', type="http", auth="public")
    def pwa_offline_page(self):
        return request.render('js_pwa.offline_page')