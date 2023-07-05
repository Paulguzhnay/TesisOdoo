# -*- coding: utf-8 -*-
# Copyright (C) Softhealer Technologies.

from odoo import fields, models


class PosConfig(models.TransientModel):
    _inherit = 'res.config.settings'

    sh_create_customer = fields.Boolean(related="pos_config_id.sh_create_customer", readonly=False)
   
