// Catalog hub: garage/canopy category cards with CollectionPage + ItemList JSON-LD.
import Link from 'next/link';
import type { Metadata } from 'next';
import { company } from '@/lib/site-data';
import type { CatalogSlide } from '@/lib/types';
import {
  catalogCanopiesHref,
  catalogGaragesHref,
  catalogHref,
} from '@/lib/catalog';
import { absUrl, buildJsonLd, formatPrice } from '@/lib/seo';
import { formatMoneyDisplay } from '@/lib/format';
import { carouselSrcSet, seoImageAlt } from '@/lib/images';
import { PageShell } from '@/components/layout/PageShell';
import { LandingLinks } from '@/components/sections/LandingLinks';

const pagePath = catalogHref();
const pageTitle = `Каталог гаражей и навесов | ${company.name}`;
const pageDescription =
  'Выберите раздел каталога: металлические гаражи или навесы. Типовые размеры с ориентировочными ценами «от» и расчётом под ключ.';

// Lowest priceFrom across slides for the hub card "from" label / Offer price.
function minPriceFrom(items: CatalogSlide[]): number | undefined {
  const prices = items
    .map((item) => item.priceFrom)
    .filter(
      (value): value is number => value != null && Number.isFinite(value),
    );
  if (!prices.length) return undefined;
  return Math.min(...prices);
}

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  alternates: { canonical: absUrl(company, pagePath) },
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    siteName: company.name,
    title: pageTitle,
    description: pageDescription,
    url: absUrl(company, pagePath),
    images: [
      {
        url: absUrl(company, company.garages[0].img),
        alt: company.garages[0].title,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: pageTitle,
    description: pageDescription,
    images: [absUrl(company, company.garages[0].img)],
  },
};

export default function CatalogHubPage() {
  const url = absUrl(company, pagePath);
  const home = absUrl(company, '/');
  const garagesHref = absUrl(company, catalogGaragesHref());
  const canopiesHref = absUrl(company, catalogCanopiesHref());
  const graph = buildJsonLd(company)['@graph'].filter((node) =>
    ['HomeAndConstructionBusiness', 'WebSite'].includes(String(node['@type'])),
  );

  const garages = company.garages as CatalogSlide[];
  const canopies = company.canopies as CatalogSlide[];
  const garagesFrom = minPriceFrom(garages);
  const canopiesFrom = minPriceFrom(canopies);

  // Two hub cards → /catalog/garazhi/ and /catalog/navesy/.
  const categories = [
    {
      key: 'garages',
      href: catalogGaragesHref(),
      abs: garagesHref,
      title: 'Гаражи',
      img: garages[0].img,
      kind: 'garage' as const,
      count: garages.length,
      priceFrom: garagesFrom,
    },
    {
      key: 'canopies',
      href: catalogCanopiesHref(),
      abs: canopiesHref,
      title: 'Навесы',
      img: canopies[0].img,
      kind: 'canopy' as const,
      count: canopies.length,
      priceFrom: canopiesFrom,
    },
  ];

  // CollectionPage + breadcrumbs + ItemList of category Offers.
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      ...graph,
      {
        '@type': 'CollectionPage',
        '@id': `${url}#webpage`,
        url,
        name: 'Каталог гаражей и навесов',
        description: pageDescription,
        inLanguage: 'ru-RU',
        isPartOf: { '@id': `${home}#website` },
        breadcrumb: { '@id': `${url}#breadcrumbs` },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${url}#breadcrumbs`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Главная', item: home },
          { '@type': 'ListItem', position: 2, name: 'Каталог', item: url },
        ],
      },
      {
        '@type': 'ItemList',
        '@id': `${url}#itemlist`,
        name: 'Разделы каталога',
        numberOfItems: categories.length,
        itemListElement: categories.map((category, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: category.title,
          url: category.abs,
          item: {
            '@type': 'Offer',
            name: category.title,
            url: category.abs,
            image: absUrl(company, category.img),
            description:
              category.priceFrom != null
                ? `${category.title}: ${category.count} позиций. От ${formatPrice(category.priceFrom)} ₽`
                : `${category.title}: ${category.count} позиций`,
            priceCurrency: 'RUB',
            ...(category.priceFrom != null
              ? { price: String(category.priceFrom) }
              : {}),
            availability: 'https://schema.org/InStock',
          },
        })),
      },
    ],
  };

  return (
    <PageShell jsonLd={jsonLd}>
      <section className="section catalog-hero" id="main-content">
        <div className="container">
          <nav className="landing-breadcrumbs" aria-label="Хлебные крошки">
            <Link href="/">Главная</Link>
            <span aria-hidden="true">/</span>
            <span>Каталог</span>
          </nav>
          <div className="section__eyebrow">{company.name}</div>
          <h1>Каталог</h1>
        </div>
      </section>

      <section className="section catalog-hub" aria-label="Разделы каталога">
        <div className="container">
          <div className="catalog-hub__grid">
            {categories.map((category) => {
              const img = carouselSrcSet(
                category.img,
                '(max-width: 820px) 92vw, 560px',
              );
              const alt = seoImageAlt(category.title, category.kind);
              const priceLabel =
                category.priceFrom != null
                  ? `От ${formatMoneyDisplay(category.priceFrom)}`
                  : null;
              return (
                <Link
                  key={category.key}
                  className="catalog-hub__card"
                  href={category.href}
                >
                  <div className="catalog-hub__media">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img.src}
                      srcSet={img.srcSet}
                      sizes={img.sizes}
                      alt={alt}
                      width={img.width}
                      height={img.height}
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  <div className="catalog-hub__body">
                    <h2 className="catalog-hub__title">{category.title}</h2>
                    <p className="catalog-hub__meta">
                      {category.count}{' '}
                      {category.kind === 'garage' ? 'позиций' : 'позиций'}
                      {priceLabel ? ` · ${priceLabel}` : ''}
                    </p>
                    <span className="catalog-hub__cta">Смотреть →</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <LandingLinks />
    </PageShell>
  );
}
