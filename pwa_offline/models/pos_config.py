# Copyright (C) Softhealer Technologies.
# Part of Softhealer Technologies.

from odoo import models, fields, api


class PosConfig(models.Model):
    _inherit = 'pos.config'

    sh_create_customer = fields.Boolean(string='Offline Create Customer ')
