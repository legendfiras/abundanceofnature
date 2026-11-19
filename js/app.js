/* ==========================================================================
   app.js — hash router, rendering, events, form validation, cookie UI.
   Routes use plain #names (e.g. #shop, #product-rosehip-facial-oil,
   #privacy-policy). Map these to real paths (/shop, /privacy-policy)
   when moving to a server-rendered or framework build.
   ========================================================================== */
(function (AON) {
  'use strict';

  var main = document.getElementById('main');
  var shopSort = 'featured';
  var currentRoute = null;
  var firstRender = true;

  /* ---------------- Router ---------------- */
  function resolve(hash) {
    var r = (hash || '').replace(/^#/, '') || 'home';
    if (r === 'home') return AON.views.home();
    if (r === 'shop') return AON.views.shop(null, shopSort);
    if (r.indexOf('shop-') === 0) return AON.findCategory(r.slice(5)) ? AON.views.shop(r.slice(5), shopSort) : AON.views.notFound();
    if (r.indexOf('product-') === 0) return AON.views.product(r.slice(8));
    if (r === 'order-confirmation') return AON.views.orderConfirmation();
    if (AON.views[r] && r !== 'product' && r !== 'notFound' && r !== 'orderConfirmation') return AON.views[r]();
    return AON.views.notFound();
  }

  function render(opts) {
    opts = opts || {};
    var hash = location.hash;
    var view = resolve(hash);
    var routeChanged = hash !== currentRoute;
    currentRoute = hash;

    main.innerHTML = view.html;
    document.title = view.title;
    document.body.className = view.bodyClass || '';

    // active nav state
    document.querySelectorAll('[data-nav]').forEach(function (a) {
      if (a.getAttribute('data-nav') === view.nav) a.setAttribute('aria-current', 'page');
      else a.removeAttribute('aria-current');
    });
    closeMobileNav();
    renderConsentLists();
    if (view.after) view.after();

    if (routeChanged && !opts.keepScroll) {
      window.scrollTo(0, 0);
      if (!firstRender) main.focus({ preventScroll: true });
    }
    firstRender = false;
  }

  window.addEventListener('hashchange', function () {
    var h = location.hash;
    if (h === '#main' || h === '#top') return; // in-page anchors
    render();
  });

  /* ---------------- Bag badge ---------------- */
  function updateBagBadge() {
    var n = AON.bag.count();
    var badge = document.querySelector('.bag-count');
    var link = document.querySelector('.bag-link');
    badge.textContent = n;
    badge.hidden = n === 0;
    link.setAttribute('aria-label', 'Bag, ' + n + ' item' + (n === 1 ? '' : 's'));
  }

  AON.subscribe(function (type) {
    if (type === 'bag') {
      updateBagBadge();
      var r = location.hash;
      if (r === '#bag' || r === '#checkout') render({ keepScroll: true });
    }
    if (type === 'consent') { renderConsentLists(); updateBanner(); }
  });

  /* ---------------- Toasts ---------------- */
  function toast(html) {
    var region = document.querySelector('.toast-region');
    var el = document.createElement('div');
    el.className = 'toast';
    el.innerHTML = html;
    region.appendChild(el);
    setTimeout(function () { el.remove(); }, 4200);
  }
  AON.toast = toast;

  /* ---------------- Mobile nav ---------------- */
  var navToggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('primary-nav');
  function closeMobileNav() { nav.classList.remove('is-open'); navToggle.setAttribute('aria-expanded', 'false'); }
  navToggle.addEventListener('click', function () {
    var open = !nav.classList.contains('is-open');
    nav.classList.toggle('is-open', open);
    navToggle.setAttribute('aria-expanded', String(open));
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMobileNav(); });

  /* ---------------- Cookie consent UI ---------------- */
  var banner = document.getElementById('cookie-banner');
  var dialog = document.getElementById('cookie-dialog');

  function updateBanner() { banner.hidden = AON.consent.hasChoice(); }

  function renderConsentLists() {
    var c = AON.consent.get() || { analytics: false, advertising: false };
    document.querySelectorAll('[data-consent-list]').forEach(function (list, idx) {
      list.innerHTML = AON.cookieCategories.map(function (cat) {
        var id = 'consent-' + idx + '-' + cat.id;
        var control = cat.locked
          ? '<span class="consent-row__always">Always on</span>'
          : '<label class="switch" for="' + id + '"><span data-state>' + (c[cat.id] ? 'On' : 'Off') + '</span>' +
            '<input type="checkbox" role="switch" id="' + id + '" data-consent="' + cat.id + '"' + (c[cat.id] ? ' checked' : '') +
            ' aria-label="' + cat.name + ' cookies"><span class="switch__track"></span></label>';
        return '<div class="consent-row"><div><div class="consent-row__name">' + cat.name + '</div>' +
          '<p class="consent-row__desc">' + cat.purpose + '</p></div>' + control + '</div>';
      }).join('');
    });
    var status = document.querySelector('[data-consent-status]');
    if (status) {
      var saved = AON.consent.get();
      status.textContent = saved ? 'Last saved: ' + new Date(saved.savedAt).toLocaleString('en-GB') : 'No choice saved yet. Optional cookies are off.';
    }
  }

  function readToggles(scope) {
    var out = {};
    scope.querySelectorAll('[data-consent]').forEach(function (i) { out[i.getAttribute('data-consent')] = i.checked; });
    return out;
  }

  function openCookieSettings() {
    renderConsentLists();
    if (typeof dialog.showModal === 'function') dialog.showModal();
    else dialog.setAttribute('open', '');
  }
  function closeCookieSettings() {
    if (typeof dialog.close === 'function') dialog.close(); else dialog.removeAttribute('open');
  }
  function saveConsent(choices) {
    AON.consent.save(choices);
    closeCookieSettings();
    toast('Your cookie choices have been saved.');
  }

  /* ---------------- Form validation ---------------- */
  var EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  var ES_POSTCODE = /^(0[1-9]|[1-4]\d|5[0-2])\d{3}$/;

  function setError(form, name, msg) {
    var input = form.elements[name];
    if (!input) return;
    var el = input.length && !input.tagName ? input[0] : input;
    var fieldEl = el.closest('.field');
    var errId = el.getAttribute('aria-describedby') ? el.getAttribute('aria-describedby').split(' ')[0] : null;
    var err = errId ? document.getElementById(errId) : null;
    if (fieldEl) fieldEl.classList.toggle('has-error', !!msg);
    if (err) err.textContent = msg || '';
    el.setAttribute('aria-invalid', msg ? 'true' : 'false');
  }

  function validate(form, rules) {
    var errors = [];
    Object.keys(rules).forEach(function (name) {
      var input = form.elements[name];
      var value = input.type === 'checkbox' ? input.checked : (input.value || '').trim();
      var msg = rules[name](value, form);
      setError(form, name, msg);
      if (msg) errors.push({ name: name, msg: msg });
    });
    if (errors.length) {
      var first = form.elements[errors[0].name];
      (first.length && !first.tagName ? first[0] : first).focus();
    }
    return errors;
  }

  var req = function (label) { return function (v) { return v ? '' : 'Enter your ' + label + '.'; }; };
  var email = function (v) { return !v ? 'Enter your email address.' : (EMAIL.test(v) ? '' : 'Enter an email address like name@example.com.'); };

  var RULES = {
    checkout: {
      email: email,
      fullname: function (v) { return v.length >= 2 ? '' : 'Enter your full name.'; },
      street: req('street address'),
      postcode: function (v) { return !v ? 'Enter your postcode.' : (ES_POSTCODE.test(v) ? '' : 'Enter a valid 5-digit Spanish postcode.'); },
      town: req('town or city'),
      phone: function (v) { return v.replace(/\D/g, '').length >= 9 ? '' : 'Enter a phone number for the delivery company.'; },
      terms: function (v) { return v ? '' : 'Please accept the Terms and Conditions to place your order.'; }
    },
    contact: {
      name: req('full name'),
      email: email,
      topic: function (v) { return v ? '' : 'Choose a topic.'; },
      message: function (v) { return v.length >= 10 ? '' : 'Write a short message (at least 10 characters).'; }
    },
    withdrawal: {
      name: req('full name'),
      email: email,
      order: req('order number'),
      items: function (v, f) { return f.elements.scope.value === 'some' && !v ? 'List the items you are withdrawing from.' : ''; },
      confirm: function (v) { return v ? '' : 'Tick the box to confirm your withdrawal.'; }
    }
  };

  /* Delivery estimate (illustrative: adds working days to today) */
  function addWorkingDays(date, n) {
    var d = new Date(date);
    while (n > 0) { d.setDate(d.getDate() + 1); if (d.getDay() !== 0 && d.getDay() !== 6) n--; }
    return d;
  }
  function estimateText() {
    var m = AON.site.delivery.methods[0];
    var f = function (d) { return d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' }); };
    return f(addWorkingDays(new Date(), m.minDays)) + ' – ' + f(addWorkingDays(new Date(), m.maxDays));
  }

  /* ---------------- Form submit handlers ---------------- */
  var SUBMIT = {
    'add-to-bag': function (form) {
      var id = form.getAttribute('data-id');
      var p = AON.findProduct(id);
      var variant = form.elements.variant ? form.elements.variant.value : null;
      if (form.elements.variant && !variant) { setError(form, 'variant', 'Choose a size.'); form.elements.variant.focus(); return; }
      if (form.elements.variant) setError(form, 'variant', '');
      var qty = parseInt(form.elements.qty.value, 10) || 1;
      AON.bag.add(id, qty, variant);
      toast(AON.esc(p.name) + ' added to your bag. <a href="#bag">View bag</a>');
    },

    checkout: function (form) {
      var errors = validate(form, RULES.checkout);
      var summary = form.querySelector('.error-summary');
      if (errors.length) {
        summary.hidden = false;
        summary.querySelector('ul').innerHTML = errors.map(function (e) { return '<li>' + e.msg + '</li>'; }).join('');
        return;
      }
      summary.hidden = true;
      var m = AON.site.delivery.methods[0];
      var lines = AON.bag.lines();
      var sub = AON.bag.subtotal();
      var el = form.elements;
      /* PRODUCTION: create the order server-side (POST /api/orders), then hand off to the
         payment provider (redirect or embedded fields, with 3-D Secure / SCA). Only show
         the confirmation once the provider reports a successful payment. */
      AON.orders.saveLast({
        number: 'AON-' + String(Date.now()).slice(-6),
        firstName: el.fullname.value.trim().split(/\s+/)[0],
        email: el.email.value.trim(),
        address: [el.fullname.value, el.street.value, el.postcode.value + ' ' + el.town.value, 'Spain'].map(function (s) { return s.trim(); }).join(', '),
        lines: lines.map(function (l) { return { name: l.product.name + (l.variant ? ' (size ' + l.variant + ')' : ''), qty: l.qty, total: l.total }; }),
        deliveryName: m.name, delivery: m.price, total: sub + m.price, estimate: estimateText()
      });
      AON.bag.clear();
      location.hash = 'order-confirmation';
    },

    contact: function (form) {
      if (validate(form, RULES.contact).length) return;
      /* PRODUCTION: POST /api/contact → routed to the verified support mailbox. */
      form.querySelector('[data-form-status]').innerHTML =
        '<div class="notice"><p><strong>Front-end preview:</strong> your message passed validation, but the form isn’t connected to the support mailbox yet, so nothing was sent. For now, please email ' + AON.site.email + '.</p></div>';
    },

    withdrawal: function (form) {
      if (validate(form, RULES.withdrawal).length) return;
      /* PRODUCTION: POST /api/withdrawals, then email an acknowledgement on a durable medium. */
      form.querySelector('[data-form-status]').innerHTML =
        '<div class="notice"><p><strong>Front-end preview:</strong> the withdrawal form is complete, but it isn’t connected yet, so nothing was sent. Once live, an acknowledgement is emailed to the address given.</p></div>';
    }
  };

  document.addEventListener('submit', function (e) {
    var form = e.target.closest('[data-form]');
    if (!form) return;
    e.preventDefault();
    var handler = SUBMIT[form.getAttribute('data-form')];
    if (handler) handler(form);
  });

  /* Clear a field's error as soon as the user fixes it */
  document.addEventListener('input', function (e) {
    var t = e.target;
    var fieldEl = t.closest && t.closest('.field.has-error');
    if (fieldEl && t.form) setError(t.form, t.name, '');

    if (t.name === 'postcode' && t.form && t.form.getAttribute('data-form') === 'checkout') {
      t.value = t.value.replace(/\D/g, '').slice(0, 5);
      var est = t.form.querySelector('[data-delivery-estimate]');
      if (est) est.textContent = ES_POSTCODE.test(t.value) ? 'Estimated delivery: ' + estimateText() : AON.site.delivery.methods[0].note;
    }
  });

  document.addEventListener('change', function (e) {
    var t = e.target;
    if (t.matches('[data-consent]')) {
      var label = t.closest('.switch').querySelector('[data-state]');
      if (label) label.textContent = t.checked ? 'On' : 'Off';
    }
    if (t.matches('[data-action="sort"]')) { shopSort = t.value; render({ keepScroll: true }); document.getElementById('sort').focus(); }
    if (t.matches('[data-action="policy-jump"]')) location.hash = t.value;
  });

  /* ---------------- Click actions ---------------- */
  document.addEventListener('click', function (e) {
    var skip = e.target.closest('.skip-link');
    if (skip) { e.preventDefault(); main.focus(); return; }

    var stepBtn = e.target.closest('[data-step]');
    if (stepBtn) {
      var input = stepBtn.parentNode.querySelector('input');
      input.value = Math.min(10, Math.max(1, (parseInt(input.value, 10) || 1) + parseInt(stepBtn.getAttribute('data-step'), 10)));
      return;
    }

    var btn = e.target.closest('[data-action]');
    if (!btn) return;
    var action = btn.getAttribute('data-action');
    switch (action) {
      case 'add-to-bag': {
        var p = AON.findProduct(btn.getAttribute('data-id'));
        AON.bag.add(p.id, 1);
        toast(AON.esc(p.name) + ' added to your bag. <a href="#bag">View bag</a>');
        break;
      }
      case 'qty': {
        var key = btn.getAttribute('data-key');
        var line = AON.bag.lines().find(function (l) { return l.key === key; });
        if (line) AON.bag.setQty(key, line.qty + parseInt(btn.getAttribute('data-delta'), 10));
        break;
      }
      case 'remove': AON.bag.remove(btn.getAttribute('data-key')); toast('Item removed from your bag.'); break;
      case 'open-cookie-settings': e.preventDefault(); openCookieSettings(); break;
      case 'close-cookie-settings': closeCookieSettings(); break;
      case 'cookies-accept': saveConsent({ analytics: true, advertising: true }); break;
      case 'cookies-reject': saveConsent({ analytics: false, advertising: false }); break;
      case 'cookies-save': saveConsent(readToggles(dialog)); break;
      case 'cookies-save-inline': saveConsent(readToggles(btn.closest('form'))); break;
    }
  });

  /* ---------------- Language switch (placeholder) ---------------- */
  document.querySelectorAll('.lang-switch__btn').forEach(function (b) {
    b.addEventListener('click', function () {
      if (b.getAttribute('data-lang') === 'es') toast('The Castilian Spanish edition is being prepared.');
    });
  });

  /* ---------------- Init ---------------- */
  document.querySelectorAll('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });
  updateBagBadge();
  updateBanner();
  AON.consent.apply(AON.consent.get());
  if (location.hash === '#main' || location.hash === '#top') { try { history.replaceState(null, '', location.pathname + location.search); } catch (e) { location.hash = 'home'; } }
  render();
})(window.AON = window.AON || {});
