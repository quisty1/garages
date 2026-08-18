// Shared company data, selectors, and DOM helpers used by the other modules.

// ── Data ────────────────────────────────────────────────

// Runtime data lives in site-data.js; HTML remains a crawlable/no-JS fallback.
// Interactive features still initialise if that data file cannot be loaded.
const company = globalThis.MM33_COMPANY || null;

// ── Constants ───────────────────────────────────────────

// Carousel names — data-carousel values and initCarousel() arguments.
const CAROUSEL_NAMES = ['garages', 'canopies'];

// Focusable controls used by the drawer and modal focus traps.
const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

// data-attribute selectors used in markup and JS.
const SELECTORS = {
  themeToggle: '[data-theme-toggle]',
  phone: '[data-phone]',
  phones: '[data-phones]',
  footerPhones: '[data-footer-phones]',
  services: '[data-services]',
  extras: '[data-extras]',
  advantages: '[data-advantages]',
  priceFactors: '[data-price-factors]',
  roofs: '[data-roofs]',
  workflow: '[data-workflow]',
  faq: '[data-faq]',
  featuredCities: '[data-featured-cities]',
  messengers: '[data-messengers]',
  footerMessengers: '[data-footer-messengers]',
  navToggle: '[data-nav-toggle]',
  nav: '[data-nav]',
  navBackdrop: '[data-nav-backdrop]',
  primaryPhoneLinks: '[data-primary-phone-link]',
  primaryPhoneValues: '[data-primary-phone-value]',
  carousel: (name) => `[data-carousel="${name}"]`,
  carouselTrack: '[data-carousel-track]',
  carouselPrev: '[data-carousel-prev]',
  carouselNext: '[data-carousel-next]',
  scrollTop: '.scroll-top',
};

// ── Utilities ───────────────────────────────────────────

// Shortcut for document.getElementById.
function $(id) {
  return document.getElementById(id);
}

// Set textContent by id (no-op if the element is missing).
function setTextById(id, text) {
  const el = $(id);
  if (el) el.textContent = text;
}

// Always return an array, so malformed optional data cannot abort the page.
function asArray(value) {
  return Array.isArray(value) ? value : [];
}

// Toggle the native hidden state without assuming an element exists.
function setHidden(element, hidden) {
  if (element) element.hidden = hidden;
}

// Visible, enabled controls within a container.
function getFocusable(container) {
  if (!container) return [];
  return Array.from(container.querySelectorAll(FOCUSABLE_SELECTOR)).filter(
    (element) =>
      !element.hidden && element.getAttribute('aria-hidden') !== 'true',
  );
}

// Apply/remove inert on every page region behind a modal overlay.
function setPageInert(inert) {
  document
    .querySelectorAll('.skip-link, header, main, footer, .scroll-top')
    .forEach((element) => {
      element.inert = inert;
    });
}

// Keep only the drawer and its toggle interactive while the menu is open.
function setMenuBackgroundInert(inert, header, toggle, nav) {
  document
    .querySelectorAll('.skip-link, main, footer, .scroll-top')
    .forEach((element) => {
      element.inert = inert;
    });

  header?.querySelectorAll('.header-inner > *').forEach((element) => {
    if (element !== toggle && element !== nav) element.inert = inert;
  });
}

// Escape a string for safe innerHTML insertion.
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// <img> attrs for carousel slides: srcset with a -560.webp preview.
// Preview path is .webp → -560.webp (see assets/).
function carouselImgAttrs(img) {
  const source = String(img || '');
  const small = source.replace(/\.webp$/, '-560.webp');
  return `src="${escapeHtml(source)}" srcset="${escapeHtml(small)} 560w, ${escapeHtml(source)} 680w" sizes="(max-width: 720px) 82vw, (max-width: 980px) 48vw, 520px" width="680" height="453" loading="lazy" decoding="async"`;
}

// SEO alt for garage and canopy photos in carousels.
function seoImageAlt(title, kind) {
  const lower = String(title || 'объект').toLowerCase();
  if (kind === 'garage') {
    return `Металлический ${lower} из сэндвич-панелей на сварном каркасе — Металл Монтаж 33`;
  }
  return `Металлический ${lower} под ключ — Металл Монтаж 33`;
}

// One-line address for UI and schema.
function formatAddressLine(address = company?.address) {
  if (!address) return '';
  const parts = [
    address.addressLocality ? `г. ${address.addressLocality}` : '',
    address.addressNote || '',
    address.streetAddress || '',
    address.postalCode || '',
  ].filter(Boolean);
  return parts.join(', ');
}

// Yandex Maps link from an address or a ready mapUrl.
function getMapUrl(address = company?.address) {
  if (!address) return '';
  if (address.mapUrl) return address.mapUrl;
  const query = [address.addressLocality, address.streetAddress]
    .filter(Boolean)
    .join(', ');
  if (!query) return '';
  return `https://yandex.ru/maps/?text=${encodeURIComponent(query)}`;
}

// Fill a container's innerHTML by selector. Returns the host element or null.
function fillContainer(selector, html) {
  const host = document.querySelector(selector);
  if (host) host.innerHTML = html;
  return host;
}

// Fill two linked containers (main block + footer).
// Used for phones and messengers.
function fillDualContainers(
  primarySelector,
  footerSelector,
  items,
  primaryFn,
  footerFn,
) {
  const safeItems = asArray(items).filter(Boolean);
  fillContainer(primarySelector, safeItems.map(primaryFn).join(''));
  fillContainer(footerSelector, safeItems.map(footerFn).join(''));
}

export {
  $,
  asArray,
  carouselImgAttrs,
  CAROUSEL_NAMES,
  company,
  escapeHtml,
  fillContainer,
  fillDualContainers,
  formatAddressLine,
  getFocusable,
  getMapUrl,
  SELECTORS,
  seoImageAlt,
  setHidden,
  setMenuBackgroundInert,
  setPageInert,
  setTextById,
};
