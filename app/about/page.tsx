// About company page: copy from lib/about plus AboutPage JSON-LD.
import type { Metadata } from 'next';
import Link from 'next/link';
import { PageShell } from '@/components/layout/PageShell';
import { Advantages } from '@/components/sections/Advantages';
import { ServiceArea } from '@/components/sections/ServiceArea';
import { Contact } from '@/components/sections/Contact';
import { aboutHref, aboutPage } from '@/lib/about';
import { company } from '@/lib/site-data';
import { absUrl, buildJsonLd } from '@/lib/seo';

const { title, description, eyebrow, h1, intro, sections } = aboutPage;

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: absUrl(company, aboutHref()) },
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    siteName: company.name,
    title,
    description,
    url: absUrl(company, aboutHref()),
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
  },
};

export default function AboutPage() {
  const url = absUrl(company, aboutHref());
  const home = absUrl(company, '/');
  const graph = buildJsonLd(company)['@graph'].filter((node) =>
    ['HomeAndConstructionBusiness', 'WebSite'].includes(String(node['@type'])),
  );
  // AboutPage + BreadcrumbList; about points at the org node on home.
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      ...graph,
      {
        '@type': 'AboutPage',
        '@id': `${url}#webpage`,
        url,
        name: title,
        description,
        inLanguage: 'ru-RU',
        isPartOf: { '@id': `${home}#website` },
        about: { '@id': `${home}#organization` },
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
            name: 'О компании',
            item: url,
          },
        ],
      },
    ],
  };

  return (
    <PageShell jsonLd={jsonLd} effectsKey="about">
      <section className="section about-hero" id="main-content">
        <div className="container">
          <nav className="landing-breadcrumbs" aria-label="Хлебные крошки">
            <Link href="/">Главная</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">О компании</span>
          </nav>
          <div className="section__eyebrow">{eyebrow}</div>
          <h1>{h1}</h1>
          <p className="about-hero__intro">{intro}</p>
        </div>
      </section>

      <section className="section section--muted">
        <div className="container about-story">
          {sections.map((section) => (
            <div className="about-story__block" key={section.title}>
              <h2>{section.title}</h2>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          ))}
        </div>
      </section>

      <Advantages />
      <ServiceArea />
      <Contact />
    </PageShell>
  );
}
