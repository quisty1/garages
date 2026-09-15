// Above-the-fold hero with CTA and blueprint card.

import { company } from '@/lib/site-data';

export function Hero() {
  const primaryPhone = company.phones[0];
  const hero = company.hero;

  return (
    <section className="hero" aria-label="Первый экран">
      <div className="container hero__inner">
        <div className="hero__content">
          <div className="hero__kicker">
            <span>Металл Монтаж 33</span>
            <span>сварочное соединение</span>
          </div>
          <h1 className="hero__title" id="hero-title">
            {hero.title}
          </h1>
          <p className="hero__text" id="hero-text">
            {hero.text}
          </p>
          <div className="hero__actions">
            <a className="btn btn--primary" href="#calculator" data-cta>
              Рассчитать стоимость
            </a>
            <a className="btn btn--ghost" href={primaryPhone.href} data-phone>
              Позвонить {primaryPhone.value}
            </a>
          </div>

          <div className="hero__proof" aria-label="Ключевые особенности">
            <span>Выезд на участок</span>
            <span>Производство по чертежу</span>
            <span>Монтаж бригадой</span>
          </div>

          <div className="hero__meta">
            <div className="meta-card">
              <div className="meta-card__label">Размеры</div>
              <div className="meta-card__value" id="hero-sizes">
                {hero.sizes.value}
              </div>
              <div className="meta-card__detail" id="hero-sizes-detail">
                {hero.sizes.detail}
              </div>
            </div>
            <div className="meta-card">
              <div className="meta-card__label">Гарантия</div>
              <div className="meta-card__value" id="hero-warranty">
                {hero.warranty.value}
              </div>
              <div className="meta-card__detail" id="hero-warranty-detail">
                {hero.warranty.detail}
              </div>
            </div>
            <div className="meta-card meta-card--wide">
              <div className="meta-card__label">Области</div>
              <div className="meta-card__tags" id="hero-geo">
                {hero.geo.map((region) => (
                  <span className="meta-card__tag" key={region}>
                    {region}
                  </span>
                ))}
              </div>
              <div className="meta-card__detail" id="hero-geo-detail">
                по всем городам в этих регионах
              </div>
            </div>
          </div>
        </div>

        <div className="hero__visual" aria-hidden="true">
          <div className="hero-card" data-hero-card>
            <div className="hero-card__img">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/garage-project-8-8-v2-560.jpg"
                srcSet="/assets/garage-project-8-8-v2-560.jpg 560w, /assets/garage-project-8-8-v2.jpg 1536w"
                sizes="(max-width: 1120px) 92vw, 52vw"
                alt="Готовый гараж на два автомобиля"
                width={1536}
                height={1024}
                fetchPriority="high"
                decoding="async"
              />
              <div className="hero-blueprint" aria-hidden="true">
                <span className="hero-blueprint__line hero-blueprint__line--width" />
                <span className="hero-blueprint__line hero-blueprint__line--height" />
                <span className="hero-blueprint__label hero-blueprint__label--width">
                  8000 мм
                </span>
                <span className="hero-blueprint__label hero-blueprint__label--height">
                  3600 мм
                </span>
                <span className="hero-blueprint__point hero-blueprint__point--a" />
                <span className="hero-blueprint__point hero-blueprint__point--b" />
              </div>
            </div>
            <div className="hero-card__footer">
              <div className="hero-card__title">Гараж 8×8 м / 2 автомобиля</div>
              <div className="hero-card__sub">
                Сэндвич-панели 100 мм · ворота «Алютех»
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
