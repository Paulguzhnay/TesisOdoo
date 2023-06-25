odoo.define('pwa_offline.OfflineClientInfo', function(require) {
	'use strict';

	const AbstractAwaitablePopup = require('point_of_sale.AbstractAwaitablePopup');
	const Registries = require('point_of_sale.Registries');
    const field_utils = require('web.field_utils');

	class OfflineClientInfo extends AbstractAwaitablePopup {
		back() {
			this.showScreen('ProductScreen');
			this.trigger('close-popup');
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

	}

	OfflineClientInfo.template = 'OfflineClientInfo';
	Registries.Component.add(OfflineClientInfo);
	return OfflineClientInfo;
});
