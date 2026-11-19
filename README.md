# Abundance of Nature — Front-end

Static front-end for the Abundance of Nature store (Spain), built from the
"Website Layouts for Spain" brief. Plain HTML, CSS and JavaScript — no build step.

## Run it
Open `index.html` in a browser, or serve the folder:

    python3 -m http.server 8000   # then visit http://localhost:8000

## Structure
    index.html          Shell: utility bar, header/nav, <main>, footer, cookie banner + dialog
    css/styles.css      Design tokens → base → layout → components → pages → responsive
    js/data.js          Site config, categories, products (illustrative), policy nav, cookies
    js/store.js         Bag, cookie consent and last-order state (localStorage, with fallback)
    js/views.js         Page templates
    js/app.js           Hash router, events, form validation, cookie UI, toasts
    assets/logo.png     Logo (transparent), assets/favicon.png

## Pages (hash routes → suggested production paths)
| Route | Production path | From layout |
|---|---|---|
| `#home` | `/` | Storefront + cookie banner (p.1) |
| `#shop`, `#shop-{category}` | `/shop`, `/shop/{category}` | added |
| `#product-{id}` | `/products/{id}` | added |
| `#bag` | `/bag` | added |
| `#checkout` | `/checkout` | p.2 |
| `#order-confirmation` | `/order/confirmation` | added |
| `#help` | `/help` | added (index) |
| `#legal-notice` | `/legal-notice` | p.3 |
| `#privacy-policy` | `/privacy-policy` | p.4 |
| `#cookie-policy` | `/cookie-policy` | p.5 |
| `#terms-and-conditions` | `/terms-and-conditions` | p.6 |
| `#delivery-and-shipping` | `/delivery-and-shipping` | p.7 |
| `#returns-and-refunds` | `/returns-and-refunds` | p.8 |
| `#withdrawal` | `/withdrawal` | online withdrawal form (p.1 footer, p.8) |
| `#contact` | `/contact` | p.9 |

## Back-end hooks (search for "PRODUCTION" / "TODO")
- Checkout → `POST /api/orders`, then hand off to the payment provider (SCA/3-D Secure).
  The confirmation page is a preview: no payment is taken.
- Contact form → `POST /api/contact`, routed to the verified support mailbox.
- Withdrawal form → `POST /api/withdrawals`, then email an acknowledgement.
- `AON.consent.apply()` → load analytics/advertising scripts only after consent.
- Replace the SVG product placeholders in `AON.art` with product photography.

## Still to confirm before launch (from the brief)
- Domain and support mailbox (shown as proposed); business telephone; Mercantile Registry entry.
- Products, prices and the €4.90 delivery charge are illustrative; delivery areas, carriers and times.
- Payment provider and final payment methods.
- Processors, retention periods and any international transfers (Privacy Policy).
- Cookie inventory once services are chosen.
- Return address, return charges and product-specific exclusions.
- Castilian Spanish edition of the pre-contract information (the ES switch is a placeholder).

## Accessibility notes
Skip link, landmark regions, `aria-current` on navigation, labelled form fields with
inline errors and an error summary, keyboard-operable cookie dialog (`<dialog>`),
visible focus styles, and reduced-motion support.
