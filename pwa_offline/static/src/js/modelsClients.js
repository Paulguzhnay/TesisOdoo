odoo.define("pwa_offline.Models", function (require) {
    "use strict";

    var DB = require("point_of_sale.DB");
    const { PosGlobalState } = require('point_of_sale.models');
    const Registries = require("point_of_sale.Registries");
     

    class CustomerCollection extends Array {
        getByCID(cid) {
            return this.find(item => item.cid == cid);
        }
        add(item) {
            this.push(item);
        }
        remove(item) {
            const index = this.findIndex(_item => item.cid == _item.cid);
            if (index < 0) return index;
            this.splice(index, 1);
            return index;
        }
        reset() {
            this.length = 0;
        }
        at(index) {
            return this[index];
        }
    }

 
    class Customer extends CustomerCollection {
        constructor(obj, options) {
            super(obj);
            var self = this;
            options = options || {};

            this.pos = options.pos;
            this.creation_date = new Date();
            this.currunt_client = options.currunt_client || {}

            if (options.json) {
                this.init_from_JSON(options.currunt_client);
            } else {
                this.sequence_number = this.pos.pos_session.sequence_number++;
                this.uid = this.generate_unique_id();
            }
        }

        init_from_JSON(json) {
            this.session_id = this.pos.pos_session.id;
            this.uid = json.uid;
            this.name = json.name
        }
        generate_unique_id() {
            function zero_pad(num, size) {
                var s = "" + num;
                while (s.length < size) {
                    s = "0" + s;
                }
                return s;
            }
            return 'sh-' + zero_pad(this.pos.pos_session.id, 5) + '-' +
                zero_pad(this.pos.pos_session.login_number, 3) + '-' +
                zero_pad(this.sequence_number, 4);
        }
        get_customer() {
            return this.currunt_client
        }
        set_customer(dic) {
            this.currunt_client = dic
        }
        export_as_JSON() {
            var self = this;
            var state_id = this.currunt_client['state_id']
            var country = this.currunt_client['country_id']
            return {
                name: self.currunt_client.name,
                country_id: country,
                id: self.uid,
                image_1920: self.currunt_client['image_1920'] || "",
                barcode: self.currunt_client['barcode'] || "",
                city: self.currunt_client['city'] || "",
                email: self.currunt_client['email'] || "",
                state_id: state_id,
                street: self.currunt_client['street'] || "",
                zip: self.currunt_client['zip'] || "",
                property_product_pricelist: self.pos.default_pricelist.id,
            };
        }
    }
    Registries.Model.add(Customer);


    const shCustomerPosGlobalState = (PosGlobalState) => class shCustomerPosGlobalState extends PosGlobalState {

        constructor(obj) {
            super(...arguments);
            Object.assign(this, {
                'Customers': new CustomerCollection(),
                'selectedCustomer': null,
            });
        }
        add_customer(data) {
            var NewCustomer = Customer.create({}, { pos: this, currunt_client: data })
            this.Customers.add(NewCustomer);
            this.selectedCustomer = NewCustomer;
            this.db.add_offline_clients(NewCustomer)
            return NewCustomer
        }
        _save_customer_to_server(Customers) {
            var self = this;
            return this.env.services.rpc({
                model: 'res.partner',
                method: 'Create_offline_customers',
                args: [Customers],
            }).then(function (partner_ids) {
                if (partner_ids) {
                    for (var i = 0; i < partner_ids.length; i++) {
                        const partner_id = partner_ids[i]
                        self.db.customer_by_uid[partner_id.partner_uid]['currunt_client']['id'] = partner_id.partner_id
                    }

                }
            })
        }
        async push_orders(order, opts) {
            var self = this;
            this.config.sh_create_customer=true
            if (this.config.sh_create_customer) {
                const AllOfflineCustomers = this.db.get_offline_clients()
                const AllOfflineUpdateCustomers = this.db.old_customer_update

                if (AllOfflineUpdateCustomers && Object.values(AllOfflineUpdateCustomers).length > 0) {

                    await _.each(AllOfflineUpdateCustomers, async function (eachPartner) {
                        await self.env.services.rpc({
                            model: 'res.partner',
                            method: 'create_from_ui',
                            args: [eachPartner],
                        });
                        self.db.old_customer_update = {}
                    })
                    self.set_synch('connected', 0);
                }

                if (AllOfflineCustomers && AllOfflineCustomers.length > 0) {
                    await new Promise((resolve, reject) => {
                        this.env.posMutex.exec(async () => {
                            try {
                                await self._save_customer_to_server(AllOfflineCustomers)
                                self.db.remove_sh_all_customers()
                                self.set_synch('connected', 0);
                                resolve();
                            } catch (error) {
                                resolve()
                            }
                        });
                    })
                }

                await _.each(this.db.get_orders(), function (each_order) {
                    var partner = self.env.pos.db.get_customer_by_uid(each_order['data'].partner_id)
                    if (each_order && each_order.data.partner_id) {
                        if (each_order.data.partner_id && typeof each_order.data.partner_id != 'number' && partner) {
                            each_order['data'].partner_id = partner.currunt_client.id
                        }
                    }
                })
            }
            var result = await super.push_orders(...arguments)
            return result
        }
    }
    Registries.Model.extend(PosGlobalState, shCustomerPosGlobalState);

    DB.include({
        init: function (options) {
            this._super(options);
            this.sh_all_customers = [];
            this.customer_by_uid = {}
            this.old_customer_update = {}
        },
        get_offline_clients: function () {
            return this.load('offline_clinets', [])
        },
        add_offline_clients: function (customer) {
            var customer_id = customer.uid;
            var Customers = this.load('offline_clinets', []);
            Customers.push({ id: customer_id, data: customer.export_as_JSON() });

            this.save('offline_clinets', Customers);
            this.customer_by_uid[customer.uid] = customer
            this.sh_all_customers = Customers
            return customer_id;
        },
        get_customer_in_db: function (order_id) {
            var orders = this.get_offline_clients();
            for (var i = 0, len = orders.length; i < len; i++) {
                if (orders[i].id === order_id) {
                    return orders[i];
                }
            }
            return undefined;
        },
        remove_customer: function (order_id) {
            var Customers = this.load('offline_clinets', []);
            Customers = _.filter(Customers, function (order) {
                return order.id !== order_id;
            });
            this.save('offline_clinets', Customers);
        },
        get_customer_by_uid: function (uid) {
            return this.customer_by_uid[uid]
        },
        remove_sh_all_customers: function () {
            this.save('offline_clinets', []);
            this.sh_all_customers = [];
        }
    });

    return { CustomerCollection, Customer };

});

