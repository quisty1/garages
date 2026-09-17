// Canopy catalog category: ItemList of offers rendered via CatalogCategoryPage.
import type { Metadata } from 'next';
import { company } from '@/lib/site-data';
import type { CatalogSlide } from '@/lib/types';
import { catalogCanopiesHref, catalogHref } from '@/lib/catalog';
import { absUrl, buildJsonLd, formatPrice } from '@/lib/seo';
import { CatalogCategoryPage } from '@/components/layout/CatalogCategoryPage';

const pagePath = catalogCanopiesHref();
const pageTitle = `Каталог навесов | ${company.name}`;
const pageDescription =
  'Типовые металлические навесы для автомобилей с ориентировочными ценами «от». Расчёт и монтаж под ключ во Владимирской области.';

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
        url: absUrl(company, company.canopies[0].img),
        alt: company.canopies[0].title,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: pageTitle,
    description: pageDescription,
    images: [absUrl(company, company.canopies[0].img)],
  },
};

export default function CatalogCanopiesPage() {
  const url = absUrl(company, pagePath);
  const home = absUrl(company, '/');
  const catalogUrl = absUrl(company, catalogHref());
  const items = company.canopies as CatalogSlide[];
  const graph = buildJsonLd(company)['@graph'].filter((node) =>
    ['HomeAndConstructionBusiness', 'WebSite'].includes(String(node['@type'])),
  );

  // CollectionPage + breadcrumbs + ItemList of canopy Offers.
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      ...graph,
      {
        '@type': 'CollectionPage',
        '@id': `${url}#webpage`,
        url,
        name: 'Каталог навесов',
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
          { '@type': 'ListItem', position: 3, name: 'Навесы', item: url },
        ],
      },
      {
        '@type': 'ItemList',
        '@id': `${url}#itemlist`,
        name: 'Каталог навесов',
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
      kind="canopy"
      label="Навесы"
      h1="Навесы"
      eyebrow="Каталог / навесы"
      gridTitle="Типовые решения"
      items={items}
      jsonLd={jsonLd}
    />
  );
}
