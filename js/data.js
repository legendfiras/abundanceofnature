/* ==========================================================================
   data.js — site configuration, catalogue and static content.
   Replace with API responses when the back end is ready
   (e.g. GET /api/products, GET /api/categories).
   NOTE: products, prices and the delivery charge are ILLUSTRATIVE,
   as stated in the layout brief.
   ========================================================================== */
(function (AON) {
  'use strict';

  AON.site = {
    name: 'Abundance of Nature',
    tagline: 'A house of lines',
    domain: 'abundanceofnature.com',
    email: 'support@abundanceofnature.com',
    operator: 'Beyond Properties (en constitución)',
    nif: 'B10974848',
    nifNote: 'provisional',
    addressLines: ['Calle Centro de Negocios Puerta de Banús, 45, planta E', '29660 Marbella (Málaga), Spain'],
    telephone: null,            // Pending confirmation
    mercantileRegistry: null,   // Pending confirmation
    currency: 'EUR',
    locale: 'en-IE',            // euro formatting: €35.00
    delivery: {
      // Single option per the checkout layout. Confirm carriers, areas and charges.
      methods: [
        { id: 'standard', name: 'Standard delivery', price: 4.90, note: 'Delivery estimate shown for your postcode', minDays: 2, maxDays: 5 }
      ],
      countries: [{ code: 'ES', name: 'Spain' }]
    }
  };

  /* Lines of the house. Add a line here when a sub-brand is ready.
     open: true links into the shop. The current catalogue belongs to the first line. */
  AON.maisons = [
    {
      id: 'rugzy',
      name: 'Rugzy',
      kicker: 'Line 01',
      blurb: 'Handmade bags. Curly cloth, shag, fringe and weave, finished by hand.',
      href: '#shop',
      image: 'assets/products/RGZ-P03-01.jpg',
      alt: 'Navy curly bag, Rugzy',
      open: true
    }
  ];

  /* Shop departments. Add or rename here; the home page and shop follow this list. */
  AON.categories = [
    { id: 'curly-bags', name: 'Curly Bags', blurb: 'Ruched texture, finished with a wooden handle.' },
    { id: 'shag-bags', name: 'Shag Bags', blurb: 'Soft, tactile totes and minis.' },
    { id: 'fringe-bags', name: 'Fringe Bags', blurb: 'A quiet tote with movement at the edge.' },
    { id: 'everyday-totes', name: 'Everyday Totes', blurb: 'Woven bags sized for the day.' }
  ];

  /* Catalogue — edit names, prices, sizes and image paths here.
     Prices are test figures in euros for design review (not catalogue retail).
     image: file in assets/products/. featured: true shows on the home page. */
  AON.products = [
    { id: 'navy-heart-curly', sku: 'RGZ-P03-01', name: 'Navy Curly Bag', category: 'curly-bags', price: 128, size: '43 × 16 cm', featured: true,
      image: 'assets/products/RGZ-P03-01.jpg',
      description: 'A navy curly bag with a heart-shaped wooden handle and a braided strap.',
      specs: { Size: '43 × 16 cm', Handle: 'Heart-shaped wood', Strap: 'Braided' } },
    { id: 'olive-heart-curly', sku: 'RGZ-P03-02', name: 'Olive Curly Bag', category: 'curly-bags', price: 142, size: '43 × 16 cm',
      image: 'assets/products/RGZ-P03-02.jpg',
      description: 'An olive curly bag with a heart-shaped wooden handle.',
      specs: { Size: '43 × 16 cm', Handle: 'Heart-shaped wood', Colour: 'Olive green' } },
    { id: 'burnt-orange-curly', sku: 'RGZ-P03-04', name: 'Burnt Orange Curly Bag', category: 'curly-bags', price: 118, size: '35 × 20 cm',
      image: 'assets/products/RGZ-P03-04.jpg',
      description: 'A burnt-orange curly bag with a heart-shaped wooden handle.',
      specs: { Size: '35 × 20 cm', Handle: 'Heart-shaped wood', Colour: 'Burnt orange' } },
    { id: 'burgundy-curly', sku: 'RGZ-P03-06', name: 'Burgundy Curly Bag', category: 'curly-bags', price: 96, size: '35 × 16 cm',
      image: 'assets/products/RGZ-P03-06.jpg',
      description: 'A burgundy curly bag with a wooden handle.',
      specs: { Size: '35 × 16 cm', Handle: 'Wood', Colour: 'Burgundy' } },
    { id: 'black-curly', sku: 'RGZ-P04-03', name: 'Black Curly Bag', category: 'curly-bags', price: 154, size: '30 × 16 cm',
      image: 'assets/products/RGZ-P04-03.jpg',
      description: 'A black curly bag with a wooden handle, in a smaller carry size.',
      specs: { Size: '30 × 16 cm', Handle: 'Wood', Colour: 'Black' } },

    { id: 'forest-shag-tote', sku: 'RGZ-P05-07', name: 'Forest Green Shag Tote', category: 'shag-bags', price: 86, size: '25 × 25 cm', featured: true,
      image: 'assets/products/RGZ-P05-07.jpg',
      description: 'A square shag tote in forest green, with a wooden handle.',
      specs: { Size: '25 × 25 cm', Handle: 'Wood', Colour: 'Forest green' } },
    { id: 'beige-shag-tote', sku: 'RGZ-P06-05', name: 'Natural Beige Shag Tote', category: 'shag-bags', price: 74, size: '25 × 25 cm',
      image: 'assets/products/RGZ-P06-05.jpg',
      description: 'A square shag tote in natural beige, with a wooden handle.',
      specs: { Size: '25 × 25 cm', Handle: 'Wood', Colour: 'Natural beige' } },
    { id: 'dusty-blue-shag', sku: 'RGZ-P05-04', name: 'Dusty Blue Shag Tote', category: 'shag-bags', price: 91, size: '25 × 25 cm',
      image: 'assets/products/RGZ-P05-04.jpg',
      description: 'A square shag tote in dusty blue, with a wooden handle.',
      specs: { Size: '25 × 25 cm', Handle: 'Wood', Colour: 'Dusty blue' } },
    { id: 'camel-shag-mini', sku: 'RGZ-P08-07', name: 'Camel Shag Mini', category: 'shag-bags', price: 108, size: '22 × 20 cm',
      image: 'assets/products/RGZ-P08-07.jpg',
      description: 'A camel shag mini with a wooden handle, tassel and shoulder strap.',
      specs: { Size: '22 × 20 cm', Handle: 'Wood', Colour: 'Camel' } },
    { id: 'golden-shag-tote', sku: 'RGZ-P06-01', name: 'Golden Yellow Shag Tote', category: 'shag-bags', price: 79, size: '25 × 25 cm',
      image: 'assets/products/RGZ-P06-01.jpg',
      description: 'A square shag tote in golden yellow, with a wooden handle.',
      specs: { Size: '25 × 25 cm', Handle: 'Wood', Colour: 'Golden yellow' } },

    { id: 'cream-fringe-tote', sku: 'RGZ-P10-07', name: 'Cream Fringe Tote', category: 'fringe-bags', price: 68, size: '25 × 30 cm', featured: true,
      image: 'assets/products/RGZ-P10-07.jpg',
      description: 'A cream fringe tote with a rounded wooden handle.',
      specs: { Size: '25 × 30 cm', Handle: 'Wood', Colour: 'Cream' } },
    { id: 'emerald-fringe-tote', sku: 'RGZ-P11-01', name: 'Emerald Fringe Tote', category: 'fringe-bags', price: 88, size: '25 × 30 cm',
      image: 'assets/products/RGZ-P11-01.jpg',
      description: 'An emerald green fringe tote.',
      specs: { Size: '25 × 30 cm', Style: 'Fringe tote', Colour: 'Emerald green' } },
    { id: 'red-fringe-tote', sku: 'RGZ-P10-03', name: 'Red Fringe Tote', category: 'fringe-bags', price: 72, size: '25 × 30 cm',
      image: 'assets/products/RGZ-P10-03.jpg',
      description: 'A bold red fringe tote.',
      specs: { Size: '25 × 30 cm', Style: 'Fringe tote', Colour: 'Red' } },
    { id: 'navy-fringe-tote', sku: 'RGZ-P11-09', name: 'Navy Fringe Tote', category: 'fringe-bags', price: 95, size: '25 × 30 cm',
      image: 'assets/products/RGZ-P11-09.jpg',
      description: 'A navy fringe tote.',
      specs: { Size: '25 × 30 cm', Style: 'Fringe tote', Colour: 'Navy' } },
    { id: 'beige-fringe-tote', sku: 'RGZ-P11-07', name: 'Beige Fringe Tote', category: 'fringe-bags', price: 64, size: '25 × 30 cm',
      image: 'assets/products/RGZ-P11-07.jpg',
      description: 'A natural beige fringe tote.',
      specs: { Size: '25 × 30 cm', Style: 'Fringe tote', Colour: 'Natural beige' } },

    { id: 'beige-woven-tote', sku: 'RGZ-P30-02', name: 'Beige Woven Tote', category: 'everyday-totes', price: 58, size: '50 × 40 cm', featured: true,
      image: 'assets/products/RGZ-P30-02.jpg',
      description: 'A beige woven tote, sized for everyday carry.',
      specs: { Size: '50 × 40 cm', Style: 'Woven tote', Colour: 'Beige' } },
    { id: 'black-woven-tote', sku: 'RGZ-P30-05', name: 'Black Woven Tote', category: 'everyday-totes', price: 76, size: '50 × 40 cm',
      image: 'assets/products/RGZ-P30-05.jpg',
      description: 'A black woven tote for everyday carry.',
      specs: { Size: '50 × 40 cm', Style: 'Woven tote', Colour: 'Black' } },
    { id: 'blush-woven-tote', sku: 'RGZ-P30-06', name: 'Blush Horizon Tote', category: 'everyday-totes', price: 84, size: '50 × 40 cm',
      image: 'assets/products/RGZ-P30-06.jpg',
      description: 'A blush woven tote with a soft horizon of colour.',
      specs: { Size: '50 × 40 cm', Style: 'Woven tote', Colour: 'Blush' } },
    { id: 'stripe-woven-tote', sku: 'RGZ-P30-03', name: 'Black & Beige Stripe Tote', category: 'everyday-totes', price: 62, size: '50 × 40 cm',
      image: 'assets/products/RGZ-P30-03.jpg',
      description: 'A woven tote in black and beige stripes.',
      specs: { Size: '50 × 40 cm', Style: 'Woven tote', Colour: 'Black and beige' } },
    { id: 'multicolor-woven-tote', sku: 'RGZ-P30-01', name: 'Multicolor Woven Tote', category: 'everyday-totes', price: 112, size: '50 × 40 cm',
      image: 'assets/products/RGZ-P30-01.jpg',
      description: 'A balanced multicolor woven tote.',
      specs: { Size: '50 × 40 cm', Style: 'Woven tote', Colour: 'Multicolor' } }
  ];

  /* Help & policies navigation (order matches the layouts) */
  AON.policyNav = [
    { route: 'legal-notice', label: 'Legal Notice', summary: 'Who operates the store and how to reach us.' },
    { route: 'privacy-policy', label: 'Privacy Policy', summary: 'How we use personal data and your rights.' },
    { route: 'cookie-policy', label: 'Cookie Policy', summary: 'Cookie categories and how to change your choice.' },
    { route: 'terms-and-conditions', label: 'Terms and Conditions', summary: 'Buying steps, prices, payment and confirmation.' },
    { route: 'delivery-and-shipping', label: 'Delivery and Shipping', summary: 'Delivery areas, costs, timing and tracking.' },
    { route: 'returns-and-refunds', label: 'Returns and Refunds', summary: 'How to withdraw, return goods and get a refund.' },
    { route: 'contact', label: 'Contact', summary: 'Customer support and business identification.' }
  ];

  AON.cookieCategories = [
    { id: 'necessary', name: 'Necessary', purpose: 'Keep the session, basket and cookie choices working.', when: 'Always on', locked: true },
    { id: 'analytics', name: 'Analytics', purpose: 'Measure visits and use of the shop.', when: 'With consent' },
    { id: 'advertising', name: 'Advertising', purpose: 'Personalise ads and measure ad performance, if enabled.', when: 'With consent' }
  ];

  /* To be completed once services are chosen. */
  AON.cookieInventory = [
    { name: 'aon_session', provider: 'Abundance of Nature', purpose: 'Keeps your session and bag', expiry: 'Session', category: 'Necessary' },
    { name: 'aon_consent', provider: 'Abundance of Nature', purpose: 'Stores your cookie choices', expiry: '6 months', category: 'Necessary' }
  ];

  AON.faqs = [
    { q: 'When will my order arrive?', a: 'Checkout shows the estimated delivery date for your postcode before you pay. Goods are delivered without undue delay and within 30 calendar days unless another period is agreed.' },
    { q: 'How do I return something?', a: 'For eligible goods you normally have 14 calendar days from delivery to tell us you wish to withdraw. Use the online withdrawal form or email support.' },
    { q: 'Are prices shown with VAT?', a: 'Yes. Prices are shown in euros and include applicable VAT. The delivery charge and total appear before payment.' },
    { q: 'How do I change my cookie choices?', a: 'Use Cookie settings in the footer at any time. Your latest saved choice applies.' }
  ];
})(window.AON = window.AON || {});
