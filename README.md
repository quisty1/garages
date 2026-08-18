# Metall Montage 33

Landing page for a company that manufactures and installs metal garages and canopies. A static site with no build step and no dependencies.

JavaScript is ES modules, so the page needs HTTP (`localhost` or production). Opening `index.html` as a `file://` URL still shows the CSS and HTML fallback, but interactive JS will not run.

## Features

### Content and sections

- Hero with CTA, phone, and key benefits
- Garage carousels (4 sizes) and canopy carousels (5 types)
- Roof types, core and extra services
- “How we work” block (7 steps)
- FAQ accordion (one open item at a time)
- Contacts: phones, email, hours, MAX messenger

### Interface

- Industrial premium design: technical grid, outlined blocks, large type, focus on garage and canopy photos
- Responsive layout for phone, tablet, and desktop
- Fixed header with phone on desktop, theme switcher, and anchor navigation
- Mobile menu with backdrop, focus management, and Escape to close (from width ≤ 1360px)
- Dark and light theme toggle (SVG icons) — separate palettes, not a simple invert
- Auto theme from `prefers-color-scheme`, stored in `localStorage`
- Lightbox for carousel photos (←/→ and Escape)
- Smooth section reveal on scroll (`IntersectionObserver`)
- Back-to-top button after scrolling

### PWA and offline

- Web App Manifest (`manifest.json`) — install to the home screen
- Service Worker (`sw.js`) — caching and offline use
- Documents/code use network-first; precached hero/icons and runtime images use stale-while-revalidate (runtime cache is bounded)

### SEO and accessibility

- Meta tags, Open Graph, Twitter Card, geo tags
- JSON-LD: `HomeAndConstructionBusiness`, `WebSite`, service catalog with “from” prices
- `robots.txt` and `sitemap.xml`
- Semantic markup, image alts, ARIA on interactive elements
- `prefers-reduced-motion` respected in FAQ and animations

## Stack

| Layer  | Technologies                    |
| ------ | ------------------------------- |
| Markup | HTML5                           |
| Styles | CSS3 (variables, Grid, Flexbox) |
| Logic  | Vanilla JavaScript (ES2020+)    |

## Project structure

```
garages/
├── index.html              # Page markup (SEO stubs + sections)
├── site-data.js            # Single runtime source for company/site data
├── js/
│   ├── main.js             # Entry: init() and DOMContentLoaded
│   ├── shared.js           # Selectors, company, shared utilities
│   ├── theme.js            # Dark/light theme
│   ├── content.js          # DOM rendering from site data
│   ├── seo.js              # Meta tags and JSON-LD
│   ├── ui.js               # Menu, FAQ, lightbox, carousels, scroll
│   └── pwa.js              # Service Worker registration
├── styles.css              # CSS entry (@import of css/*)
├── css/
│   ├── tokens.css          # Color, layout, and motion variables
│   ├── base.css            # Reset, typography, reduced motion
│   ├── header.css          # Header, nav, mobile drawer
│   ├── hero.css            # Hero and buttons
│   ├── sections.css        # Shared sections, cards, services
│   ├── gallery.css         # Carousels and roof types
│   ├── workflow-faq.css    # Workflow steps and FAQ
│   ├── contact.css         # Contacts, messengers, footer
│   └── overlays.css        # Scroll-top, lightbox, reveal
├── manifest.json           # PWA manifest
├── sw.js                   # Service Worker
├── robots.txt              # Crawler rules
├── sitemap.xml             # Sitemap
├── package.json            # Zero-dependency validation commands
├── scripts/
│   └── validate-site.mjs   # Data, asset, PWA, sitemap, and accessibility checks
├── assets/
│   ├── logo-og.webp        # OG preview, JSON-LD
│   ├── logo-hero.webp      # Hero card (920w)
│   ├── logo-hero-680.webp  # Hero card (680w, preload)
│   ├── favicon.svg         # Tab icon
│   ├── favicon-48.png      # Header/footer logo and favicon
│   ├── favicon-96.png      # Header/footer logo 2x
│   ├── icon-192.webp       # PWA icon
│   ├── icon-512.webp       # PWA icon
│   ├── garage-6x4.webp     # Garage photos (+ *-560.webp previews)
│   ├── garage-6x6.webp
│   ├── garage-8x6.webp
│   ├── garage-6x8.webp
│   ├── canopy-car.webp     # Canopy photos (+ *-560.webp previews)
│   ├── canopy-gable.webp
│   ├── canopy-single-slope.webp
│   ├── canopy-two-cars.webp
│   └── canopy-house.webp
└── README.md
```

### JavaScript modules

`js/main.js` loads as an ES module and imports the rest:

