import json
from odoo.http import Controller, request, route


class PWA(Controller):
    def get_pwa_manifest_icons(self, pwa_icon):
        icons = []
        if not pwa_icon:
            for size in [
                (128, 128),
                (144, 144),
                (152, 152),
                (192, 192),
                (256, 256),
                (512, 512),
            ]:
                icons.append(
                    {
                        "src": "/pwa_offline/static/img/icons/icon-%sx%s.png"
                        % (str(size[0]), str(size[1])),
                        "sizes": "{}x{}".format(str(size[0]), str(size[1])),
                        "type": "image/png",
                        "purpose": "any maskable",
                    }
                )
        elif not pwa_icon.mimetype.startswith("image/svg"):
            all_icons = (
                request.env["ir.attachment"]
                .sudo()
                .search(
                    [
                        ("url", "like", "/pwa_offline/icon"),
                        (
                            "url",
                            "not like",
                            "/pwa_offline/icon.",
                        ),
                    ]
                )
            )
            for icon in all_icons:
                icon_size_name = icon.url.split("/")[-1].lstrip("icon").split(".")[0]
                icons.append(
                    {"src": icon.url, "sizes": icon_size_name, "type": icon.mimetype}
                )
        else:
            icons = [
                {
                    "src": pwa_icon.url,
                    "sizes": "128x128 144x144 152x152 192x192 256x256 512x512",
                    "type": pwa_icon.mimetype,
                }
            ]
        return icons

    def get_pwa_manifest(self):

        start_url = request.httprequest.host_url + "/web"
        config_param_sudo = request.env["ir.config_parameter"].sudo()
        pwa_icon = (
            request.env["ir.attachment"]
            .sudo()
            .search([("url", "like", "/pwa_offline/icon.")])
        )
        background_color = config_param_sudo.get_param(
            "pwa.manifest.background_color", "#2E69B5"
        )
        theme_color = config_param_sudo.get_param("pwa.manifest.theme_color", "#2E69B5")
        return {
            "name": "Odoo PWA",
            "short_name": "Odoo PWA",
            "icons": self.get_pwa_manifest_icons(pwa_icon),
            "start_url": start_url,
            "display": "standalone",
            "background_color": background_color,
            "theme_color": theme_color,
        }

    @route("/pwa_offline/manifest.webmanifest", type="http", auth="public")
    def pwa_manifest(self):
        manifest_data = self.get_pwa_manifest()

        # Agregar la propiedad "render_odoo" al archivo de manifiesto
        manifest_data["render_odoo"] = True

        return request.make_response(
            json.dumps(manifest_data),
            headers=[("Content-Type", "application/json;charset=utf-8")],
        )
