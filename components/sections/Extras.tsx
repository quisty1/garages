// Optional extras / add-ons grid.

import { company } from '@/lib/site-data';
import { SectionHead } from '@/components/ui/SectionHead';

export function Extras() {
  return (
    <section className="section section--muted" id="extras">
      <div className="container">
        <SectionHead eyebrow="Опции" title="Дополнительные услуги" />
        <div className="cards-grid cards-grid--3" data-extras>
          {company.extras.map((item, index) => (
            <article className="card" key={item.title}>
              <div className="card__num">
                {String(index + 1).padStart(2, '0')}
              </div>
              <div className="card__title">{item.title}</div>
              <p className="card__text">{item.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
