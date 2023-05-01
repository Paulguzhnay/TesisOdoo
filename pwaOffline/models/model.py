from odoo import models, fields

class MiModelo(models.Model):
    _name = 'model'
    _description = 'Este modulo va a permitir usar el Point Of Sale de manera offline'

    campo1 = fields.Char('Campo 1')
    campo2 = fields.Integer('Campo 2')