| Module         | Contents                                                                                                                                                              |
| -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **shared.js**  | `company`, `SELECTORS`, `CAROUSEL_NAMES`, `$()`, `escapeHtml()`, `fillContainer()`, `fillDualContainers()`                                                            |
| **theme.js**   | `THEME_KEY`, `THEME_COLORS`, `initTheme`                                                                                                                              |
| **content.js** | `renderText`, `renderHeroMeta`, `renderPhones`, `renderServices`, `renderExtras`, `renderRoofs`, `renderCarousels`, `renderWorkflow`, `renderFaq`, `renderMessengers` |
| **seo.js**     | `renderSEO`, `renderJsonLd`, `buildAreaServedJsonLd`                                                                                                                  |
| **ui.js**      | FAQ accordion, mobile menu, lightbox, carousels, scroll reveal, scroll-to-top                                                                                         |
| **pwa.js**     | `registerServiceWorker`                                                                                                                                               |
| **main.js**    | `init()` + `DOMContentLoaded`                                                                                                                                         |

### CSS partials

`styles.css` only `@import`s files from `css/` (order is the cascade):

| File                 | Contents                                                                                          |
| -------------------- | ------------------------------------------------------------------------------------------------- |
| **tokens.css**       | Dark theme (`:root`), light (`data-theme`, `prefers-color-scheme`), z-index, spacing, transitions |
| **base.css**         | Reset, typography, `.container`, skip-link, reduced-motion, `:focus-visible`                      |
| **header.css**       | Header, nav, theme toggle, mobile drawer (`max-width: 1360px`)                                    |
| **hero.css**         | Hero, buttons, meta cards                                                                         |
| **sections.css**     | Shared `.section`, extras, advantages, price factors, services                                    |
| **gallery.css**      | Carousels and roof-type cards                                                                     |
| **workflow-faq.css** | Workflow steps and FAQ accordion                                                                  |
| **contact.css**      | Contacts, service area, messengers, footer                                                        |
| **overlays.css**     | Scroll-to-top, lightbox, scroll reveal                                                            |

## Local run

The site does not require installing packages.

**For development** — a local HTTP server (required for ES modules and the Service Worker):

```bash
# Python 3
python3 -m http.server 8080

# or npx (if Node.js is installed)
npx serve .
```

