// Render page sections from company data into the static HTML fallback.
import {
  $,
  asArray,
  carouselImgAttrs,
  CAROUSEL_NAMES,
  company,
  escapeHtml,
  fillContainer,
  fillDualContainers,
  formatAddressLine,
  getMapUrl,
  SELECTORS,
  seoImageAlt,
  setHidden,
  setTextById,
} from './shared.js';

// Roof-type SVGs for [data-roofs] cards.
const ROOF_ICONS = {
  gable:
    '<svg viewBox="0 0 64 40" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M4 34 L32 8 L60 34" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/><line x1="4" y1="34" x2="60" y2="34" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></svg>',
  side: '<svg viewBox="0 0 64 40" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M6 12 L58 32" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/><line x1="6" y1="34" x2="58" y2="34" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></svg>',
  back: '<svg viewBox="0 0 64 40" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M58 12 L6 32" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/><line x1="6" y1="34" x2="58" y2="34" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></svg>',
};

// Hero meta cards: sizes, warranty, geography tags.
function renderHeroMeta() {
  const h = company.hero || {};
  setTextById('hero-sizes', h.sizes?.value ?? 'Любые');
  setTextById('hero-sizes-detail', h.sizes?.detail ?? 'по вашим чертежам');
  setTextById('hero-warranty', h.warranty?.value ?? '3 года');
  setTextById('hero-warranty-detail', h.warranty?.detail ?? 'на все работы');

  const geoEl = $('hero-geo');
  if (!geoEl) return;

  const regions = Array.isArray(h.geo) ? h.geo : [h.geo].filter(Boolean);
  geoEl.innerHTML = regions
    .filter(Boolean)
    .map((r) => `<span class="meta-card__tag">${escapeHtml(r)}</span>`)
    .join('');
}

// Fill text content into elements with ids and data-attributes.
// DOM: #page-title, #company-name, #hero-*, #contact-*, #footer-*, [data-phone]
function renderText() {
  const seoTitle =
    company.seo?.title || `${company.name} — гаражи и навесы под ключ`;
  setTextById('page-title', seoTitle);
  document.title = seoTitle;
  setTextById('company-name', company.name);
  setTextById('footer-company-name', company.name);
  setTextById('footer-company-name2', company.name);
  const requisites = $('requisites');
  const footerLegal = $('footer-legal');
  const bankDetails = $('requisites-bank-details');
  setHidden(requisites, !company.legal);
  setHidden(footerLegal, !company.legal);
  if (company.legal) {
    const { form, fullName, inn, ogrnip, bank } = company.legal;
    setTextById(
      'footer-legal',
      `${form} ${fullName} · ИНН ${inn} · ОГРНИП ${ogrnip}`,
    );
    setTextById('requisites-name', `${form} ${fullName}`);
    setTextById('requisites-ogrnip', ogrnip);
    setTextById('requisites-inn', inn);
    setHidden(bankDetails, !bank);
    if (bank) {
      setTextById('requisites-bank', bank.name);
      setTextById('requisites-account', bank.account);
      setTextById('requisites-corr-account', bank.corrAccount);
      setTextById('requisites-bic', bank.bic);
    }
  }
  setTextById('hero-title', company.hero?.title || '');
  setTextById('hero-text', company.hero?.text || '');
  renderHeroMeta();

  const primaryPhone = asArray(company.phones)[0];
  const phoneBtn = document.querySelector(SELECTORS.phone);
  if (phoneBtn && primaryPhone) {
    phoneBtn.href = primaryPhone.href;
    phoneBtn.textContent = `Позвонить ${primaryPhone.value}`;
  }
  if (primaryPhone) {
    document.querySelectorAll(SELECTORS.primaryPhoneLinks).forEach((link) => {
      link.href = primaryPhone.href;
    });
    document.querySelectorAll(SELECTORS.primaryPhoneValues).forEach((value) => {
      value.textContent = primaryPhone.value;
    });
  }

  setTextById('contact-email', company.email);
  const emailTile = $('contact-email-tile');
  if (emailTile) emailTile.href = `mailto:${company.email}`;
  const footerEmail = $('footer-email');
  if (footerEmail) {
    footerEmail.href = `mailto:${company.email}`;
    footerEmail.textContent = company.email;
  }

  setTextById('contact-hours', company.hours);
  setTextById('footer-hours', company.hours);
  setTextById('year', new Date().getFullYear());
  renderAddress();
  renderServiceArea();
}

// Fill address into contacts and footer.
function renderAddress() {
  const line = formatAddressLine();
  const mapUrl = getMapUrl();
  if (!line) return;

  setTextById('contact-address', line);
  setTextById('footer-address', line);

  const contactLink = $('contact-address-tile');
  if (contactLink && mapUrl) {
    contactLink.href = mapUrl;
    contactLink.target = '_blank';
    contactLink.rel = 'noopener noreferrer';
  }

  const footerLink = $('footer-address-link');
  if (footerLink && mapUrl) {
    footerLink.href = mapUrl;
    footerLink.target = '_blank';
    footerLink.rel = 'noopener noreferrer';
  }

  const section = company.serviceAreaSection;
  if (section) {
    setTextById('service-area-eyebrow', section.eyebrow);
    setTextById('service-area-title', section.title);
    setTextById('service-area-text', section.text);
    setTextById('service-area-more', section.moreLabel);
  }
}

