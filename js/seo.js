// Meta tags, Open Graph, Twitter Card, and JSON-LD from company.seo.
import { $, asArray, company, getMapUrl, setTextById } from './shared.js';

// PostalAddress, geo, and hasMap for organization JSON-LD.
function buildAddressJsonLd(address = company?.address) {
  if (!address) return null;

  const result = {
    address: {
      '@type': 'PostalAddress',
      streetAddress: address.addressNote
        ? `${address.streetAddress}, ${address.addressNote}`
        : address.streetAddress,
      addressLocality: address.addressLocality,
      addressRegion: address.addressRegion,
      postalCode: address.postalCode,
      addressCountry: address.addressCountry || 'RU',
    },
  };

  if (
    typeof address.latitude === 'number' &&
    typeof address.longitude === 'number'
  ) {
    result.geo = {
      '@type': 'GeoCoordinates',
      latitude: address.latitude,
      longitude: address.longitude,
    };
  }

  const mapUrl = getMapUrl(address);
  if (mapUrl) result.hasMap = mapUrl;

  return result;
}

// Canonical site URL from company.seo.siteUrl
// or derived from window.location (local development).
function getSiteUrl() {
  const configured = company?.seo?.siteUrl?.replace(/\/$/, '');
  if (configured) return configured;
  if (window.location.protocol.startsWith('http')) {
    const path = window.location.pathname
      .replace(/\/index\.html?$/i, '')
      .replace(/\/$/, '');
    return window.location.origin + path;
  }
  return '';
}

// Absolute URL for a relative path (OG, JSON-LD).
function absUrl(path) {
  const base = getSiteUrl();
  if (!base) return path;
  const clean = path.replace(/^\.\//, '');
  return `${base}/${clean}`;
}

// Create or update a meta tag in <head>.
// name — name or property value; attr is 'name' or 'property'.
function setMeta(name, content, attr = 'name') {
  if (!content) return;
  let el = document.querySelector(`meta[${attr}="${name}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

// areaServed array for JSON-LD: region + cities.
function buildAreaServedJsonLd() {
  const regions = asArray(company.seo?.serviceArea?.regions).filter(Boolean);
  if (!regions.length) return [];

  const result = [];
  for (const region of regions) {
    const regionName = String(region.name || '');
    const cities = asArray(region.cities).filter(Boolean);
    if (!regionName) continue;
    if (!regionName.includes('область') && !cities.length) {
      result.push({ '@type': 'City', name: regionName });
      continue;
    }
    const regionPlace = {
      '@type': 'AdministrativeArea',
      name: regionName,
    };
    result.push(regionPlace);
    if (cities.length) {
      for (const city of cities) {
        result.push({
          '@type': 'City',
          name: city,
          containedInPlace: regionPlace,
        });
      }
    }
  }
  return result;
}

// Format a configured minimum price for human-readable schema labels.
function formatPrice(value) {
  const number = Number(value);
  return Number.isFinite(number)
    ? new Intl.NumberFormat('ru-RU').format(number)
    : '';
}

// A made-to-measure construction is a Service, not a fixed-price Product.
// minPrice explicitly represents “от”; no exact Offer.price or stock state is set.
function buildServiceOffer(service, pageUrl) {
  const fromPrice = Number(service?.from);
  const currency = service?.currency || 'RUB';
  const offer = {
    '@type': 'Offer',
    name: `${service?.label || 'Изготовление металлоконструкции'} — от ${formatPrice(fromPrice)} ₽`,
    itemOffered: {
      '@type': 'Service',
      name: service?.label || 'Изготовление металлоконструкции',
      serviceType: service?.label || 'Изготовление металлоконструкции',
      provider: {
        '@id': pageUrl ? `${pageUrl}#organization` : '#organization',
      },
    },
    priceSpecification: {
      '@type': 'PriceSpecification',
      priceCurrency: currency,
      minPrice: Number.isFinite(fromPrice) ? fromPrice : undefined,
    },
  };
  if (pageUrl) offer.url = `${pageUrl}#contact`;
  return offer;
}

// FAQPage for rich search snippets.
function buildFaqJsonLd(pageUrl) {
  const faqItems = asArray(company.faq).filter(Boolean);
  if (!faqItems.length) return null;

  const faq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a,
      },
    })),
  };

  if (pageUrl) faq.url = `${pageUrl}#faq`;
  return faq;
}

