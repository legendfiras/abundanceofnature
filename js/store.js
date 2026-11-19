/* ==========================================================================
   store.js — client-side state: bag, cookie consent, last order.
   Uses localStorage when available (wrapped in try/catch) and falls back
   to memory. In production the bag would sync with the server cart
   (e.g. POST /api/cart) and consent would also gate third-party scripts.
   ========================================================================== */
(function (AON) {
  'use strict';

  var memory = {};
  var storage = {
    get: function (key, fallback) {
      try {
        var raw = window.localStorage.getItem(key);
        return raw ? JSON.parse(raw) : fallback;
      } catch (e) { return key in memory ? memory[key] : fallback; }
    },
    set: function (key, value) {
      memory[key] = value;
      try { window.localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* storage unavailable */ }
    },
    remove: function (key) {
      delete memory[key];
      try { window.localStorage.removeItem(key); } catch (e) { /* ignore */ }
    }
  };

  var listeners = [];
  function emit(type) { listeners.forEach(function (fn) { fn(type); }); }

  /* ---------- Helpers ---------- */
  var money = new Intl.NumberFormat(AON.site.locale, { style: 'currency', currency: AON.site.currency });
  AON.formatPrice = function (n) { return money.format(n); };
  AON.findProduct = function (id) { return AON.products.find(function (p) { return p.id === id; }); };
  AON.findCategory = function (id) { return AON.categories.find(function (c) { return c.id === id; }); };

  /* ---------- Bag ---------- */
  var BAG_KEY = 'aon_bag';
  var bag = storage.get(BAG_KEY, []);
  // drop lines for products that no longer exist
  bag = bag.filter(function (l) { return AON.findProduct(l.id); });

  function saveBag() { storage.set(BAG_KEY, bag); emit('bag'); }
  function lineKey(id, variant) { return id + '::' + (variant || ''); }

  AON.bag = {
    lines: function () {
      return bag.map(function (l) {
        var p = AON.findProduct(l.id);
        return { key: lineKey(l.id, l.variant), product: p, variant: l.variant, qty: l.qty, total: p.price * l.qty };
      });
    },
    count: function () { return bag.reduce(function (n, l) { return n + l.qty; }, 0); },
    subtotal: function () { return this.lines().reduce(function (s, l) { return s + l.total; }, 0); },
    add: function (id, qty, variant) {
      qty = Math.max(1, qty || 1);
      var existing = bag.find(function (l) { return lineKey(l.id, l.variant) === lineKey(id, variant); });
      if (existing) existing.qty = Math.min(10, existing.qty + qty);
      else bag.push({ id: id, variant: variant || null, qty: Math.min(10, qty) });
      saveBag();
    },
    setQty: function (key, qty) {
      var line = bag.find(function (l) { return lineKey(l.id, l.variant) === key; });
      if (!line) return;
      if (qty <= 0) bag = bag.filter(function (l) { return l !== line; });
      else line.qty = Math.min(10, qty);
      saveBag();
    },
    remove: function (key) { bag = bag.filter(function (l) { return lineKey(l.id, l.variant) !== key; }); saveBag(); },
    clear: function () { bag = []; saveBag(); }
  };

  /* ---------- Cookie consent ---------- */
  var CONSENT_KEY = 'aon_consent';
  AON.consent = {
    get: function () { return storage.get(CONSENT_KEY, null); },
    hasChoice: function () { return !!this.get(); },
    save: function (choices) {
      var record = {
        necessary: true,
        analytics: !!choices.analytics,
        advertising: !!choices.advertising,
        savedAt: new Date().toISOString(),
        version: 1 // bump when categories change to ask again
      };
      storage.set(CONSENT_KEY, record);
      emit('consent');
      AON.consent.apply(record);
      return record;
    },
    /* Load optional scripts only after consent. */
    apply: function (record) {
      if (!record) return;
      if (record.analytics) { /* TODO: load analytics script here */ }
      if (record.advertising) { /* TODO: load advertising script here */ }
    }
  };

  /* ---------- Last order (preview only) ---------- */
  AON.orders = {
    last: function () { return storage.get('aon_last_order', null); },
    saveLast: function (o) { storage.set('aon_last_order', o); }
  };

  AON.subscribe = function (fn) { listeners.push(fn); };
  AON.storage = storage;
})(window.AON = window.AON || {});
