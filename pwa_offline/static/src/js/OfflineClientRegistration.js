odoo.define('pwa_offline.PartnerListScreen', function (require) {
    'use strict';

    const PartnerListScreen = require('point_of_sale.PartnerListScreen');
    const Registries = require('point_of_sale.Registries');
    const PartnerDetailsEdit = require('point_of_sale.PartnerDetailsEdit');
    const { CustomerOffline, Customer } = require('pwa_offline.Models');
    const { isConnectionError } = require('point_of_sale.utils');
    const { onMounted, onWillUnmount } = owl;

    // const PosLoyaltyPartnerDetailsEditScreen = (PartnerDetailsEdit) =>
    //     class extends PartnerDetailsEdit {
    //         setup() {
    //             super.setup();
    //             onMounted(() => {
    //                 const CurrentPartner = this.props.partner
    //                 if (CurrentPartner){
    //                     cons
    //                 }
    //             });
    //         }
    //      }

    // Registries.Component.extend(PartnerDetailsEdit, PosLoyaltyPartnerDetailsEditScreen);

    const PosLoyaltyPartnerListScreen = (PartnerListScreen) =>
        class extends PartnerListScreen {
            async saveChanges(event) {
                var self = this;
                if (self.env.pos.config.sh_create_customer) {
                    try {
                        let partnerId = await this.rpc({
                            model: 'res.partner',
                            method: 'create_from_ui',
                            args: [event.detail.processedChanges],
                        });
                        await this.env.pos.load_new_partners();
                        this.state.selectedPartner = this.env.pos.db.get_partner_by_id(partnerId);
                        this.confirm();
                    } catch (error) {
                        var NewPartner = event.detail.processedChanges
                        if (NewPartner && NewPartner.id && self.env.pos.db.customer_by_uid[NewPartner.id]) {

                            var NewDIC = $.extend(NewPartner, self.env.pos.db.customer_by_uid[NewPartner.id])

                            self.env.pos.db.customer_by_uid[NewPartner.id] = NewDIC

                            self.env.pos.db.remove_customer(NewPartner.id)

                            var EditCustomer = self.env.pos.add_customer(NewDIC)
                            event.detail.processedChanges['id'] = EditCustomer.uid

                            const SetPartner = EditCustomer.get_customer() || {}

                            await self.env.pos.db.add_partners([SetPartner])
                            await self.confirm()
                            self.env.pos.get_order().set_partner(SetPartner)

                            if (isConnectionError(error)) {
                                await this.showPopup('OfflineErrorPopup', {
                                    title: this.env._t('Temporary Customer Updated!'),
                                    body: this.env._t(' When you online customer Updated automatically !'),
                                });
                            } else {
                                throw error;
                            }
                        } else {
                            if (NewPartner.id) {
                                self.env.pos.db.old_customer_update[NewPartner.id] = NewPartner
                                await self.confirm()
                            } else {
                                var NewCustomer = self.env.pos.add_customer(event.detail.processedChanges)
                                event.detail.processedChanges['id'] = NewCustomer.uid

                                const CurrentPartner = NewCustomer.get_customer() || {}
                                await self.env.pos.db.add_partners([CurrentPartner])

                                await self.confirm()

                                self.env.pos.get_order().set_partner(CurrentPartner)
                                if (isConnectionError(error)) {
                                    await this.showPopup('OfflineErrorPopup', {
                                        title: this.env._t('Temporary Customer Created!'),
                                        body: this.env._t(' When you online customer created automatically !'),
                                    });
                                } else {
                                    throw error;
                                }
                            }
                        }
                        self.env.pos.set_synch('disconnected');
                    }
                } else {
                    super.saveChanges(event)
                }
            }
        };

    Registries.Component.extend(PartnerListScreen, PosLoyaltyPartnerListScreen);

    return PartnerListScreen;
});
