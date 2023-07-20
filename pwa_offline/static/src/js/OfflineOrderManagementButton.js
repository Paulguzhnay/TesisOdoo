odoo.define('pwa_offline.OfflineOrderManagementButton', function (require) {
	'use strict';

	const PosComponent = require('point_of_sale.PosComponent');
	const Registries = require('point_of_sale.Registries');

	class OfflineOrderManagementButton extends PosComponent {
		async onClick() {
			this.showTempScreen('OfflineOrderManagementScreen');
		}
	}
	
	OfflineOrderManagementButton.template = 'OfflineOrderManagementButton';
	Registries.Component.add(OfflineOrderManagementButton);
	return OfflineOrderManagementButton;
});
