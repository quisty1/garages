// Shared template for catalog category showcase pages (garages / canopies).

import Link from 'next/link';
import type { CatalogSlide } from '@/lib/types';
import { GOAL } from '@/lib/analytics';
import {
  catalogCanopiesHref,
  catalogGaragesHref,
  catalogHref,
} from '@/lib/catalog';
import { PageShell } from '@/components/layout/PageShell';
import { CatalogGrid } from '@/components/sections/CatalogGrid';
import { Lightbox } from '@/components/ui/Lightbox';

type CatalogKind = 'garage' | 'canopy';

interface CatalogCategoryPageProps {
  kind: CatalogKind;
  label: string;
  h1: string;
  lead?: string;
  eyebrow: string;
  gridTitle: string;
  gridText?: string;
  items: CatalogSlide[];
  jsonLd: Record<string, unknown>;
}

export function CatalogCategoryPage({
  kind,
  label,
  h1,
  lead,
  eyebrow,
  gridTitle,
  gridText,
  items,
  jsonLd,
}: CatalogCategoryPageProps) {
  const gridId = kind === 'garage' ? 'catalog-garages' : 'catalog-canopies';
  const siblingHref =
    kind === 'garage' ? catalogCanopiesHref() : catalogGaragesHref();
  const siblingLabel = kind === 'garage' ? 'Навесы' : 'Гаражи';

  return (
    <PageShell jsonLd={jsonLd} afterFooter={<Lightbox />}>
      <section className="section catalog-hero" id="main-content">
        <div className="container">
          <nav className="landing-breadcrumbs" aria-label="Хлебные крошки">
            <Link href="/">Главная</Link>
            <span aria-hidden="true">/</span>
            <Link href={catalogHref()}>Каталог</Link>
            <span aria-hidden="true">/</span>
            <span>{label}</span>
          </nav>
          <div className="section__eyebrow">Каталог</div>
          <h1>{h1}</h1>
          {lead ? <p className="catalog-hero__lead">{lead}</p> : null}
          <div className="catalog-hero__actions">
            <Link className="btn btn--ghost" href={catalogHref()}>
              Весь каталог
            </Link>
            <Link className="btn btn--ghost" href={siblingHref}>
              {siblingLabel}
            </Link>
          </div>
        </div>
      </section>

      <CatalogGrid
        id={gridId}
        eyebrow={eyebrow}
        title={gridTitle}
        text={gridText}
        items={items}
        kind={kind}
      />

      <section className="section catalog-cta">
        <div className="container">
          <div className="catalog-cta__inner">
            <div>
              <h2 className="catalog-cta__title">Нужен точный расчёт?</h2>
              <p className="catalog-cta__text">
                Укажите размеры в калькуляторе или оставьте заявку — бесплатно
                проконсультируем и подготовим смету.
              </p>
            </div>
            <div className="catalog-cta__actions">
              <Link
                className="btn btn--primary"
                href="/#calculator"
                data-analytics-goal={GOAL.cta_calculate}
              >
                Рассчитать стоимость
              </Link>
              <Link
                className="btn btn--ghost"
                href="/#contact"
                data-analytics-goal={GOAL.cta_contact}
              >
                Оставить заявку
              </Link>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
