odoo.define('pwa_offline.OfflineClientManagementButton', function (require) {
	'use strict';

	const PosComponent = require('point_of_sale.PosComponent');
	const Registries = require('point_of_sale.Registries');

	class OfflineClientManagementButton extends PosComponent {
		async onClick() {
			this.showTempScreen('OfflineClientManagementScreen');
		}
	}

	OfflineClientManagementButton.template = 'OfflineClientManagementButton';
	Registries.Component.add(OfflineClientManagementButton);
	return OfflineClientManagementButton;
});
