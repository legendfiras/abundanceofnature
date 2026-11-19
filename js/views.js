/* ==========================================================================
   views.js — page templates. Each view returns { title, html, nav, after? }.
   `nav` marks the active header item; `after` runs once the HTML is in the DOM.
   ========================================================================== */
(function (AON) {
  'use strict';

  var S = AON.site;
  var esc = AON.esc = function (s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };
  var price = AON.formatPrice;

  /* ---------- Icons ---------- */
  var ICON = {
    bag: '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 8h12l-1 12H7L6 8Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>',
    lock: '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>',
    truck: '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h11v10H3zM14 10h4l3 3v3h-7z"/><circle cx="7" cy="17.5" r="1.8"/><circle cx="17" cy="17.5" r="1.8"/></svg>',
    return: '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 14 4 9l5-5"/><path d="M4 9h11a5 5 0 0 1 0 10h-3"/></svg>',
    leaf: '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 19c0-8 6-14 14-14 0 8-6 14-14 14Z"/><path d="M5 19 13 11"/></svg>',
    check: '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12 5 5 9-10"/></svg>',
    heart: '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10Z"/></svg>',
    sun: '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6 7 7M17 17l1.4 1.4M5.6 18.4 7 17M17 7l1.4-1.4"/></svg>',
    mail: '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>'
  };
  AON.icons = ICON;

  function media(p, alt) {
    if (p && p.image) {
      return '<img class="product-photo" src="' + esc(p.image) + '" alt="' + esc(alt || '') + '">';
    }
    return '<img class="product-photo product-photo--mark" src="assets/logo.png" alt="' + esc(alt || S.name) + '">';
  }

  function categoryCover(c) {
    var p = AON.products.find(function (x) { return x.category === c.id; });
    return media(p, '');
  }

  function breadcrumb(items) {
    return '<nav class="breadcrumb" aria-label="Breadcrumb"><ol>' + items.map(function (it, i) {
      var last = i === items.length - 1;
      return '<li>' + (last ? '<span aria-current="page">' + esc(it[0]) + '</span>' : '<a href="#' + it[1] + '">' + esc(it[0]) + '</a>') + '</li>';
    }).join('') + '</ol></nav>';
  }

  function productCard(p) {
    var cat = AON.findCategory(p.category);
    var hasVariants = p.variants && p.variants.length;
    return '<article class="product-card">' +
      '<a class="product-card__media" href="#product-' + p.id + '" tabindex="-1" aria-hidden="true">' + media(p, '') + '</a>' +
      '<p class="product-card__cat">' + esc(cat.name) + '</p>' +
      '<h3 class="product-card__title"><a href="#product-' + p.id + '">' + esc(p.name) + '</a></h3>' +
      '<p class="product-card__meta">' + esc(p.size) + '</p>' +
      '<div class="product-card__foot"><span class="price">' + price(p.price) + '</span>' +
      (hasVariants
        ? '<a class="btn btn--outline" href="#product-' + p.id + '">Choose size</a>'
        : '<button type="button" class="btn btn--outline" data-action="add-to-bag" data-id="' + p.id + '">Add to bag</button>') +
      '</div></article>';
  }

  /* ---------- Shared policy shell ---------- */
  function sideNav(active) {
    var links = AON.policyNav.map(function (n) {
      return '<li><a href="#' + n.route + '"' + (n.route === active ? ' aria-current="page"' : '') + '>' + esc(n.label) + '</a></li>';
    }).join('');
    var options = '<option value="help"' + (active === 'help' ? ' selected' : '') + '>Help &amp; policies — overview</option>' +
      AON.policyNav.map(function (n) {
        return '<option value="' + n.route + '"' + (n.route === active ? ' selected' : '') + '>' + esc(n.label) + '</option>';
      }).join('');
    return '<aside>' +
      '<nav class="side-nav" aria-label="Help and policies">' +
        '<h2 class="side-nav__title"><a href="#help">Help &amp; policies</a></h2>' +
        '<ul>' + links + '</ul><hr>' +
        '<button type="button" class="link-btn" data-action="open-cookie-settings">Cookie settings</button>' +
      '</nav>' +
      '<div class="side-nav-select field"><label for="policy-jump">Help &amp; policies</label>' +
        '<select id="policy-jump" class="select" data-action="policy-jump">' + options + '</select></div>' +
    '</aside>';
  }

  function policyLinks() {
    return '<div class="policy-links"><div class="container policy-links__inner">' +
      '<a href="#legal-notice">Legal Notice</a><a href="#privacy-policy">Privacy Policy</a>' +
      '<a href="#cookie-policy">Cookie Policy</a><a href="#contact">Contact</a>' +
      '<button type="button" class="link-btn push" data-action="open-cookie-settings">Cookie settings</button>' +
      '</div></div>';
  }

  function policyPage(route, inner) {
    return '<div class="container policy-layout">' + sideNav(route) +
      '<article class="policy-article">' + inner + '</article></div>' + policyLinks();
  }

  function sec(title, body) { return '<section><h2>' + title + '</h2>' + body + '</section>'; }
  function mail() { return '<a href="mailto:' + S.email + '">' + S.email + '</a>'; }
  function pending(t) { return '<span class="pending">' + (t || 'Pending confirmation') + '</span>'; }

  /* Reusable field markup */
  function field(o) {
    var id = o.id, req = o.required !== false;
    var control;
    if (o.type === 'textarea') control = '<textarea class="textarea" id="' + id + '" name="' + o.name + '"' + (req ? ' required' : '') + ' aria-describedby="' + id + '-err"></textarea>';
    else if (o.type === 'select') control = '<select class="select" id="' + id + '" name="' + o.name + '"' + (req ? ' required' : '') + '>' + o.options + '</select>';
    else control = '<input class="input" id="' + id + '" name="' + o.name + '" type="' + (o.type || 'text') + '"' +
      (o.autocomplete ? ' autocomplete="' + o.autocomplete + '"' : '') +
      (o.placeholder ? ' placeholder="' + esc(o.placeholder) + '"' : '') +
      (o.inputmode ? ' inputmode="' + o.inputmode + '"' : '') +
      (o.maxlength ? ' maxlength="' + o.maxlength + '"' : '') +
      (req ? ' required' : '') + ' aria-describedby="' + id + '-err' + (o.hint ? ' ' + id + '-hint' : '') + '">';
    return '<div class="field' + (o.span ? ' span-2' : '') + '">' +
      '<label for="' + id + '">' + esc(o.label) + (req ? '' : ' <span class="optional">(optional)</span>') + '</label>' + control +
      (o.hint ? '<p class="field__hint" id="' + id + '-hint">' + o.hint + '</p>' : '') +
      '<p class="field__error" id="' + id + '-err"></p></div>';
  }
  AON.field = field;

  /* ======================================================================
     VIEWS
     ====================================================================== */
  AON.views = {};

  function openLine() {
    var list = AON.maisons || [];
    for (var i = 0; i < list.length; i++) if (list[i].open) return list[i];
    return null;
  }

  /* ---------- Home — the house, then the open line's products ---------- */
  AON.views.home = function () {
    var line = openLine();
    var list = AON.products.slice().sort(function (a, b) {
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    });
    return {
      title: (line ? line.name + ' · ' : '') + 'Abundance of Nature',
      nav: 'home',
      html:
        '<section class="house" aria-label="Abundance of Nature">' +
          '<img class="house__mark" src="assets/logo.png" alt="Abundance of Nature" width="240" height="142">' +
        '</section>' +
        '<section class="container home-edit" aria-label="' + esc(line ? line.name : 'Products') + '">' +
          '<div class="product-grid">' + list.map(productCard).join('') + '</div>' +
        '</section>'
    };
  };

  /* ---------- Shop ---------- */
  AON.views.shop = function (catId, sort) {
    var cat = catId ? AON.findCategory(catId) : null;
    var list = AON.products.filter(function (p) { return !cat || p.category === cat.id; });
    sort = sort || 'featured';
    list = list.slice().sort(function (a, b) {
      if (sort === 'price-asc') return a.price - b.price;
      if (sort === 'price-desc') return b.price - a.price;
      if (sort === 'name') return a.name.localeCompare(b.name);
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    });
    var chips = '<li><a class="chip" href="#shop"' + (!cat ? ' aria-current="page"' : '') + '>All</a></li>' +
      AON.categories.map(function (c) {
        return '<li><a class="chip" href="#shop-' + c.id + '"' + (cat && cat.id === c.id ? ' aria-current="page"' : '') + '>' + esc(c.name) + '</a></li>';
      }).join('');
    var opts = [['featured', 'Featured'], ['price-asc', 'Price: low to high'], ['price-desc', 'Price: high to low'], ['name', 'Name A–Z']]
      .map(function (o) { return '<option value="' + o[0] + '"' + (o[0] === sort ? ' selected' : '') + '>' + o[1] + '</option>'; }).join('');

    var line = openLine();
    return {
      title: (cat ? cat.name + ' · ' : '') + (line ? line.name + ' · ' : '') + 'Abundance of Nature',
      nav: 'shop',
      html:
        '<header class="shop-head"><div class="container">' +
          breadcrumb(cat ? [['The house', 'home'], [line ? line.name : 'Line', 'shop'], [cat.name]] : [['The house', 'home'], [line ? line.name : 'Shop']]) +
          '<p class="eyebrow">' + esc(line ? line.name : 'Line') + ' · a line of the house</p>' +
          '<h1>' + esc(cat ? cat.name : (line ? line.name : 'Shop')) + '</h1>' +
          '<p class="lead mb-0">' + esc(cat ? cat.blurb : (line ? line.blurb : 'The open line of the house.')) + '</p>' +
        '</div></header>' +
        '<div class="container section--tight" style="padding-block:var(--space-6) var(--space-8)">' +
          '<div class="shop-toolbar"><nav aria-label="Filter by category"><ul class="chips">' + chips + '</ul></nav>' +
            '<div class="sort"><label for="sort">Sort by</label><select id="sort" class="select" data-action="sort">' + opts + '</select></div></div>' +
          '<p class="result-count" aria-live="polite">' + list.length + ' product' + (list.length === 1 ? '' : 's') + '</p>' +
          '<div class="product-grid mt-5">' + list.map(productCard).join('') + '</div>' +
        '</div>'
    };
  };

  /* ---------- Product detail ---------- */
  AON.views.product = function (id) {
    var p = AON.findProduct(id);
    if (!p) return AON.views.notFound();
    var cat = AON.findCategory(p.category);
    var related = AON.products.filter(function (x) { return x.category === p.category && x.id !== p.id; }).slice(0, 4);
    var specs = Object.keys(p.specs).map(function (k) { return '<dt>' + esc(k) + '</dt><dd>' + esc(p.specs[k]) + '</dd>'; }).join('');
    var variant = p.variants ? field({ id: 'variant', name: 'variant', label: 'Ring size', type: 'select',
      options: '<option value="">Choose a size</option>' + p.variants.map(function (v) { return '<option>' + v + '</option>'; }).join('') }) : '';

    var line = openLine();
    return {
      title: p.name + ' · ' + (line ? line.name + ' · ' : '') + 'Abundance of Nature',
      nav: 'shop',
      html:
        '<div class="container" style="padding-top:var(--space-5)">' +
          breadcrumb([['The house', 'home'], [line ? line.name : 'Shop', 'shop'], [cat.name, 'shop-' + cat.id], [p.name]]) +
          '<div class="pdp">' +
            '<div class="pdp__media">' + media(p, p.name) + '</div>' +
            '<div class="pdp__info">' +
              '<p class="eyebrow">' + esc((line ? line.name + ' · ' : '') + cat.name) + '</p>' +
              '<h1>' + esc(p.name) + '</h1>' +
              '<p class="muted">' + esc(p.size) + (p.sku ? ' · <span class="sku">' + esc(p.sku) + '</span>' : '') + '</p>' +
              '<p class="pdp__price">' + price(p.price) + '</p>' +
              '<p class="pdp__vat">VAT included · delivery charge shown at checkout</p>' +
              '<p>' + esc(p.description) + '</p>' +
              '<form data-form="add-to-bag" data-id="' + p.id + '" novalidate>' + variant +
                '<div class="pdp__buy"><div class="qty" role="group" aria-label="Quantity">' +
                  '<button type="button" data-step="-1" aria-label="Decrease quantity">−</button>' +
                  '<input type="number" name="qty" value="1" min="1" max="10" aria-label="Quantity" inputmode="numeric">' +
                  '<button type="button" data-step="1" aria-label="Increase quantity">+</button></div>' +
                '<button type="submit" class="btn btn--primary btn--lg">' + ICON.bag + ' Add to bag</button></div>' +
              '</form>' +
              '<h2 class="h3 mt-6">Main characteristics</h2><dl class="spec-list">' + specs + '</dl>' +
              '<div class="accordion">' +
                '<details><summary>Delivery</summary><div><p>Enter your postcode at checkout to see the delivery options, charge and estimated date before you pay.</p><a href="#delivery-and-shipping">Delivery and Shipping Policy</a></div></details>' +
                '<details><summary>Returns</summary><div><p>For eligible goods, you normally have 14 calendar days from delivery to withdraw. Sealed goods that are unsuitable for return for health or hygiene reasons after unsealing may be excluded.</p><a href="#returns-and-refunds">Returns and Refunds Policy</a></div></details>' +
                '<details><summary>Materials &amp; care</summary><div><p>Keep the bag dry and reshape it gently by hand. Avoid prolonged sun and machine washing. Reference ' + esc(p.sku || p.id) + '.</p></div></details>' +
              '</div>' +
              '<div class="trust-row"><div>' + ICON.lock + 'Secure HTTPS payment</div><div>' + ICON.truck + 'Delivery estimate at checkout</div><div>' + ICON.return + '14-day withdrawal</div></div>' +
            '</div>' +
          '</div>' +
        '</div>' +
        (related.length ? '<section class="section section--tight" style="background:var(--white);border-top:1px solid var(--line)"><div class="container">' +
          '<div class="section__head"><h2>You may also like</h2><a href="#shop-' + cat.id + '">More ' + esc(cat.name) + '</a></div>' +
          '<div class="product-grid">' + related.map(productCard).join('') + '</div></div></section>' : '')
    };
  };

  /* ---------- Bag ---------- */
  AON.views.bag = function () {
    var lines = AON.bag.lines();
    if (!lines.length) {
      return { title: 'Bag · Abundance of Nature', nav: 'bag', html:
        '<div class="container"><div class="empty-state">' +
        '<img class="empty-state__mark" src="assets/logo.png" alt="" width="140" height="83">' +
        '<h1 class="h2">Your bag is empty</h1><p class="muted">Curly, shag, fringe and woven totes are waiting in the shop.</p>' +
        '<a class="btn btn--primary" href="#shop">Explore the shop</a></div></div>' };
    }
    var sub = AON.bag.subtotal();
    return {
      title: 'Bag · Abundance of Nature',
      nav: 'bag',
      html:
        '<div class="container"><header class="page-head">' + breadcrumb([['Home', 'home'], ['Bag']]) +
          '<h1>Your bag</h1><p>' + AON.bag.count() + ' item' + (AON.bag.count() === 1 ? '' : 's') + ' · You can still edit your bag at checkout.</p></header>' +
        '<div class="bag-layout"><div><ul class="bag-list">' + lines.map(function (l) {
          var p = l.product;
          return '<li class="bag-item">' +
            '<a class="bag-item__media" href="#product-' + p.id + '" aria-hidden="true" tabindex="-1">' + media(p, '') + '</a>' +
            '<div><h2 class="bag-item__title"><a href="#product-' + p.id + '">' + esc(p.name) + '</a></h2>' +
              '<p class="bag-item__meta">' + esc(p.size) + (l.variant ? ' · Size ' + esc(l.variant) : '') + '</p>' +
              '<div class="bag-item__actions"><div class="qty" role="group" aria-label="Quantity for ' + esc(p.name) + '">' +
                '<button type="button" data-action="qty" data-key="' + esc(l.key) + '" data-delta="-1" aria-label="Decrease quantity">−</button>' +
                '<output aria-live="polite">' + l.qty + '</output>' +
                '<button type="button" data-action="qty" data-key="' + esc(l.key) + '" data-delta="1" aria-label="Increase quantity">+</button></div>' +
                '<button type="button" class="link-btn small" data-action="remove" data-key="' + esc(l.key) + '">Remove</button></div></div>' +
            '<p class="bag-item__price">' + price(l.total) + (l.qty > 1 ? '<br><span class="bag-item__unit">' + price(p.price) + ' each</span>' : '') + '</p>' +
          '</li>';
        }).join('') + '</ul><p class="mt-5"><a href="#shop">← Continue shopping</a></p></div>' +
        '<aside class="panel panel--sand summary" aria-labelledby="bag-summary">' +
          '<h2 id="bag-summary">Order summary</h2>' +
          '<div class="summary__line"><span>Subtotal</span><span>' + price(sub) + '</span></div>' +
          '<div class="summary__line"><span>Delivery</span><span class="muted">Calculated at checkout</span></div>' +
          '<div class="summary__total"><span class="label">Total</span><span class="amount">' + price(sub) + '</span></div>' +
          '<p class="summary__vat">VAT included · delivery added at checkout</p>' +
          '<a class="btn btn--primary btn--block btn--lg" href="#checkout">Continue to checkout</a>' +
          '<div class="trust-row" style="grid-template-columns:1fr"><div>' + ICON.lock + 'Payment over an encrypted HTTPS connection</div></div>' +
        '</aside></div></div>'
    };
  };

  /* ---------- Checkout ---------- */
  AON.views.checkout = function () {
    var lines = AON.bag.lines();
    if (!lines.length) return AON.views.bag();
    var m = S.delivery.methods[0];
    var sub = AON.bag.subtotal();
    var countryOpts = S.delivery.countries.map(function (c) { return '<option value="' + c.code + '">' + c.name + '</option>'; }).join('');

    return {
      title: 'Checkout · Abundance of Nature',
      nav: 'bag',
      bodyClass: 'is-checkout',
      html:
        '<div class="container"><header class="page-head">' + breadcrumb([['Bag', 'bag'], ['Checkout']]) +
          '<h1>Checkout</h1><p>Review your details, delivery option and total before you pay.</p></header>' +
        '<form class="checkout-layout checkout-form" data-form="checkout" novalidate>' +
          '<div>' +
            '<div class="notice error-summary" role="alert" tabindex="-1" hidden><div><strong>Please check the following:</strong><ul></ul></div></div>' +
            '<fieldset><legend>Contact details</legend>' +
              field({ id: 'email', name: 'email', label: 'Email address', type: 'email', autocomplete: 'email', placeholder: 'Enter your email address' }) +
              '<div class="form-note"><span>We use this to manage your order.</span><a href="#privacy-policy">Privacy Policy</a></div>' +
            '</fieldset>' +
            '<fieldset><legend>Delivery address</legend><div class="form-grid">' +
              field({ id: 'fullname', name: 'fullname', label: 'Full name', autocomplete: 'name', span: true }) +
              field({ id: 'street', name: 'street', label: 'Street address', autocomplete: 'street-address', span: true }) +
              field({ id: 'postcode', name: 'postcode', label: 'Postcode', autocomplete: 'postal-code', inputmode: 'numeric', maxlength: 5 }) +
              field({ id: 'town', name: 'town', label: 'Town or city', autocomplete: 'address-level2' }) +
              field({ id: 'country', name: 'country', label: 'Country', type: 'select', options: countryOpts }) +
              field({ id: 'phone', name: 'phone', label: 'Phone for delivery', type: 'tel', autocomplete: 'tel', hint: 'Only used by the delivery company.' }) +
            '</div></fieldset>' +
            '<fieldset><legend>Delivery method</legend>' +
              S.delivery.methods.map(function (d, i) {
                return '<label class="option-card"><input type="radio" name="delivery" value="' + d.id + '"' + (i === 0 ? ' checked' : '') + '>' +
                  '<span class="option-card__body"><span class="option-card__row"><span>' + esc(d.name) + '</span><span>' + price(d.price) + '</span></span>' +
                  '<span class="option-card__sub" data-delivery-estimate>' + esc(d.note) + '</span></span></label>';
              }).join('') +
            '</fieldset>' +
          '</div>' +

          '<aside class="panel panel--sand summary" aria-labelledby="checkout-summary">' +
            '<div class="panel__head"><h2 id="checkout-summary">Order summary</h2><a class="small" href="#bag">Edit bag</a></div>' +
            '<ul class="summary__lines">' + lines.map(function (l) {
              return '<li class="summary__item"><div class="summary__line" style="padding:0"><span class="name">' + esc(l.product.name) + '</span><span>' + price(l.total) + '</span></div>' +
                '<div class="sub">' + esc(l.product.size) + (l.variant ? ' · Size ' + esc(l.variant) : '') + ' · ' + l.qty + ' item' + (l.qty > 1 ? 's' : '') + '</div></li>';
            }).join('') + '</ul>' +
            '<div class="summary__line"><span>Subtotal</span><span>' + price(sub) + '</span></div>' +
            '<div class="summary__line"><span>' + esc(m.name) + '</span><span>' + price(m.price) + '</span></div>' +
            '<div class="summary__total"><span class="label">Total</span><span class="amount">' + price(sub + m.price) + '</span></div>' +
            '<p class="summary__vat">VAT included</p>' +

            '<div class="secure-head">' + ICON.lock + '<h3>Secure payment</h3></div>' +
            '<label class="option-card"><input type="radio" name="payment" value="card" checked><span class="option-card__body"><span class="option-card__row"><span>Credit or debit card</span></span></span></label>' +
            '<div class="pay-provider">Card details are entered in the payment provider’s secure form, which loads here. They never pass through this website.</div>' +
            '<p class="small muted">The payment provider uses an encrypted HTTPS connection. Your bank may ask you to verify the payment.</p>' +
            '<div class="field"><label class="check"><input type="checkbox" name="terms" id="terms" required aria-describedby="terms-err">' +
              '<span>I have read and accept the <a href="#terms-and-conditions" target="_self">Terms and Conditions</a></span></label>' +
              '<p class="field__error" id="terms-err"></p></div>' +
            '<button type="submit" class="btn btn--primary btn--block btn--lg mt-4">Order with obligation to pay</button>' +
            '<p class="small muted mt-4 mb-0">We’ll email your order confirmation.</p>' +
          '</aside>' +
        '</form>' +
        '<nav class="legal-row" aria-label="Purchase information" style="margin-bottom:var(--space-7)">' +
          '<a href="#terms-and-conditions">Terms and Conditions</a><a href="#delivery-and-shipping">Delivery and Shipping</a>' +
          '<a href="#returns-and-refunds">Returns and Refunds</a><a href="#contact">Contact</a>' +
          '<button type="button" class="link-btn push" data-action="open-cookie-settings">Cookie settings</button></nav>' +
        '</div>'
    };
  };

  /* ---------- Order confirmation (preview) ---------- */
  AON.views.orderConfirmation = function () {
    var o = AON.orders.last();
    if (!o) return AON.views.notFound();
    return {
      title: 'Order received · Abundance of Nature',
      nav: '',
      html:
        '<div class="container"><div class="confirm">' +
          '<img class="confirm__logo" src="assets/logo.png" alt="Abundance of Nature" width="140" height="83">' +
          '<div class="confirm__mark">' + ICON.check + '</div>' +
          '<p class="eyebrow">Order ' + esc(o.number) + '</p>' +
          '<h1>Thank you, ' + esc(o.firstName) + '</h1>' +
          '<p class="lead">We’ll email your order confirmation and a copy of the purchase terms to <strong>' + esc(o.email) + '</strong>.</p>' +
          '<div class="notice"><p><strong>Front-end preview:</strong> no payment provider is connected yet, so no payment was taken and no email was sent.</p></div>' +
          '<div class="panel panel--sand">' +
            '<h2 class="h3">Order summary</h2>' +
            o.lines.map(function (l) { return '<div class="summary__line"><span>' + esc(l.name) + ' × ' + l.qty + '</span><span>' + price(l.total) + '</span></div>'; }).join('') +
            '<div class="summary__line"><span>' + esc(o.deliveryName) + '</span><span>' + price(o.delivery) + '</span></div>' +
            '<div class="summary__total"><span class="label">Total</span><span class="amount">' + price(o.total) + '</span></div>' +
            '<p class="summary__vat">VAT included</p>' +
            '<h3 class="h3 mt-5" style="font-size:1.1rem">Delivering to</h3><p class="small mb-0">' + esc(o.address) + '</p>' +
            (o.estimate ? '<p class="small muted mb-0">Estimated delivery: ' + esc(o.estimate) + '</p>' : '') +
          '</div>' +
          '<div class="actions-row mt-6" style="justify-content:center"><a class="btn btn--primary" href="#shop">Continue shopping</a>' +
          '<a class="btn btn--outline" href="#returns-and-refunds">Returns and Refunds</a></div>' +
        '</div></div>'
    };
  };

  /* ---------- Help & policies index ---------- */
  AON.views.help = function () {
    return {
      title: 'Help & policies · Abundance of Nature',
      nav: 'help',
      html: policyPage('help',
        '<h1>Help &amp; policies</h1><p class="lead">Everything about buying, delivery, returns and your data.</p>' +
        '<div class="help-grid">' + AON.policyNav.map(function (n) {
          return '<a class="panel help-card" href="#' + n.route + '"><h2>' + esc(n.label) + '</h2><p>' + esc(n.summary) + '</p></a>';
        }).join('') +
        '<a class="panel help-card panel--sand" href="#withdrawal"><h2>Withdraw from the contract</h2><p>Use the online withdrawal form for an eligible purchase.</p></a></div>' +
        '<div class="faq"><h2 class="h3">Frequently asked questions</h2><div class="accordion">' +
          AON.faqs.map(function (f) { return '<details><summary>' + esc(f.q) + '</summary><div><p class="mb-0">' + esc(f.a) + '</p></div></details>'; }).join('') +
        '</div></div>')
    };
  };

  /* ---------- Legal Notice ---------- */
  AON.views['legal-notice'] = function () {
    return {
      title: 'Legal Notice · Abundance of Nature', nav: 'help',
      html: policyPage('legal-notice',
        '<h1>Legal Notice</h1><p class="lead">The information below identifies the business operating the Abundance of Nature store.</p>' +
        '<table class="data-table data-table--kv"><tbody>' +
          '<tr><th scope="row">Trading name</th><td>' + S.name + '</td></tr>' +
          '<tr><th scope="row">Website operator</th><td>' + S.operator + '</td></tr>' +
          '<tr><th scope="row">Tax ID (NIF)</th><td>' + S.nif + ' · ' + S.nifNote + '</td></tr>' +
          '<tr><th scope="row">Registered address</th><td>' + S.addressLines.join('<br>') + '</td></tr>' +
          '<tr><th scope="row">Mercantile Registry</th><td>' + (S.mercantileRegistry || pending('Registration details pending confirmation')) + '</td></tr>' +
          '<tr><th scope="row">Website domain</th><td>' + S.domain + '</td></tr>' +
          '<tr><th scope="row">Support email</th><td>' + mail() + '</td></tr>' +
          '<tr><th scope="row">Telephone</th><td>' + (S.telephone || pending()) + '</td></tr>' +
        '</tbody></table>' +
        sec('Using this website', '<p>You can browse products and place orders through the store. The <a href="#terms-and-conditions">Terms and Conditions</a> apply to purchases. The <a href="#privacy-policy">Privacy Policy</a> explains how the store uses personal information.</p>') +
        sec('Enquiries and complaints', '<p>Email ' + mail() + ' for website enquiries, requests and complaints. Include your order number if you are contacting us about a purchase.</p>'))
    };
  };

  /* ---------- Privacy Policy ---------- */
  AON.views['privacy-policy'] = function () {
    return {
      title: 'Privacy Policy · Abundance of Nature', nav: 'help',
      html: policyPage('privacy-policy',
        '<h1>Privacy Policy</h1><p class="lead">This policy explains how we handle your personal information when you use the store, order or contact us.</p>' +
        sec('Who is responsible for your data?', '<p>' + S.operator + ' is the data controller. See the <a href="#legal-notice">Legal Notice</a> for the registered address. Email ' + mail() + ' for privacy requests.</p>') +
        sec('What we use and why',
          '<table class="data-table"><thead><tr><th scope="col">Legal basis</th><th scope="col">What we use it for</th></tr></thead><tbody>' +
          '<tr><td><strong>Contract</strong></td><td>Contact, order, billing and delivery details to answer pre-purchase requests, fulfil orders and ship goods.</td></tr>' +
          '<tr><td><strong>Legal obligation</strong></td><td>Invoice and transaction records to meet applicable tax and accounting obligations.</td></tr>' +
          '<tr><td><strong>Consent</strong></td><td>Optional analytics or advertising cookies when you enable them in <button type="button" class="link-btn" data-action="open-cookie-settings">Cookie settings</button>.</td></tr>' +
          '</tbody></table>') +
        sec('Who receives personal information?', '<p>The payment provider, delivery company and providers that run the site receive the data they need for their service. We may share records with authorities where the law requires it.</p>') +
        sec('How long do we keep it?', '<p>We keep information for as long as needed to manage the purchase or enquiry and for applicable legal retention and claims periods. The <a href="#cookie-policy">cookie inventory</a> lists the relevant cookie lifetimes.</p>') +
        sec('Your data protection rights', '<p>You can request access, correction, erasure, restriction or portability, object to processing where applicable, or withdraw consent. You can lodge a complaint with the Spanish Data Protection Agency (AEPD) at <a href="https://www.aepd.es" rel="noopener">aepd.es</a>.</p>'))
    };
  };

  /* ---------- Cookie Policy ---------- */
  AON.views['cookie-policy'] = function () {
    return {
      title: 'Cookie Policy · Abundance of Nature', nav: 'help',
      html: policyPage('cookie-policy',
        '<h1>Cookie Policy</h1><p class="lead">Cookies help the shop work and, where you choose, help us measure visits or personalise ads.</p>' +
        '<table class="data-table"><thead><tr><th scope="col">Category</th><th scope="col">Purpose</th><th scope="col">When it runs</th></tr></thead><tbody>' +
          AON.cookieCategories.map(function (c) { return '<tr><td><strong>' + c.name + '</strong></td><td>' + c.purpose + '</td><td>' + c.when + '</td></tr>'; }).join('') +
        '</tbody></table>' +
        '<form class="panel panel--sand mt-5" data-form="cookie-inline" aria-labelledby="inline-cookie-title">' +
          '<h2 class="h3" id="inline-cookie-title">Cookie settings</h2>' +
          '<div class="consent-list" data-consent-list></div>' +
          '<div class="actions-row"><button type="button" class="btn btn--primary" data-action="cookies-accept">Accept all</button>' +
          '<button type="button" class="btn btn--primary" data-action="cookies-reject">Reject all</button>' +
          '<button type="button" class="btn btn--outline" data-action="cookies-save-inline">Save selection</button></div>' +
          '<p class="small muted mt-4 mb-0" data-consent-status></p>' +
        '</form>' +
        sec('Change or withdraw consent', '<p>Use Cookie settings in the footer at any time. Optional cookies stay off until you choose to allow them. Your latest saved choice applies.</p>') +
        sec('Cookie inventory', '<table class="data-table"><thead><tr><th scope="col">Cookie name</th><th scope="col">Provider</th><th scope="col">Purpose</th><th scope="col">Expiry</th></tr></thead><tbody>' +
          AON.cookieInventory.map(function (c) { return '<tr><td><code>' + c.name + '</code></td><td>' + c.provider + '</td><td>' + c.purpose + '</td><td>' + c.expiry + '</td></tr>'; }).join('') +
          '</tbody></table><p class="small pending mb-0">Analytics and advertising cookies will be listed here once those services are chosen.</p>'))
    };
  };

  /* ---------- Terms and Conditions ---------- */
  AON.views['terms-and-conditions'] = function () {
    return {
      title: 'Terms and Conditions · Abundance of Nature', nav: 'help',
      html: policyPage('terms-and-conditions',
        '<h1>Terms and Conditions</h1><p class="lead">These terms apply to purchases through the Abundance of Nature store. You can save or print them before placing an order.</p>' +
        sec('Seller', '<p>The seller is ' + S.operator + '. Company information is available in the <a href="#legal-notice">Legal Notice</a>. For order enquiries or complaints, email ' + mail() + '.</p>') +
        sec('Products and placing an order', '<p>Product pages show their main characteristics and price. You can edit your bag, address and delivery method before committing to the purchase. The final order button makes the obligation to pay explicit.</p>') +
        sec('Prices and payment', '<p>Prices are shown in euros and include applicable VAT. The selected delivery charge and total are shown before payment. The payment provider processes card payments over an encrypted connection.</p>') +
        sec('Order confirmation', '<p>We email the order details and a copy of the purchase terms after you place the order. Keep this email for your records.</p>') +
        sec('Delivery, returns and guarantees', '<p>See the Delivery and Shipping Policy for costs and timeframes. The Returns and Refunds Policy explains withdrawal and refunds. Statutory product guarantees and remedies apply.</p>' +
          '<div class="actions-row"><a class="btn btn--outline" href="#delivery-and-shipping">Delivery and Shipping Policy</a><a class="btn btn--outline" href="#returns-and-refunds">Returns and Refunds Policy</a></div>'))
    };
  };

  /* ---------- Delivery and Shipping ---------- */
  AON.views['delivery-and-shipping'] = function () {
    return {
      title: 'Delivery and Shipping · Abundance of Nature', nav: 'help',
      html: policyPage('delivery-and-shipping',
        '<h1>Delivery and Shipping Policy</h1><p class="lead">Enter your delivery country and postcode at checkout to see the options for your address.</p>' +
        '<table class="data-table data-table--kv"><caption class="sr-only">What checkout shows before you pay</caption><thead><tr><th colspan="2" style="background:var(--sage-100)!important">What checkout shows before you pay</th></tr></thead><tbody>' +
          '<tr><th scope="row">Destination</th><td>Available areas for your country and postcode</td></tr>' +
          '<tr><th scope="row">Cost</th><td>The charge for the chosen delivery option</td></tr>' +
          '<tr><th scope="row">Timing</th><td>The estimated delivery date or range</td></tr>' +
        '</tbody></table>' +
        sec('Delivery timeframes', '<p>The delivery timeframe for your order appears before you pay. Unless another period is agreed, goods are delivered without undue delay and within 30 calendar days of the contract.</p>') +
        sec('Dispatch and tracking', '<p>The order confirmation shows your delivery details. When your parcel ships, we email any tracking information available for the selected service.</p>') +
        sec('Address changes and delivery problems', '<p>If you need to correct an address or a parcel is delayed, missing or damaged, email ' + mail() + ' with your order number so we can look into it.</p>') +
        '<p class="mt-6"><a class="btn btn--primary" href="#' + (AON.bag.count() ? 'checkout' : 'shop') + '">' + (AON.bag.count() ? 'Continue to checkout' : 'Explore the shop') + '</a></p>')
    };
  };

  /* ---------- Returns and Refunds ---------- */
  AON.views['returns-and-refunds'] = function () {
    return {
      title: 'Returns and Refunds · Abundance of Nature', nav: 'help',
      html: policyPage('returns-and-refunds',
        '<h1>Returns and Refunds Policy</h1><p class="lead">Use the online option below or email us if you want to withdraw from an eligible purchase.</p>' +
        sec('Time to withdraw', '<p>For eligible goods, you normally have 14 calendar days from delivery to tell us you wish to withdraw. If goods from a single order arrive separately, the period normally starts when the last item arrives.</p>') +
        sec('Returning the goods', '<p>Send the goods back within 14 calendar days after you tell us you wish to withdraw. Direct return costs may be yours where the law allows and we told you before you bought the goods.</p>') +
        sec('Refunds', '<p>We refund the eligible amount, including standard outbound delivery where applicable, within 14 calendar days of your notice. We use the original payment method unless you agree otherwise. Where permitted, we may wait for the goods or proof of return, whichever comes first.</p>') +
        sec('Exceptions and problems with goods', '<p>Legal exceptions may apply to clearly personalised goods and certain sealed goods unsuitable for return for health or hygiene reasons after unsealing. If an item is damaged, faulty or differs from your order, contact us about your statutory rights.</p>') +
        '<div class="panel panel--sand mt-6"><h2 class="h3 mb-0">Start a withdrawal</h2><p class="small muted">Have your order number and email address ready.</p>' +
          '<div class="actions-row" style="align-items:center"><a class="btn btn--primary" href="#withdrawal">Withdraw from the contract here</a><a href="mailto:' + S.email + '">Email support</a></div></div>')
    };
  };

  /* ---------- Contact ---------- */
  AON.views.contact = function () {
    return {
      title: 'Contact · Abundance of Nature', nav: 'contact',
      html: policyPage('contact',
        '<h1>Contact</h1><p class="lead">Contact us for help with a purchase, delivery, return or privacy request.</p>' +
        '<div class="panel panel--sage support-box"><p class="label">Customer support</p><p class="value">' + mail() + '</p></div>' +
        '<form class="mt-6" data-form="contact" novalidate>' +
          '<h2>Send us a message</h2>' +
          '<div class="form-grid">' +
            field({ id: 'c-name', name: 'name', label: 'Full name', autocomplete: 'name' }) +
            field({ id: 'c-email', name: 'email', label: 'Email address', type: 'email', autocomplete: 'email' }) +
            field({ id: 'c-order', name: 'order', label: 'Order number', required: false, span: true, placeholder: 'e.g. AON-10234' }) +
            field({ id: 'c-topic', name: 'topic', label: 'Topic', type: 'select', span: true, options:
              '<option value="">Choose a topic</option><option>Order or payment</option><option>Delivery</option><option>Return or withdrawal</option><option>Privacy request</option><option>Something else</option>' }) +
            field({ id: 'c-message', name: 'message', label: 'Message', type: 'textarea', span: true }) +
          '</div>' +
          '<div class="form-note"><span>We use these details to respond to your enquiry.</span><a href="#privacy-policy">Privacy Policy</a></div>' +
          '<button type="submit" class="btn btn--primary mt-4">Send message</button>' +
          '<div class="mt-4" data-form-status aria-live="polite"></div>' +
        '</form>' +
        '<div class="panel panel--sand business-id mt-6"><div class="panel__head"><h2 class="h3">Business identification</h2><a class="small" href="#legal-notice">Legal Notice</a></div>' +
          '<p class="strong">' + S.operator + '</p><p>Provisional NIF ' + S.nif + '</p><p>' + S.addressLines.join('<br>') + '</p></div>')
    };
  };

  /* ---------- Withdrawal form (online withdrawal function) ---------- */
  AON.views.withdrawal = function () {
    return {
      title: 'Withdraw from the contract · Abundance of Nature', nav: 'help',
      html: policyPage('returns-and-refunds',
        breadcrumb([['Help & policies', 'help'], ['Returns and Refunds', 'returns-and-refunds'], ['Withdrawal']]) +
        '<h1>Withdraw from the contract</h1><p class="lead">Use this form to tell us you wish to withdraw from an eligible purchase. We’ll send an acknowledgement to your email address.</p>' +
        '<form data-form="withdrawal" novalidate><div class="form-grid">' +
          field({ id: 'w-name', name: 'name', label: 'Full name', autocomplete: 'name' }) +
          field({ id: 'w-email', name: 'email', label: 'Email address used for the order', type: 'email', autocomplete: 'email' }) +
          field({ id: 'w-order', name: 'order', label: 'Order number', placeholder: 'e.g. AON-10234' }) +
          field({ id: 'w-received', name: 'received', label: 'Date received', type: 'date', required: false }) +
          '<div class="field span-2"><span class="label">What are you withdrawing from?</span>' +
            '<label class="option-card"><input type="radio" name="scope" value="all" checked><span class="option-card__body"><span class="option-card__row">The whole order</span></span></label>' +
            '<label class="option-card"><input type="radio" name="scope" value="some"><span class="option-card__body"><span class="option-card__row">Some items</span><span class="option-card__sub">List them in the box below</span></span></label></div>' +
          field({ id: 'w-items', name: 'items', label: 'Items and quantities', type: 'textarea', required: false, span: true }) +
          '<div class="field span-2"><label class="check"><input type="checkbox" name="confirm" required aria-describedby="w-confirm-err">' +
            '<span>I/We hereby give notice that I/We withdraw from my/our contract of sale of the goods listed above.</span></label><p class="field__error" id="w-confirm-err"></p></div>' +
        '</div>' +
        '<div class="form-note"><span>We use these details to process your withdrawal.</span><a href="#privacy-policy">Privacy Policy</a></div>' +
        '<button type="submit" class="btn btn--primary btn--lg mt-4">Confirm withdrawal</button>' +
        '<div class="mt-4" data-form-status aria-live="polite"></div></form>')
    };
  };

  /* ---------- 404 ---------- */
  AON.views.notFound = function () {
    return {
      title: 'Page not found · Abundance of Nature', nav: '',
      html: '<div class="container not-found"><p class="eyebrow">404</p><h1>We couldn’t find that page</h1>' +
        '<p class="lead">It may have moved, or the link may be incomplete.</p>' +
        '<div class="actions-row" style="justify-content:center"><a class="btn btn--primary" href="#home">Back to home</a><a class="btn btn--outline" href="#shop">Explore the shop</a></div></div>'
    };
  };
})(window.AON = window.AON || {});
