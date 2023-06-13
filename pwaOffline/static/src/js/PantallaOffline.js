odoo.define('pwaOffline.PantallaOffline', function (require) {
	'use strict';

	const { debounce } = owl.utils;
	const PosComponent = require('point_of_sale.PosComponent');
	const Registries = require('point_of_sale.Registries');
	const { useListener } = require('web.custom_hooks');
	const { onChangeOrder } = require('point_of_sale.custom_hooks');
	const field_utils = require('web.field_utils');
	const { posbus } = require('point_of_sale.utils');

	class PantallaOffline extends PosComponent {
		constructor() {
			super(...arguments);
			this.state = {
				query: null,
			};
			useListener('click-offlineOrderView', this.offlineOrderView);
			this.searchOrders = debounce(this.searchOrders, 70);
			let orders = this.orders;
		}

		mounted() {
            posbus.on('order-deleted', this, this.render);
        }

		back() {
			this.props.resolve({ confirmed: false, payload: false });
			this.trigger('close-temp-screen');
		}

		get currentOrder() {
			return this.env.pos.get_order();
		}

		get orders() {
            if (this.state.query && this.state.query.trim() !== '') {
                return this.fetch_order_data(this.env.pos.db.get_orders(),this.state.query.trim());
            } else {
                return this.env.pos.db.get_orders();
            }
        }

        get_partner(partnerId){
			let partner = this.env.pos.db.get_partner_by_id(partnerId);
			if(partner){
				return partner.name
			}else{
				return false;
			}
		}

		fetch_order_data(datas,query){
			let self = this;
			let fetched_data = [];
			datas.forEach(function(d) {
				let order = d.data;
				let partner = self.get_partner(order.partner_id)
				if(partner){
					if(query){
						if (((order.name.toLowerCase()).indexOf(query) != -1) ||
							((partner.toLowerCase()).indexOf(query) != -1)) {
							fetched_data.push(d);
						}
					}
				}else{
					if ((order.name.toLowerCase()).indexOf(query) != -1) {
						fetched_data.push(d);
					}
				}
			});
			return fetched_data;
		}

		searchOrders(event) {
			this.state.query = event.target.value;
			const orders = this.orders;
			this.render();

		}

		offlineOrderView(event){
			this.showPopup('OfflineOrderInfo', {
				'order': event.detail,
			});
		}
	}


	PantallaOffline.template = 'PantallaOffline';
	PantallaOffline.hideOrderSelector = true;
	Registries.Component.add(PantallaOffline);
	return PantallaOffline;
});
