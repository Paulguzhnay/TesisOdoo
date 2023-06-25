odoo.define('pwaOffline.BotonOffline', function (require) {
	'use strict';

	const PosComponent = require('point_of_sale.PosComponent');
	const Registries = require('point_of_sale.Registries');

	class BotonOffline extends PosComponent {
		async onClick() {
			this.showTempScreen('OfflineOrderManagementScreen');
		}
	}

	BotonOffline.template = 'BotonOffline';
	Registries.Component.add(BotonOffline);
	return BotonOffline;
});
