// Custom 404: noindex, home/phone CTAs, and landing cross-links.
import type { Metadata } from 'next';
import Link from 'next/link';
import { company } from '@/lib/site-data';
import { PageShell } from '@/components/layout/PageShell';
import { LandingLinks } from '@/components/sections/LandingLinks';

export const metadata: Metadata = {
  title: `Страница не найдена | ${company.name}`,
  description:
    'Такой страницы нет или она была перенесена. Вернитесь на главную Металл Монтаж 33.',
  robots: { index: false, follow: true },
};

export default function NotFound() {
  const phone = company.phones[0];

  return (
    <PageShell>
      <section className="section not-found" id="main-content">
        <div className="container not-found__inner">
          <div className="section__eyebrow">{company.name}</div>
          <p className="not-found__code" aria-hidden="true">
            404
          </p>
          <h1 className="not-found__title">Страница не найдена</h1>
          <p className="not-found__lead">
            Такой страницы нет или она была перенесена.
          </p>
          <div className="not-found__actions">
            <Link className="btn btn--primary" href="/">
              На главную
            </Link>
            <a className="btn btn--ghost" href={phone.href}>
              {phone.value}
            </a>
          </div>
        </div>
      </section>
      <LandingLinks />
    </PageShell>
  );
}
