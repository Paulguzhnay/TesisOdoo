from odoo import models, fields


class PosSession(models.Model):
    _inherit = 'pos.session'

    pwa_manifest_id = fields.Many2one('pwa.manifest', string='PWA Manifest')
    pwa_enabled = fields.Boolean('PWA Enabled', default=False)


    def button_open_session_cb(self):
        res = super(PosSession, self).button_open_session_cb()
        # Crear o actualizar la PWA Manifest para esta sesión
        manifest = self.env['pwa.manifest'].create_or_update_manifest(self)
        # Asociar este PWA Manifest a la sesión
        self.pwa_manifest_id = manifest.id
        return res
