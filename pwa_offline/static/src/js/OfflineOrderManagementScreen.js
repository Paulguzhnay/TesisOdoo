odoo.define('pwa_offline.OfflineOrderManagementScreen', function (require) {
	'use strict';

    const { debounce } = require("@web/core/utils/timing");
	const PosComponent = require('point_of_sale.PosComponent');
	const Registries = require('point_of_sale.Registries');
    const { useListener } = require("@web/core/utils/hooks");
	const field_utils = require('web.field_utils');

	class OfflineOrderManagementScreen extends PosComponent {
		constructor() {
			super(...arguments);
			this.state = {
				query: null,
			};
			this.searchOrders = debounce(this.searchOrders, 70);
			let orders = this.orders;
		}

		mounted() {
            this.env.posbus.on('order-deleted', this, this.render);
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

		offlineOrderView(order){
			this.showPopup('OfflineOrderInfo', {
				'order': order,
			});
		}

		deleteOrder(order){
			let self = this;
			let cashier = this.env.pos.get_cashier();
			let user = this.env.pos.user;
			if(cashier.role == 'manager'){
				self.env.pos.db.remove_order(order.uid);
				this.env.posbus.trigger('order-deleted');
				self.render();
			}else{
				this.showPopup('ErrorPopup', {
                    title: this.env._t('User is not allowed'),
                    body: this.env._t('Please Contact your Administrator to delete this order'),
                });
			}
		}
	}


	OfflineOrderManagementScreen.template = 'OfflineOrderManagementScreen';
	OfflineOrderManagementScreen.hideOrderSelector = true;
	Registries.Component.add(OfflineOrderManagementScreen);
	return OfflineOrderManagementScreen;
});
