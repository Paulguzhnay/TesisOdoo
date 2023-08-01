from odoo import models, fields


class PosConfig(models.Model):
    _inherit = 'pos.config'

    sh_create_customer = fields.Boolean(string='Offline Create Customer')