// Update meta tags, canonical, OG, Twitter, and JSON-LD from company.seo.
// DOM: meta in <head>, #canonical-link, #json-ld
function renderSEO() {
  const seo = company.seo;
  if (!seo) return;

  const siteUrl = getSiteUrl();
  const pageUrl = siteUrl ? `${siteUrl}/` : '';
  const description = seo.description;
  const ogImage = absUrl(seo.ogImage || './assets/logo-og.webp');
  const regions = asArray(seo.serviceArea?.regions).filter(Boolean);
  const placename = regions.length
    ? `${regions
        .map((region) => {
          const cities = asArray(region.cities);
          if (!cities.length) return region.name;
          return `${region.name} (${cities.slice(0, 5).join(', ')} и др.)`;
        })
        .join('; ')}; по всем городам в этих регионах`
    : 'Владимирская, Московская, Нижегородская и Ивановская области';

  setMeta('description', description);
  setMeta('keywords', seo.keywords);
  setMeta('robots', 'index, follow, max-image-preview:large');
  setMeta('author', company.name);
  setMeta('geo.region', seo.region);
  setMeta('geo.placename', placename);
  if (company.address?.latitude != null && company.address?.longitude != null) {
    setMeta(
      'geo.position',
      `${company.address.latitude};${company.address.longitude}`,
    );
    setMeta(
      'ICBM',
      `${company.address.latitude}, ${company.address.longitude}`,
    );
  }

  setMeta('og:type', 'website', 'property');
  setMeta('og:site_name', company.name, 'property');
  setMeta('og:title', seo.title, 'property');
  setMeta('og:description', description, 'property');
  setMeta('og:locale', 'ru_RU', 'property');
  setMeta('og:image', ogImage, 'property');
  setMeta('og:image:secure_url', ogImage, 'property');
  setMeta('og:image:width', String(seo.ogImageWidth || 1200), 'property');
  setMeta('og:image:height', String(seo.ogImageHeight || 800), 'property');
  setMeta('og:image:type', 'image/webp', 'property');
  setMeta(
    'og:image:alt',
    `${company.name} — гаражи и навесы под ключ`,
    'property',
  );
  if (pageUrl) {
    setMeta('og:url', pageUrl, 'property');
    const canonical = $('canonical-link');
    if (canonical) canonical.href = pageUrl;
  }

  setMeta('twitter:card', 'summary_large_image');
  setMeta('twitter:title', seo.title);
  setMeta('twitter:description', description);
  setMeta('twitter:image', ogImage);
  setMeta('twitter:image:alt', `${company.name} — гаражи и навесы под ключ`);

  renderJsonLd(siteUrl, pageUrl, ogImage);
}

// Write truthful business/service JSON-LD into #json-ld.
// Projects are priced from a minimum after measurement, so Product entities are omitted.
function renderJsonLd(siteUrl, pageUrl, ogImage) {
  const host = $('json-ld');
  if (!host) return;

  const phones = asArray(company.phones)
    .filter(Boolean)
    .map((p) => String(p.href || '').replace('tel:', ''));
  const pricing = company.pricing || {};
  const configuredPrices = Object.values(pricing)
    .map((item) => Number(item?.from))
    .filter(Number.isFinite);
  const minimumPrice = configuredPrices.length
    ? Math.min(...configuredPrices)
    : null;

  const localBusiness = {
    '@context': 'https://schema.org',
    '@type': 'HomeAndConstructionBusiness',
    name: company.name,
    description: company.seo.description,
    slogan: company.tagline,
    image: ogImage,
    email: company.email,
    telephone: phones,
    priceRange:
      minimumPrice == null ? 'по расчёту' : `от ${formatPrice(minimumPrice)} ₽`,
    areaServed: buildAreaServedJsonLd(),
    contactPoint: asArray(company.phones)
      .filter(Boolean)
      .map((phone) => ({
        '@type': 'ContactPoint',
        telephone: String(phone.href || '').replace('tel:', ''),
        contactType: 'sales',
        areaServed: 'RU',
        availableLanguage: ['ru'],
      })),
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: [
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
          'Sunday',
        ],
        opens: '08:00',
        closes: '18:00',
      },
    ],
    knowsAbout: [
      'Металлические гаражи',
      'Навесы для автомобилей',
      'Сэндвич-панели',
      'Монтаж металлоконструкций',
    ],
    hasOfferCatalog: [
      {
        '@type': 'OfferCatalog',
        name: pricing.garages?.label || 'Металлические гаражи',
        itemListElement: [buildServiceOffer(pricing.garages, pageUrl)],
      },
      {
        '@type': 'OfferCatalog',
        name: pricing.canopies?.label || 'Металлические навесы',
        itemListElement: [buildServiceOffer(pricing.canopies, pageUrl)],
      },
    ],
    sameAs: asArray(company.messengers)
      .filter(Boolean)
      .map((messenger) => messenger.href)
      .filter(Boolean),
  };

  const addressFields = buildAddressJsonLd();
  if (addressFields) Object.assign(localBusiness, addressFields);

  if (pageUrl) {
    localBusiness.url = pageUrl;
    localBusiness['@id'] = `${pageUrl}#organization`;
  }

  const webSite = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: company.name,
    description: company.seo.description,
    inLanguage: 'ru-RU',
  };

  if (pageUrl) {
    webSite.url = pageUrl;
    webSite['@id'] = `${pageUrl}#website`;
    webSite.publisher = { '@id': `${pageUrl}#organization` };
  }

  const webPage = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: company.seo.title,
    description: company.seo.description,
    inLanguage: 'ru-RU',
    primaryImageOfPage: {
      '@type': 'ImageObject',
      url: ogImage,
      width: company.seo.ogImageWidth || 1200,
      height: company.seo.ogImageHeight || 800,
    },
  };

  if (pageUrl) {
    webPage.url = pageUrl;
    webPage['@id'] = `${pageUrl}#webpage`;
    webPage.isPartOf = { '@id': `${pageUrl}#website` };
    webPage.about = { '@id': `${pageUrl}#organization` };
  }

  const schemas = [localBusiness, webSite, webPage];
  const faqPage = buildFaqJsonLd(pageUrl);
  if (faqPage) schemas.push(faqPage);

  host.textContent = JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': schemas,
  });
}

export { renderJsonLd, renderSEO };