// DOM: [data-featured-cities] — featured cities in the service area.
function renderServiceArea() {
  const cities = asArray(company.seo?.serviceArea?.featuredCities);
  if (!cities.length) return;

  fillContainer(
    SELECTORS.featuredCities,
    cities
      .map((city) => `<li class="service-area__city">${escapeHtml(city)}</li>`)
      .join(''),
  );
}

// Phone tile HTML for the contacts block.
function phoneTileHtml(p) {
  return `
    <a class="contact-tile contact-tile--accent" href="${escapeHtml(p.href)}">
      <span class="contact-tile__label">Телефон</span>
      <span class="contact-tile__value">${escapeHtml(p.value)}</span>
    </a>
  `;
}

// Phone item HTML for the footer.
function phoneFooterHtml(p) {
  return `
    <li>
      <a href="${escapeHtml(p.href)}">${escapeHtml(p.value)}</a>
    </li>
  `;
}

// DOM: [data-phones], [data-footer-phones]
function renderPhones() {
  fillDualContainers(
    SELECTORS.phones,
    SELECTORS.footerPhones,
    company.phones,
    phoneTileHtml,
    phoneFooterHtml,
  );
}

// DOM: [data-services]
function renderServices() {
  const services = asArray(company.services).filter(Boolean);
  fillContainer(
    SELECTORS.services,
    services
      .map(
        (s) => `
      <li class="service-item">
        <span class="service-item__bullet" aria-hidden="true"></span>
        <span>${escapeHtml(s)}</span>
      </li>
    `,
      )
      .join(''),
  );
}

// DOM: [data-extras] — extra-service cards.
function renderExtras() {
  const extras = asArray(company.extras).filter(Boolean);
  fillContainer(
    SELECTORS.extras,
    extras
      .map(
        (e, i) => `
      <article class="card">
        <div class="card__num">${String(i + 1).padStart(2, '0')}</div>
        <h3 class="card__title">${escapeHtml(e.title)}</h3>
        <p class="card__text">${escapeHtml(e.text)}</p>
      </article>
    `,
      )
      .join(''),
  );
}

// DOM: [data-advantages] — metric cards with numbered badges.
function renderAdvantages() {
  const advantages = asArray(company.advantages).filter(Boolean);
  fillContainer(
    SELECTORS.advantages,
    advantages
      .map((item, i) => {
        const accent = i % 2 === 0 ? 'primary' : 'steel';
        const lines = asArray(item.lines)
          .map((line) => `<span>${escapeHtml(line)}</span>`)
          .join('');
        return `
      <article class="stat-card stat-card--${accent}">
        <div class="stat-card__num" aria-hidden="true">${String(i + 1).padStart(2, '0')}</div>
        <h3 class="stat-card__title">${escapeHtml(item.title)}</h3>
        <p class="stat-card__value">${escapeHtml(item.value)}</p>
        <p class="stat-card__text">${lines}</p>
      </article>
    `;
      })
      .join(''),
  );
}

// DOM: [data-price-factors] — two-column cost-factor cells.
function renderPriceFactors() {
  const priceFactors = asArray(company.priceFactors).filter(Boolean);
  fillContainer(
    SELECTORS.priceFactors,
    priceFactors
      .map((item, i) => {
        const alt = i === priceFactors.length - 1 ? ' factor-cell--alt' : '';
        return `
      <article class="factor-cell${alt}">
        <h3 class="factor-cell__title">${escapeHtml(item.title)}</h3>
        <p class="factor-cell__text">${escapeHtml(item.text)}</p>
      </article>
    `;
      })
      .join(''),
  );
}

// DOM: [data-roofs] — roof-type cards with SVG icons.
function renderRoofs() {
  const roofs = asArray(company.roofs).filter(Boolean);
  fillContainer(
    SELECTORS.roofs,
    roofs
      .map(
        (r, i) => `
      <article class="roof-card">
        <div class="roof-card__meta">кровля ${String(i + 1).padStart(2, '0')}</div>
        <div class="roof-card__icon" aria-hidden="true">${
          ROOF_ICONS[r.icon] || ''
        }</div>
        <h3 class="roof-card__title">${escapeHtml(r.title)}</h3>
        <p class="roof-card__text">${escapeHtml(r.text)}</p>
      </article>
    `,
      )
      .join(''),
  );
}

// Shared carousel-track render.
// DOM: [data-carousel="{name}"] [data-carousel-track]
function renderCarouselTrack(name, items, buildSlide) {
  const track = document.querySelector(
    `${SELECTORS.carousel(name)} ${SELECTORS.carouselTrack}`,
  );
  if (!track) return;
  track.innerHTML = asArray(items).map(buildSlide).join('');
}

