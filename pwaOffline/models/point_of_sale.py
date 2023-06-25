# -*- coding: utf-8 -*-
##############################################################################
#
#    OpenERP, Open Source Management Solution
#    Copyright (C) Kiran Kantesariya.
#
##############################################################################
from odoo import api, fields, models, tools, _
from odoo.exceptions import UserError, ValidationError
from odoo.tools import float_is_zero, float_compare
from itertools import groupby


# class pos_order(models.Model):
# 	_inherit = 'pos.order'


