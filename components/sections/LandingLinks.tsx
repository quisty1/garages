import { landingPages, landingHref } from '@/lib/landing-pages';

export function LandingLinks({ currentSlug }: { currentSlug?: string }) {
  return (
    <section className="section section--muted" id="directions">
      <div className="container">
        <div className="section__eyebrow">Подберите решение</div>
        <h2 className="section__title">
          {currentSlug
            ? 'Другие варианты конструкций'
            : 'Гаражи и навесы: подробнее о каждом решении'}
        </h2>
        <div className="landing-links">
          {landingPages
            .filter((page) => page.slug !== currentSlug)
            .map((page) => (
              <a
                className="landing-link"
                href={landingHref(page)}
                key={page.slug}
              >
                <h3>{page.label}</h3>
                <p>{page.intro}</p>
                <span>Комплектация и расчёт →</span>
              </a>
            ))}
        </div>
      </div>
    </section>
  );
}
