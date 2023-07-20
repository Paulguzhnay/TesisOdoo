var IndexedDB = (function (exports) {
    'use strict';

    const {get, set, del, keys, clear, Store} = idbKeyval;
    const store = new Store('Odoo-POS', 'Database');

    const IndexedDB = {
        get(key) {
            const datas = get(key, store);
            return datas
        },
        set(key, value) {
            return set(key, value, store);
        },
        del(key) {
            return del(key, store);
        },
        keys() {
            return keys(store);
        },
        clear() {
            return clear(store);
        },
        getPos() {
            debugger
        }
    };
    Object.assign(exports, IndexedDB);
    return exports;
})({});