Open [http://localhost:8080](http://localhost:8080).

> The Service Worker registers only over HTTPS or on `localhost`.

## Editing content

All runtime content lives in the `company` object in `site-data.js`. HTML sections contain crawlable/no-JS fallbacks; on load, `init()` fills in the current data. Run `npm test` after edits to catch drift in key contacts and geography, structured data, assets, manifest, sitemap, and Service Worker behavior.

### Contacts and general info

```js
const company = {
  name: 'Металл Монтаж 33',
  shortName: 'ММ33',
  tagline: 'Гаражи и навесы из металла под ключ',
  phones: [
    { value: '+7 (904) 254-36-74', href: 'tel:+79042543674' },
    { value: '+7 (920) 343-47-27', href: 'tel:+79203434727' },
  ],
  email: 'MetallMontage33@yandex.ru',
  hours: 'Ежедневно 8:00–18:00',
  // ...
};
```

### Garages and canopies

The `garages` and `canopies` arrays drive the carousels:

```js
garages: [
  {
    title: 'Гараж 6×4 м',
    size: '6000 × 4000 × 3600 мм',
    meta: 'Длина 6 м · Ширина 4 м · Высота 3,6 м',
    img: './assets/garage-6x4.webp',
  },
  // ...
],
canopies: [
  {
    title: 'Навес для авто',
    img: './assets/canopy-car.webp',
  },
  // ...
],
```

To add or replace a photo, put a WebP file in `assets/` and set the `img` path. Carousels automatically get a `*-560.webp` preview via `carouselImgAttrs()`.

### Other fields

| Field in `site-data.js` | What it shows on the site                           |
| ----------------------- | --------------------------------------------------- |
| `hero`                  | Hero heading, copy, and meta cards                  |
| `services`              | List of core services                               |
| `roofs`                 | Roof type cards                                     |
| `extras`                | Extra services                                      |
| `workflow`              | Heading and “How we work” steps                     |
| `faq`                   | Questions and answers (`{ q, a }` array)            |
| `messengers`            | Messenger links                                     |
| `seo`                   | Title, description, keywords, URL, region, OG image |

After editing `company.seo`, `renderSEO()` updates meta tags and JSON-LD in `<head>`.

## Theme

- Default is the device system theme
- The header button toggles dark and light
- Choice is stored in `localStorage` under `mm33-theme`
- Dark theme: graphite background, warm copper-orange accent (`#d98232`)
- Light theme: warm technical background (`#f4efe6`), WCAG AA accent (`#98421b`)

Main CSS variables in `css/tokens.css`:

| Variable          | Purpose                                        |
| ----------------- | ---------------------------------------------- |
| `--primary`       | Copper-orange accent                           |
| `--bg`            | Page background                                |
| `--text`          | Primary text color                             |
| `--surface`       | Card and panel background                      |
| `--steel`         | Secondary “metal” accent for icons and details |
| `--container`     | Max content width (`1400px`)                   |
| `--header-height` | Header height (for anchor scrolling)           |

`theme-color` values are kept in sync in `js/theme.js` (`THEME_COLORS`), `index.html`, and `manifest.json`.

## PWA and Service Worker

| File            | Purpose                                                                             |
| --------------- | ----------------------------------------------------------------------------------- |
| `manifest.json` | Name, icons, `start_url`, `background_color` (`#111418`), `theme_color` (`#d98232`) |
| `sw.js`         | Precache of key files, caching strategies                                           |

When `CACHE_VERSION` changes, activation removes only outdated `mm33-*` caches; unrelated origin caches are preserved. Updates claim open clients without forcing a page reload. Navigation falls back to the canonical cached index on offline/5xx responses, including query/UTM URLs.

**Domain:** `manifest.json` sets `id`, `start_url`, and `scope` to `/`. If the domain or deploy path changes, update them together with `seo.siteUrl` in `site-data.js`.

## Validation

The repository includes a zero-dependency validation suite (Node.js 18+):

```bash
npm test
```

It checks JavaScript/JSON syntax, static/runtime JSON-LD parity, truthful “from” prices, geography, local assets, image sitemap structure, manifest invariants, core WCAG AA color pairs, Service Worker behavior, and basic accessibility contracts.

## Publishing

The site is static files only. Upload the repository contents to a host:

- [metallmontage33.ru](https://metallmontage33.ru/) — primary domain
- Netlify / Vercel / Cloudflare Pages
- Regular web hosting over FTP

`index.html` should be available at the site root URL (or a subpath if a base path is configured).

## SEO

### What is already set up

- Title, description, keywords with regional search terms
- Open Graph and Twitter Card
- JSON-LD: `HomeAndConstructionBusiness` (address, geo, hasMap), `WebSite`, `WebPage`, `Service` offers with `minPrice`, `FAQPage`
- `robots.txt` and `sitemap.xml` (including catalog images)
- Geo meta tags and a visible “Where we work” block with key cities
- Legal address in Vladimir (Verizino district, Kuibysheva St., 5g)
- One `h1`, heading hierarchy, image alts

### Before publishing on a new domain

1. Update the canonical URL and address in `site-data.js`:

```js
seo: {
  siteUrl: 'https://metallmontage33.ru',
  serviceArea: {
    featuredCities: ['Владимир', 'Ковров', /* ... */],
    regions: [
      {
        name: 'Владимирская область',
        cities: ['Владимир', 'Ковров', 'Муром', /* ... */],
      },
      { name: 'Московская область' },
      { name: 'Нижегородская область' },
      { name: 'Ивановская область' },
    ],
  },
  ogImage: './assets/logo-og.webp',
},
address: {
  streetAddress: 'ул. Куйбышева, 5г',
  addressNote: 'мкр. Веризино (Сновицы-Веризино)',
  addressLocality: 'Владимир',
  addressRegion: 'Владимирская область',
  postalCode: '600029',
  addressCountry: 'RU',
  latitude: 56.1605,
  longitude: 40.3734,
  mapUrl: 'https://yandex.ru/maps/?...',
}
```

2. Sync URLs in `index.html` (canonical, OG), `robots.txt`, `sitemap.xml`, and `manifest.json`, then run `npm test`; `renderSEO()` also fills runtime values from `company.seo`.

3. Register the site in [Yandex Webmaster](https://webmaster.yandex.ru/) and [Google Search Console](https://search.google.com/search-console), then submit `sitemap.xml`.

4. Create a listing in [Yandex Business](https://business.yandex.ru/) with the same address, phones, and photos.

5. Make sure `assets/logo-og.webp` is in place — it is used for OG preview, JSON-LD, and PWA.

6. If you have a Yandex Metrica ID or verification codes, add them to `<head>` in `index.html`.

### SEO fields in site-data.js

| Field                            | Purpose                                                 |
| -------------------------------- | ------------------------------------------------------- |
| `seo.siteUrl`                    | Canonical domain (no trailing `/`)                      |
| `seo.title`                      | Page title                                              |
| `seo.description`                | Description for search and social                       |
| `seo.keywords`                   | Keywords                                                |
| `seo.region`                     | Region codes (`RU-VLA, RU-MOW, RU-MOS, RU-NIZ, RU-IVA`) |
| `seo.serviceArea.regions`        | Service regions (with cities for JSON-LD)               |
| `seo.serviceArea.featuredCities` | Key cities for the “Where we work” block                |
| `seo.ogImage`                    | Social preview image                                    |
| `address`                        | Legal address, coordinates, and map link                |
| `serviceAreaSection`             | Headings and copy for the “Where we work” section       |

## Developer

The site was built by [Yaroslav Bragin](https://t.me/yar_bragin) — [Telegram](https://t.me/yar_bragin).

## License

Created for Metall Montage 33. All rights reserved.
