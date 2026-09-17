// Garage catalog category: ItemList of offers rendered via CatalogCategoryPage.
import type { Metadata } from 'next';
import { company } from '@/lib/site-data';
import type { CatalogSlide } from '@/lib/types';
import { catalogGaragesHref, catalogHref } from '@/lib/catalog';
import { absUrl, buildJsonLd, formatPrice } from '@/lib/seo';
import { CatalogCategoryPage } from '@/components/layout/CatalogCategoryPage';

const pagePath = catalogGaragesHref();
const pageTitle = `Каталог гаражей | ${company.name}`;
const pageDescription =
  'Типовые размеры металлических гаражей из сэндвич-панелей с ориентировочными ценами «от». Расчёт и монтаж под ключ во Владимирской области.';

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

export default function CatalogGaragesPage() {
  const url = absUrl(company, pagePath);
  const home = absUrl(company, '/');
  const catalogUrl = absUrl(company, catalogHref());
  const items = company.garages as CatalogSlide[];
  const graph = buildJsonLd(company)['@graph'].filter((node) =>
    ['HomeAndConstructionBusiness', 'WebSite'].includes(String(node['@type'])),
  );

  // CollectionPage + breadcrumbs + ItemList of garage Offers.
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      ...graph,
      {
        '@type': 'CollectionPage',
        '@id': `${url}#webpage`,
        url,
        name: 'Каталог гаражей',
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
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Каталог',
            item: catalogUrl,
          },
          { '@type': 'ListItem', position: 3, name: 'Гаражи', item: url },
        ],
      },
      {
        '@type': 'ItemList',
        '@id': `${url}#itemlist`,
        name: 'Каталог гаражей',
        numberOfItems: items.length,
        itemListElement: items.map((item, index) => {
          const baseDescription = item.meta || item.size || item.title;
          const description =
            item.priceFrom != null
              ? `${baseDescription}. От ${formatPrice(item.priceFrom)} ₽`
              : baseDescription;
          return {
            '@type': 'ListItem',
            position: index + 1,
            name: item.title,
            url,
            item: {
              '@type': 'Offer',
              name: item.title,
              image: absUrl(company, item.img),
              description,
              priceCurrency: 'RUB',
              ...(item.priceFrom != null
                ? { price: String(item.priceFrom) }
                : {}),
              availability: 'https://schema.org/InStock',
              url,
            },
          };
        }),
      },
    ],
  };

  return (
    <CatalogCategoryPage
      kind="garage"
      label="Гаражи"
      h1="Гаражи"
      eyebrow="Каталог / сварные гаражи"
      gridTitle="Типовые размеры"
      items={items}
      jsonLd={jsonLd}
    />
  );
}
