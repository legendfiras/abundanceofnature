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
    tagline: 'Live naturally · Live harmoniously · Live fully',
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

  AON.categories = [
    { id: 'fragrance', name: 'Fragrance', blurb: 'Botanical scents for body and home.', art: 'fragrance' },
    { id: 'beauty-wellness', name: 'Beauty & Wellness', blurb: 'Oils, balms and gentle daily care.', art: 'wellness' },
    { id: 'jewellery', name: 'Jewellery', blurb: 'Nature-inspired pieces to keep.', art: 'jewellery' },
    { id: 'books', name: 'Books', blurb: 'Reading for slower, fuller living.', art: 'books' }
  ];

  // shape: drawing used for the placeholder artwork (see AON.art below)
  AON.products = [
    { id: 'botanical-fragrance', name: 'Botanical fragrance', category: 'fragrance', price: 35.00, size: '50 ml', shape: 'perfume', featured: true,
      description: 'A fresh green fragrance with notes of fig leaf, bergamot and soft cedar.',
      specs: { Volume: '50 ml', Type: 'Eau de parfum', 'Key notes': 'Fig leaf, bergamot, cedar', Origin: 'Spain' } },
    { id: 'neroli-olive-eau-de-parfum', name: 'Neroli & Olive Blossom', category: 'fragrance', price: 42.00, size: '50 ml', shape: 'perfume2',
      description: 'A bright floral scent built around neroli and olive blossom.',
      specs: { Volume: '50 ml', Type: 'Eau de parfum', 'Key notes': 'Neroli, olive blossom, musk', Origin: 'Spain' } },
    { id: 'cedar-sage-room-mist', name: 'Cedar & Sage room mist', category: 'fragrance', price: 24.00, size: '100 ml', shape: 'mist',
      description: 'A light room spray for linen and living spaces.',
      specs: { Volume: '100 ml', Use: 'Room and linen', 'Key notes': 'Cedar, sage, rosemary' } },

    { id: 'rosehip-facial-oil', name: 'Rosehip facial oil', category: 'beauty-wellness', price: 28.00, size: '30 ml', shape: 'dropper', featured: true,
      description: 'A lightweight face oil with cold-pressed rosehip seed oil.',
      specs: { Volume: '30 ml', Skin: 'All skin types', Use: 'A few drops, morning or evening' } },
    { id: 'lavender-body-balm', name: 'Lavender body balm', category: 'beauty-wellness', price: 19.50, size: '100 g', shape: 'jar', featured: true,
      description: 'A rich balm with shea butter and lavender essential oil.',
      specs: { Weight: '100 g', Texture: 'Balm', 'Key ingredients': 'Shea butter, lavender oil' } },
    { id: 'olive-leaf-hand-cream', name: 'Olive leaf hand cream', category: 'beauty-wellness', price: 12.00, size: '75 ml', shape: 'tube',
      description: 'A quick-absorbing everyday hand cream.',
      specs: { Volume: '75 ml', Texture: 'Cream', 'Key ingredients': 'Olive oil, olive leaf extract' } },

    { id: 'leaf-pendant-necklace', name: 'Leaf pendant necklace', category: 'jewellery', price: 58.00, size: '45 cm chain', shape: 'necklace', featured: true,
      description: 'A delicate leaf pendant on a fine chain.',
      specs: { Material: 'Sterling silver', Chain: '45 cm', Clasp: 'Spring ring' } },
    { id: 'olive-branch-studs', name: 'Olive branch studs', category: 'jewellery', price: 39.00, size: 'Pair', shape: 'studs',
      description: 'Small olive-branch stud earrings for every day.',
      specs: { Material: 'Gold-plated sterling silver', Size: '12 mm', Back: 'Butterfly' } },
    { id: 'hammered-ring', name: 'Hammered band ring', category: 'jewellery', price: 32.00, size: 'Sizes 5–9', shape: 'ring', variants: ['5', '6', '7', '8', '9'],
      description: 'A hand-finished band with a softly hammered texture.',
      specs: { Material: 'Recycled brass', Width: '3 mm', Sizes: '5–9' } },

    { id: 'the-herbal-year', name: 'The Herbal Year', category: 'books', price: 22.00, size: 'Hardback · 240 pages', shape: 'book',
      description: 'A seasonal guide to growing and using everyday herbs.',
      specs: { Format: 'Hardback', Pages: '240', Language: 'English' } },
    { id: 'rituals-of-slow-living', name: 'Rituals of Slow Living', category: 'books', price: 18.00, size: 'Paperback · 192 pages', shape: 'book2',
      description: 'Short reflections and simple daily rituals.',
      specs: { Format: 'Paperback', Pages: '192', Language: 'English' } }
  ];

  /* Placeholder artwork (inline SVG). Replace with product photography:
     <img src="/media/products/{id}.webp" srcset="… 1x, … 2x" alt="{name}"> */
  var G = '#7b8553', D = '#3b4a33', Au = '#b89757', C = '#fcf9f4';
  var leaf = '<path d="M70 40c10-14 26-18 34-16-2 10-12 22-30 22" fill="' + G + '" opacity=".85"/>';
  AON.art = {
    perfume: '<svg viewBox="0 0 120 120"><rect x="50" y="18" width="20" height="14" rx="2" fill="' + Au + '"/><rect x="30" y="32" width="60" height="70" rx="12" fill="' + C + '" stroke="' + D + '" stroke-width="2"/><path d="M48 66c8-12 20-14 26-12-2 8-10 16-24 16" fill="' + G + '"/><line x1="44" y1="84" x2="76" y2="84" stroke="' + D + '" stroke-width="1.5"/></svg>',
    perfume2: '<svg viewBox="0 0 120 120"><circle cx="60" cy="20" r="9" fill="' + Au + '"/><rect x="54" y="26" width="12" height="10" fill="' + D + '"/><path d="M60 36c22 0 32 18 32 36s-14 30-32 30-32-12-32-30 10-36 32-36Z" fill="' + C + '" stroke="' + D + '" stroke-width="2"/><path d="M46 74c8-12 20-14 26-12-2 8-10 16-24 16" fill="' + G + '"/></svg>',
    mist: '<svg viewBox="0 0 120 120"><rect x="52" y="14" width="16" height="10" rx="2" fill="' + D + '"/><rect x="48" y="24" width="24" height="10" fill="' + Au + '"/><rect x="38" y="34" width="44" height="72" rx="8" fill="' + C + '" stroke="' + D + '" stroke-width="2"/><rect x="44" y="58" width="32" height="26" rx="2" fill="' + G + '" opacity=".25"/><path d="M50 76c6-10 14-12 20-10-2 6-8 12-18 12" fill="' + G + '"/></svg>',
    dropper: '<svg viewBox="0 0 120 120"><rect x="54" y="8" width="12" height="16" rx="6" fill="' + D + '"/><rect x="50" y="24" width="20" height="10" fill="' + Au + '"/><rect x="40" y="34" width="40" height="70" rx="10" fill="#c99a6b" opacity=".55" stroke="' + D + '" stroke-width="2"/><rect x="46" y="56" width="28" height="28" rx="2" fill="' + C + '"/><path d="M52 76c5-8 12-10 16-8-1 5-7 10-15 10" fill="' + G + '"/><path d="M60 108c-3 0-5-2-5-5 0-4 5-9 5-9s5 5 5 9c0 3-2 5-5 5Z" fill="' + Au + '"/></svg>',
    jar: '<svg viewBox="0 0 120 120"><rect x="28" y="36" width="64" height="16" rx="4" fill="' + D + '"/><rect x="24" y="52" width="72" height="48" rx="12" fill="' + C + '" stroke="' + D + '" stroke-width="2"/><path d="M48 82c8-12 20-14 26-12-2 8-10 16-24 16" fill="' + G + '"/><circle cx="76" cy="70" r="3" fill="' + Au + '"/></svg>',
    tube: '<svg viewBox="0 0 120 120"><g transform="rotate(-18 60 60)"><rect x="52" y="92" width="16" height="16" rx="2" fill="' + D + '"/><path d="M40 20h40l-8 72H48Z" fill="' + C + '" stroke="' + D + '" stroke-width="2"/><rect x="40" y="16" width="40" height="6" fill="' + Au + '"/><path d="M50 60c6-10 14-12 20-10-2 6-8 12-18 12" fill="' + G + '"/></g></svg>',
    necklace: '<svg viewBox="0 0 120 120"><path d="M22 18c0 40 18 58 38 58s38-18 38-58" fill="none" stroke="' + Au + '" stroke-width="2" stroke-dasharray="2 3"/><path d="M60 76c-8 6-10 18-6 28 10-4 14-16 6-28Z" fill="' + G + '"/><path d="M60 80v22" stroke="' + D + '" stroke-width="1"/></svg>',
    studs: '<svg viewBox="0 0 120 120"><g fill="' + Au + '"><path d="M34 70c-2-14 6-24 18-26 0 12-6 22-18 26Z"/><path d="M86 70c2-14-6-24-18-26 0 12 6 22 18 26Z"/></g><g fill="' + G + '"><circle cx="38" cy="50" r="4"/><circle cx="82" cy="50" r="4"/></g></svg>',
    ring: '<svg viewBox="0 0 120 120"><ellipse cx="60" cy="66" rx="30" ry="30" fill="none" stroke="' + Au + '" stroke-width="9"/><ellipse cx="60" cy="66" rx="30" ry="30" fill="none" stroke="' + D + '" stroke-width="1" stroke-dasharray="3 5" opacity=".5"/>' + leaf.replace('M70 40', 'M64 24') + '</svg>',
    book: '<svg viewBox="0 0 120 120"><rect x="30" y="16" width="60" height="88" rx="3" fill="' + G + '"/><rect x="30" y="16" width="8" height="88" fill="' + D + '"/><rect x="46" y="32" width="36" height="2" fill="' + C + '"/><rect x="46" y="38" width="26" height="2" fill="' + C + '"/><path d="M52 80c8-12 20-14 26-12-2 8-10 16-24 16" fill="' + C + '"/></svg>',
    book2: '<svg viewBox="0 0 120 120"><rect x="30" y="16" width="60" height="88" rx="3" fill="#d9cba7"/><rect x="30" y="16" width="8" height="88" fill="' + Au + '"/><circle cx="64" cy="58" r="16" fill="none" stroke="' + D + '" stroke-width="1.5"/><path d="M56 62c5-8 12-10 16-8-1 5-7 10-15 10" fill="' + G + '"/><rect x="48" y="86" width="32" height="2" fill="' + D + '"/></svg>',
    fragrance: null, wellness: null, jewellery: null, books: null
  };
  // Category illustrations reuse product drawings
  AON.art.fragrance = AON.art.perfume;
  AON.art.wellness = AON.art.dropper;
  AON.art.jewellery = AON.art.necklace;
  AON.art.books = AON.art.book;

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
