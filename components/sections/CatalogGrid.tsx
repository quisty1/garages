// Catalog product grid for garages and canopies category pages.

import Link from 'next/link';
import type { CatalogSlide } from '@/lib/types';
import { GOAL } from '@/lib/analytics';
import { formatMoneyDisplay } from '@/lib/format';
import { carouselSrcSet, seoImageAlt } from '@/lib/images';
import { SectionHead } from '@/components/ui/SectionHead';

type CatalogKind = 'garage' | 'canopy';

interface CatalogGridProps {
  id: string;
  eyebrow: string;
  title: string;
  text?: string;
  items: CatalogSlide[];
  kind: CatalogKind;
}

function CatalogCard({
  item,
  kind,
}: {
  item: CatalogSlide;
  kind: CatalogKind;
}) {
  const img = carouselSrcSet(
    item.img,
    '(max-width: 720px) 92vw, (max-width: 1100px) 46vw, 360px',
  );
  const alt = seoImageAlt(item.title, kind);
  const priceLabel =
    item.priceFrom != null ? `От ${formatMoneyDisplay(item.priceFrom)}` : null;

  return (
    <article className="catalog-card">
      <button
        className="slide__img catalog-card__media"
        type="button"
        aria-label={`Открыть фото: ${alt}`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={img.src}
          data-full-src={img.src}
          srcSet={img.srcSet}
          sizes={img.sizes}
          alt={alt}
          width={img.width}
          height={img.height}
          loading="lazy"
          decoding="async"
        />
        <span className="slide__badge">
          {kind === 'garage' ? 'сварной каркас' : 'навес под ключ'}
        </span>
      </button>
      <div className="catalog-card__body">
        <h3 className="catalog-card__title">{item.title}</h3>
        {item.size ? <p className="catalog-card__size">{item.size}</p> : null}
        {item.meta ? <p className="catalog-card__meta">{item.meta}</p> : null}
        {priceLabel ? (
          <p className="catalog-card__price">{priceLabel}</p>
        ) : null}
        <div className="catalog-card__actions">
          <Link
            className="btn btn--primary"
            href="/#calculator"
            data-analytics-goal={GOAL.cta_calculate}
          >
            Рассчитать
          </Link>
          <Link
            className="btn btn--ghost"
            href="/#contact"
            data-analytics-goal={GOAL.cta_contact}
          >
            Заявка
          </Link>
        </div>
      </div>
    </article>
  );
}

export function CatalogGrid({
  id,
  eyebrow,
  title,
  text,
  items,
  kind,
}: CatalogGridProps) {
  return (
    <section className="section catalog-products" id={id}>
      <div className="container">
        <SectionHead eyebrow={eyebrow} title={title} text={text} />
        <div className="catalog-grid" data-catalog={kind}>
          {items.map((item) => (
            <CatalogCard key={item.title} item={item} kind={kind} />
          ))}
        </div>
      </div>
    </section>
  );
}
