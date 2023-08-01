from odoo import models, fields, api


class PosPartner(models.Model):
    _inherit = 'res.partner'

    sh_cid = fields.Char(string='Sh cid')

    @api.model
    def Create_offline_customers(self, partners):
        partner_ids = []
        if partners:
            for partner in partners:
                if partner:
                    if partner.get('image_1920'):
                        partner['image_1920'] = partner['image_1920'].split(',')[1]
                    partner_id = partner.get('data').pop('id', False)

                    if partner_id and type(partner_id) == str:
                        partner.get('data')['id'] = False
                        partner_id = self.create(partner.get('data')).id
                        TempDic = {'partner_id': partner_id, 'partner_uid': partner.get('id')}
                        partner_ids.append(TempDic)
        return partner_ids or False