// Garage slide HTML with size and meta.
function garageSlideHtml(p) {
  const alt = seoImageAlt(p.title, 'garage');
  return `
    <article class="slide">
      <button class="slide__img" type="button" aria-label="Открыть фото: ${escapeHtml(alt)}">
        <img ${carouselImgAttrs(p.img)} alt="${escapeHtml(alt)}" />
        <span class="slide__badge">сварной каркас</span>
      </button>
      <div class="slide__body">
        <div class="slide__kicker">типовой размер</div>
        <h3 class="slide__title">${escapeHtml(p.title)}</h3>
        <p class="slide__size">${escapeHtml(p.size)}</p>
        <p class="slide__meta">${escapeHtml(p.meta)}</p>
      </div>
    </article>
  `;
}

// Canopy slide HTML (photo + title).
function canopySlideHtml(p) {
  const alt = seoImageAlt(p.title, 'canopy');
  return `
    <article class="slide slide--photo">
      <button class="slide__img slide__img--tall" type="button" aria-label="Открыть фото: ${escapeHtml(alt)}">
        <img ${carouselImgAttrs(p.img)} alt="${escapeHtml(alt)}" />
        <span class="slide__badge">навес под ключ</span>
      </button>
      <div class="slide__body">
        <div class="slide__kicker">металлоконструкция</div>
        <h3 class="slide__title">${escapeHtml(p.title)}</h3>
      </div>
    </article>
  `;
}

// Carousel config: name → data and slide render fn.
const CAROUSEL_CONFIG = {
  garages: {
    items: () => asArray(company.garages).filter(Boolean),
    buildSlide: garageSlideHtml,
  },
  canopies: {
    items: () => asArray(company.canopies).filter(Boolean),
    buildSlide: canopySlideHtml,
  },
};

// Render all carousels from CAROUSEL_CONFIG.
// DOM: [data-carousel="garages"], [data-carousel="canopies"]
function renderCarousels() {
  CAROUSEL_NAMES.forEach((name) => {
    const config = CAROUSEL_CONFIG[name];
    if (config) {
      renderCarouselTrack(name, config.items(), config.buildSlide);
    }
  });
}

// DOM: [data-workflow] — numbered steps.
function renderWorkflow() {
  if (!company.workflow) return;
  setTextById('workflow-title', company.workflow.title);
  setTextById('workflow-text', company.workflow.text);
  fillContainer(
    SELECTORS.workflow,
    asArray(company.workflow.steps)
      .filter(Boolean)
      .map(
        (step, i) => `
      <li class="workflow-step">
        <div class="workflow-step__num" aria-hidden="true">${i + 1}</div>
        <div class="workflow-step__line" aria-hidden="true"></div>
        <div class="workflow-step__body">
          <h3 class="workflow-step__title">${escapeHtml(step.title)}</h3>
          <p class="workflow-step__text">${escapeHtml(step.text)}</p>
        </div>
      </li>
    `,
      )
      .join(''),
  );
}

// Messenger tile HTML for the contacts block.
function messengerTileHtml(m) {
  return `
    <a
      class="messenger-link messenger-link--${escapeHtml(m.id)}"
      href="${escapeHtml(m.href)}"
      target="_blank"
      rel="noopener noreferrer"
    >
      <span class="messenger-link__label">${escapeHtml(m.label)}</span>
      <span class="messenger-link__hint">${escapeHtml(m.hint)}</span>
    </a>
  `;
}

// Messenger item HTML for the footer.
function messengerFooterHtml(m) {
  return `
    <li>
      <a href="${escapeHtml(m.href)}" target="_blank" rel="noopener noreferrer">${escapeHtml(m.label)}</a>
    </li>
  `;
}

// DOM: [data-messengers], [data-footer-messengers]
function renderMessengers() {
  fillDualContainers(
    SELECTORS.messengers,
    SELECTORS.footerMessengers,
    company.messengers,
    messengerTileHtml,
    messengerFooterHtml,
  );
}

// DOM: [data-faq] — <details> accordion.
// Accordion behaviour is bound later by initFaqAccordion() in main.js.
function renderFaq() {
  const faq = asArray(company.faq).filter(Boolean);
  fillContainer(
    SELECTORS.faq,
    faq
      .map(
        (item) => `
      <details class="faq-item">
        <summary class="faq-item__question">
          <span class="faq-item__label">${escapeHtml(item.q)}</span>
          <span class="faq-item__icon" aria-hidden="true"></span>
        </summary>
        <div class="faq-item__panel">
          <div class="faq-item__answer">
            <p>${escapeHtml(item.a)}</p>
          </div>
        </div>
      </details>
    `,
      )
      .join(''),
  );
}

export {
  renderAdvantages,
  renderCarousels,
  renderExtras,
  renderFaq,
  renderMessengers,
  renderPhones,
  renderPriceFactors,
  renderRoofs,
  renderServices,
  renderText,
  renderWorkflow,
};
