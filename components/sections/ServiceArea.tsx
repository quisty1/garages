// Geographic service area and featured cities.

import { company } from '@/lib/site-data';

export function ServiceArea() {
  const section = company.serviceAreaSection;

  return (
    <section
      className="section section--muted"
      id="service-area"
      aria-label="Где работаем"
    >
      <div className="container">
        <div className="section__head">
          <div>
            <div className="section__eyebrow" id="service-area-eyebrow">
              {section.eyebrow}
            </div>
            <h2 className="section__title" id="service-area-title">
              {section.title}
            </h2>
          </div>
          <p className="section__text" id="service-area-text">
            {section.text}
          </p>
        </div>
        <ul className="service-area__cities" data-featured-cities>
          {company.seo.serviceArea.featuredCities.map((city) => (
            <li className="service-area__city" key={city}>
              {city}
            </li>
          ))}
        </ul>
        <p className="service-area__more" id="service-area-more">
          {section.moreLabel}
        </p>
      </div>
    </section>
  );
}
