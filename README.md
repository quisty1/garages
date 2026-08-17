# Metall Montage 33

Landing page for a company that manufactures and installs metal garages and canopies. A static site with no build step and no dependencies — it opens in the browser as-is.

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
- Mobile menu with backdrop and Escape to close (from width ≤ 860px)
- Dark and light theme toggle (SVG icons) — separate palettes, not a simple invert
- Auto theme from `prefers-color-scheme`, stored in `localStorage`
- Lightbox for carousel photos (←/→ and Escape)
- Smooth section reveal on scroll (`IntersectionObserver`)
- Back-to-top button after scrolling

### PWA and offline

- Web App Manifest (`manifest.json`) — install to the home screen
- Service Worker (`sw.js`) — caching and offline use
- HTML/CSS/JS update with network-first; images use cache-first

### SEO and accessibility

- Meta tags, Open Graph, Twitter Card, geo tags
- JSON-LD: `HomeAndConstructionBusiness`, `WebSite`, garage catalog
- `robots.txt` and `sitemap.xml`
- Semantic markup, image alts, ARIA on interactive elements
- `prefers-reduced-motion` respected in FAQ and animations

## Stack

| Layer  | Technologies                     |
| ------ | -------------------------------- |
| Markup | HTML5                            |
| Styles | CSS3 (variables, Grid, Flexbox)  |
| Logic  | Vanilla JavaScript (ES2020+)     |

## Project structure

```
garages/
├── index.html              # Page markup (SEO stubs + sections)
├── main.js                 # company object and all site logic
├── styles.css              # Styles, themes, components
├── manifest.json           # PWA manifest
├── sw.js                   # Service Worker
├── robots.txt              # Crawler rules
├── sitemap.xml             # Sitemap
├── assets/
│   ├── logo-og.webp        # OG preview, JSON-LD
│   ├── logo-hero.webp      # Hero card (920w)
│   ├── logo-hero-680.webp  # Hero card (680w, preload)
│   ├── logo-48.webp        # Header logo
│   ├── logo-96.webp        # Logo 2x
│   ├── logo-44.webp        # Footer logo
│   ├── favicon.svg         # Tab icon
│   ├── favicon-48.png      # Favicon PNG
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

### main.js sections

The file is organized top to bottom by logical blocks:

| Section            | Contents                                                                                                                                                              |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Data**           | `company` object — all site content                                                                                                                                   |
| **Constants**      | `THEME_KEY`, `SELECTORS`, `CAROUSEL_NAMES`, theme and roof SVG icons                                                                                                  |
| **Utilities**      | `$()`, `setTextById()`, `escapeHtml()`, `carouselImgAttrs()`, `getSiteUrl()`, `absUrl()`, `setMeta()`, `fillContainer()`, `fillDualContainers()`                      |
| **Theme**          | `getSystemTheme`, `applyTheme`, `initTheme`                                                                                                                           |
| **Rendering**      | `renderText`, `renderHeroMeta`, `renderPhones`, `renderServices`, `renderExtras`, `renderRoofs`, `renderCarousels`, `renderWorkflow`, `renderFaq`, `renderMessengers` |
| **SEO**            | `renderSEO`, `renderJsonLd`, `buildAreaServedJsonLd`                                                                                                                  |
| **Interactivity**  | FAQ accordion, mobile menu, lightbox, carousels, scroll reveal, scroll-to-top                                                                                         |
| **PWA**            | `registerServiceWorker`                                                                                                                                               |
| **Init**           | `init()` + `DOMContentLoaded`                                                                                                                                         |

### styles.css sections

| Section                    | Contents                                                                                                                 |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| **CSS variables**          | Dark theme (`:root`), light (`data-theme`, `prefers-color-scheme`), z-index, section spacing, transition                 |
| **Reset / base**           | `*`, `html`, `body`, typography                                                                                          |
| **Utilities**              | `.container`, `.skip-link`, `.section`                                                                                   |
| **Components**             | Header → Hero → Carousel → Roofs → Workflow → FAQ → Services → Contact/Footer → Scroll-to-top → Lightbox → Scroll reveal |
| **Industrial redesign**    | Industrial palette, grid, outlined cards, large slides, separate light-theme styles                                      |
| **Responsive**             | `@media (max-width: 1120px)`, `980px`, `860px` (mobile menu), `720px`                                                    |
| **prefers-reduced-motion** | FAQ and scroll reveal without animations                                                                                 |

## Local run

The site does not require installing packages. Opening `index.html` in a browser is enough.

**Quick way** — open `index.html` in a browser. The Service Worker and PWA may be limited in this mode (an origin is required, not `file://`).

**For development** — a local HTTP server:

