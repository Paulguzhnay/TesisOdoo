odoo.define('pwa_offline.ClientLines', function(require) {
	'use strict';

	const PosComponent = require('point_of_sale.PosComponent');
	const Registries = require('point_of_sale.Registries');
	var field_utils = require('web.field_utils');
    const { useListener } = require("@web/core/utils/hooks");

	class ClientLines extends PosComponent {
		constructor() {
			super(...arguments);
		}

		mounted() {
            this.env.posbus.on('order-deleted', this, this.render);
        }

		deleteOrder(event){
			let self = this;
			let order = event.detail;
			let cashier = this.env.pos.get_cashier();
			let user = this.env.pos.user
			if(cashier.role == 'manager'){
				self.env.pos.db.remove_order(order.uid);
				this.env.posbus.trigger('order-deleted');
			}else{
				this.showPopup('ErrorPopup', {
                    title: this.env._t('User is not allowed'),
                    body: this.env._t('Please Contact your Administrator to delete this order'),
                });
			}
		}

		get highlight() {
			return this.props.order !== this.props.selectedPosOrder ? '' : 'highlight';
		}

		get_date(date){
			let dt = new Date(date);
			let creation_date = field_utils.format.datetime(moment(dt), {}, {timezone: false});
			return creation_date;
		}

		get_partner(partnerId){
			let partner = this.env.pos.db.get_partner_by_id(partnerId);
			if(partner){
				return partner.name
			}else{
				return "-";
			}
		}


//----------------------------------------------------
		get_partnerName(partnerId){
			let partner = this.env.pos.db.get_partner_by_id(partnerId);
			if(partner){
				return partner.name
			}else{
				return "-";
			}
		}
//----------------------------------------------------
		get_partnerStreet(partnerId){
			let partner = this.env.pos.db.get_partner_by_id(partnerId);
			if(partner){
				return partner.street
			}else{
				return "-";
			}
		}
//----------------------------------------------------
		get_partnerC(partnerId){
			let partner = this.env.pos.db.get_partner_by_id(partnerId);
			if(partner){
				return partner.vat
			}else{
				return "-";
			}
		}
//----------------------------------------------------
		get_partnerCity(partnerId){
			let partner = this.env.pos.db.get_partner_by_id(partnerId);
			if(partner){
				return partner.city
			}else{
				return "-";
			}
		}

//----------------------------------------------------
		get_partnerEmail(partnerId){
			let partner = this.env.pos.db.get_partner_by_id(partnerId);
			if(partner){
				return partner.email
			}else{
				return "-";
			}
		}

//----------------------------------------------------
		get_partnerPhone(partnerId){
			let partner = this.env.pos.db.get_partner_by_id(partnerId);
			if(partner){
				return partner.phone
			}else{
				return "-";
			}
		}





	}

	ClientLines.template = 'ClientLines';
	Registries.Component.add(ClientLines);
	return ClientLines;
});
