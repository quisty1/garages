// Schema.org JSON-LD builders and absolute URL helpers for SEO metadata.

import type { Metadata } from 'next';
import type { Company } from './types';
import { formatPrice, getMapUrl } from './format';

export { formatPrice };

function asArray<T>(value: readonly T[] | T[] | undefined | null): T[] {
  return Array.isArray(value) ? [...value] : [];
}

export function getSiteUrl(company: Company): string {
  return company.seo.siteUrl.replace(/\/$/, '');
}

export function absUrl(company: Company, path: string): string {
  const base = getSiteUrl(company);
  const clean = path.replace(/^\.\//, '').replace(/^\//, '');
  return `${base}/${clean}`;
}

// Flatten regions + cities into schema.org Place nodes for areaServed.
export function buildAreaServedJsonLd(company: Company) {
  const regions = asArray(company.seo.serviceArea?.regions).filter(Boolean);
  const result: Array<Record<string, unknown>> = [];

  for (const region of regions) {
    const regionName = String(region.name || '');
    const cities = asArray(region.cities).filter(Boolean);
    if (!regionName) continue;
    // Plain city names (no "область") without nested cities become City nodes.
    if (!regionName.includes('область') && !cities.length) {
      result.push({ '@type': 'City', name: regionName });
      continue;
    }
    const regionPlace = {
      '@type': 'AdministrativeArea',
      name: regionName,
    };
    result.push(regionPlace);
    for (const city of cities) {
      result.push({
        '@type': 'City',
        name: city,
        containedInPlace: regionPlace,
      });
    }
  }
  return result;
}

function buildAddressJsonLd(company: Company) {
  const address = company.address;
  const result: Record<string, unknown> = {
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

  result.geo = {
    '@type': 'GeoCoordinates',
    latitude: address.latitude,
    longitude: address.longitude,
  };

  const mapUrl = getMapUrl(address);
  if (mapUrl) result.hasMap = mapUrl;

  return result;
}

function buildServiceOffer(
  service: Company['pricing'][keyof Company['pricing']],
  pageUrl: string,
) {
  const fromPrice = Number(service?.from);
  const currency = service?.currency || 'RUB';
  const offer: Record<string, unknown> = {
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

function buildFaqJsonLd(company: Company, pageUrl: string) {
  const faqItems = asArray(company.faq).filter(Boolean);
  if (!faqItems.length) return null;

  const faq: Record<string, unknown> = {
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

// Build the @graph of LocalBusiness, WebSite, WebPage, and optional FAQPage.
export function buildJsonLd(company: Company) {
  const siteUrl = getSiteUrl(company);
  const pageUrl = siteUrl ? `${siteUrl}/` : '';
  const ogImage = absUrl(
    company,
    company.seo.ogImage || '/assets/logo-og.webp',
  );

  const phones = asArray(company.phones)
    .filter(Boolean)
    .map((p) => String(p.href || '').replace('tel:', ''));
  const pricing = company.pricing;
  const configuredPrices = Object.values(pricing)
    .map((item) => Number(item?.from))
    .filter(Number.isFinite);
  const minimumPrice = configuredPrices.length
    ? Math.min(...configuredPrices)
    : null;

  const localBusiness: Record<string, unknown> = {
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
    areaServed: buildAreaServedJsonLd(company),
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

  Object.assign(localBusiness, buildAddressJsonLd(company));

  if (pageUrl) {
    localBusiness.url = pageUrl;
    localBusiness['@id'] = `${pageUrl}#organization`;
  }

  const webSite: Record<string, unknown> = {
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

  const webPage: Record<string, unknown> = {
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
  const faqPage = buildFaqJsonLd(company, pageUrl);
  if (faqPage) schemas.push(faqPage);

  return {
    '@context': 'https://schema.org',
    '@graph': schemas,
  };
}

// Human-readable geo.placename meta from service-area regions (fallback if empty).
export function buildGeoPlacename(company: Company): string {
  const regions = asArray(company.seo.serviceArea?.regions).filter(Boolean);
  if (!regions.length) {
    return 'Владимирская, Московская, Нижегородская и Ивановская области';
  }
  return `${regions
    .map((region) => {
      const cities = asArray(region.cities);
      if (!cities.length) return region.name;
      return `${region.name} (${cities.slice(0, 5).join(', ')} и др.)`;
    })
    .join('; ')}; по всем городам в этих регионах`;
}

// Next.js Metadata API helper from company.seo (title, OG, icons, geo).
export function buildMetadata(company: Company): Metadata {
  const siteUrl = getSiteUrl(company);
  const pageUrl = `${siteUrl}/`;
  const ogImage = absUrl(company, company.seo.ogImage);
  const placename = buildGeoPlacename(company);
  const ogAlt = `${company.name} — гаражи и навесы под ключ`;

  return {
    metadataBase: new URL(pageUrl),
    title: company.seo.title,
    description: company.seo.description,
    keywords: company.seo.keywords,
    authors: [{ name: company.name }],
    robots: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
    },
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      type: 'website',
      siteName: company.name,
      title: company.seo.title,
      description: company.seo.description,
      locale: 'ru_RU',
      url: pageUrl,
      images: [
        {
          url: ogImage,
          width: company.seo.ogImageWidth,
          height: company.seo.ogImageHeight,
          type: 'image/webp',
          alt: ogAlt,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: company.seo.title,
      description: company.seo.description,
      images: [ogImage],
    },
    icons: {
      icon: [
        { url: '/favicon.ico', sizes: '48x48' },
        { url: '/assets/favicon-48.png', type: 'image/png', sizes: '48x48' },
        { url: '/assets/favicon-96.png', type: 'image/png', sizes: '96x96' },
        { url: '/assets/icon-512.png', type: 'image/png', sizes: '512x512' },
        { url: '/assets/favicon.svg', type: 'image/svg+xml' },
      ],
      apple: [{ url: '/assets/apple-touch-icon.png', sizes: '180x180' }],
      shortcut: '/favicon.ico',
    },
    manifest: '/manifest.json',
    other: {
      'geo.region': company.seo.region,
      'geo.placename': placename,
      'geo.position': `${company.address.latitude};${company.address.longitude}`,
      ICBM: `${company.address.latitude}, ${company.address.longitude}`,
      'format-detection': 'telephone=yes',
    },
  };
}

// Featured images listed in sitemap.xml for richer search results.
export const SITEMAP_IMAGES = [
  '/assets/logo-og.webp',
  '/assets/garage-6x4.webp',
  '/assets/garage-6x6.webp',
  '/assets/garage-8x6.webp',
  '/assets/garage-6x8.webp',
  '/assets/canopy-car.webp',
  '/assets/canopy-gable.webp',
  '/assets/canopy-single-slope.webp',
  '/assets/canopy-two-cars.webp',
  '/assets/canopy-house.webp',
] as const;

export const SITEMAP_LASTMOD = '2026-09-15';