```bash
# Python 3
python3 -m http.server 8080

# or npx (if Node.js is installed)
npx serve .
```

Open [http://localhost:8080](http://localhost:8080).

> The Service Worker registers only over HTTPS or on `localhost`.

## Editing content

All content lives in the `company` object in `main.js`. HTML sections contain stubs; on load, `init()` fills in the current data.

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

| Field in `main.js` | What it shows on the site                          |
| ------------------ | -------------------------------------------------- |
| `hero`             | Hero heading, copy, and meta cards                 |
| `services`         | List of core services                              |
| `roofs`            | Roof type cards                                    |
| `extras`           | Extra services                                     |
| `workflow`         | Heading and “How we work” steps                    |
| `faq`              | Questions and answers (`{ q, a }` array)           |
| `messengers`       | Messenger links                                    |
| `seo`              | Title, description, keywords, URL, region, OG image |

After editing `company.seo`, `renderSEO()` updates meta tags and JSON-LD in `<head>`.

## Theme

- Default is the device system theme
- The header button toggles dark and light
- Choice is stored in `localStorage` under `mm33-theme`
- Dark theme: graphite background, warm copper-orange accent (`#d98232`)
- Light theme: warm technical background (`#f4efe6`), deeper accent (`#bd6328`)

Main CSS variables in `styles.css` (**Industrial redesign** block):

| Variable          | Purpose                                               |
| ----------------- | ----------------------------------------------------- |
| `--primary`       | Copper-orange accent                                  |
| `--bg`            | Page background                                       |
| `--text`          | Primary text color                                    |
| `--surface`       | Card and panel background                             |
| `--steel`         | Secondary “metal” accent for icons and details        |
| `--container`     | Max content width (`1400px`)                          |
| `--header-height` | Header height (for anchor scrolling)                  |

`theme-color` values are kept in sync in `main.js` (`THEME_COLORS`), `index.html`, and `manifest.json`.

## PWA and Service Worker

| File            | Purpose                                                                                  |
| --------------- | ---------------------------------------------------------------------------------------- |
| `manifest.json` | Name, icons, `start_url`, `background_color` (`#111418`), `theme_color` (`#d98232`)      |
| `sw.js`         | Precache of key files, caching strategies                                                |

When the cache version (`CACHE` in `sw.js`) changes, old entries are removed on activate. After an SW update the page reloads automatically.

**Domain:** `manifest.json` sets `start_url` and `scope` to `/`. If the domain or deploy path changes, update them together with `seo.siteUrl` in `main.js`.

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
- JSON-LD: `HomeAndConstructionBusiness` (address, geo, hasMap), `WebSite`, `WebPage`, `Product` (garages and canopies), `FAQPage`
- `robots.txt` and `sitemap.xml` (including catalog images)
- Geo meta tags and a visible “Where we work” block with key cities
- Legal address in Vladimir (Verizino district, Kuibysheva St., 5g)
- One `h1`, heading hierarchy, image alts

### Before publishing on a new domain

1. Update the canonical URL and address in `main.js`:

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

2. Sync URLs in `index.html` (canonical, OG), `robots.txt`, `sitemap.xml`, and `manifest.json` — or rely on `renderSEO()`, which fills values from `company.seo` on load.

3. Register the site in [Yandex Webmaster](https://webmaster.yandex.ru/) and [Google Search Console](https://search.google.com/search-console), then submit `sitemap.xml`.

4. Create a listing in [Yandex Business](https://business.yandex.ru/) with the same address, phones, and photos.

5. Make sure `assets/logo-og.webp` is in place — it is used for OG preview, JSON-LD, and PWA.

6. If you have a Yandex Metrica ID or verification codes, add them to `<head>` in `index.html`.

### SEO fields in main.js

| Field                            | Purpose                                                  |
| -------------------------------- | -------------------------------------------------------- |
| `seo.siteUrl`                    | Canonical domain (no trailing `/`)                       |
| `seo.title`                      | Page title                                               |
| `seo.description`                | Description for search and social                        |
| `seo.keywords`                   | Keywords                                                 |
| `seo.region`                     | Region codes (`RU-VLA, RU-MOW, RU-MOS, RU-NIZ, RU-IVA`)  |
| `seo.serviceArea.regions`        | Service regions (with cities for JSON-LD)                |
| `seo.serviceArea.featuredCities` | Key cities for the “Where we work” block                 |
| `seo.ogImage`                    | Social preview image                                     |
| `address`                        | Legal address, coordinates, and map link                 |
| `serviceAreaSection`             | Headings and copy for the “Where we work” section        |

## Developer

The site was built by [Yaroslav Bragin](https://t.me/yar_bragin) — [Telegram](https://t.me/yar_bragin).

## License

Created for Metall Montage 33. All rights reserved.
