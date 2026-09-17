import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { landingPages, landingHref } from '@/lib/landing-pages';
import { company } from '@/lib/site-data';
import { absUrl, buildJsonLd } from '@/lib/seo';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Calculator } from '@/components/sections/Calculator';
import { Workflow } from '@/components/sections/Workflow';
import { ServiceArea } from '@/components/sections/ServiceArea';
import { Contact } from '@/components/sections/Contact';
import { Faq } from '@/components/sections/Faq';
import { LandingLinks } from '@/components/sections/LandingLinks';
import { LandingImage } from '@/components/sections/LandingImage';
import {
  ClientEffects,
  ScrollTopButton,
} from '@/components/effects/ClientEffects';

export const dynamicParams = false;
export function generateStaticParams() {
  return landingPages.map(({ slug }) => ({ slug }));
}
type Props = { params: Promise<{ slug: string }> };
async function getPage(params: Props['params']) {
  const { slug } = await params;
  const page = landingPages.find((item) => item.slug === slug);
  if (!page) notFound();
  return page;
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const page = await getPage(params);
  const url = absUrl(company, landingHref(page));
  return {
    title: page.title,
    description: page.description,
    keywords: null,
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      locale: 'ru_RU',
      siteName: company.name,
      title: page.title,
      description: page.description,
      url,
      images: [{ url: absUrl(company, page.image), alt: page.imageAlt }],
    },
    twitter: {
      card: 'summary_large_image',
      title: page.title,
      description: page.description,
      images: [absUrl(company, page.image)],
    },
  };
}
export default async function Landing({ params }: Props) {
  const page = await getPage(params);
  const url = absUrl(company, landingHref(page));
  const home = absUrl(company, '/');
  const graph = buildJsonLd(company)['@graph'].filter((node) =>
    ['HomeAndConstructionBusiness', 'WebSite'].includes(String(node['@type'])),
  );
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      ...graph,
      {
        '@type': 'WebPage',
        '@id': `${url}#webpage`,
        url,
        name: page.title,
        description: page.description,
        inLanguage: 'ru-RU',
        isPartOf: { '@id': `${home}#website` },
        breadcrumb: { '@id': `${url}#breadcrumbs` },
      },
      {
        '@type': 'Service',
        '@id': `${url}#service`,
        name: page.h1,
        description: page.description,
        url,
        provider: { '@id': `${home}#organization` },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${url}#breadcrumbs`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Главная', item: home },
          { '@type': 'ListItem', position: 2, name: page.label, item: url },
        ],
      },
      {
        '@type': 'FAQPage',
        '@id': `${url}#faq`,
        url: `${url}#faq`,
        mainEntity: page.faq.map((item) => ({
          '@type': 'Question',
          name: item.q,
          acceptedAnswer: { '@type': 'Answer', text: item.a },
        })),
      },
    ],
  };
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
        }}
      />
      <a className="skip-link" href="#main-content">
        Перейти к содержимому
      </a>
      <Header />
      <main id="top">
        <section className="section landing-hero" id="main-content">
          <div className="container">
            <nav className="landing-breadcrumbs" aria-label="Хлебные крошки">
              <Link href="/">Главная</Link>
              <span aria-hidden="true">/</span>
              <span aria-current="page">{page.label}</span>
            </nav>
            <div className="landing-hero__grid">
              <div>
                <div className="section__eyebrow">
                  Изготовление · доставка · монтаж
                </div>
                <h1>{page.h1}</h1>
                <p className="landing-intro">{page.intro}</p>
                <a className="btn btn--primary" href="#calculator" data-cta>
                  Рассчитать стоимость
                </a>
              </div>
              <LandingImage
                src={page.image}
                alt={page.imageAlt}
                priority
                blueprint={page.blueprint}
              />
            </div>
          </div>
        </section>
        <section className="section section--muted">
          <div className="container landing-guide">
            <div className="landing-copy">
              {page.sections.map((section) => (
                <article key={section.title}>
                  <h2>{section.title}</h2>
                  <p>{section.text}</p>
                </article>
              ))}
            </div>
            <aside className="side-card landing-checklist">
              <div className="side-card__body">
                <h2>Что подготовить к обсуждению проекта</h2>
                <ul className="side-list">
                  {page.checklist.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <a className="btn btn--primary" href="#contact">
                  Обсудить проект
                </a>
              </div>
            </aside>
          </div>
        </section>
        <section className="section" aria-labelledby="construction-title">
          <div className="container landing-detail">
            <LandingImage
              src={page.detail.image}
              alt={page.detail.alt}
              blueprint={page.detail.blueprint}
            />
            <div>
              <div className="section__eyebrow">Конструкция в деталях</div>
              <h2 className="section__title" id="construction-title">
                {page.detail.title}
              </h2>
              <p className="section__text">{page.detail.text}</p>
              <ul className="side-list">
                {page.detail.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
              <Link className="btn btn--primary" href="/#garage-projects">
                Посмотреть выполненные работы
              </Link>
            </div>
          </div>
        </section>
        <Calculator initialType={page.kind} />
        <Workflow />
        <Faq items={page.faq} title={`Вопросы: ${page.label.toLowerCase()}`} />
        <LandingLinks currentSlug={page.slug} />
        <ServiceArea />
        <Contact />
      </main>
      <Footer />
      <ScrollTopButton />
      <ClientEffects key={page.slug} />
    </>
  );
}
