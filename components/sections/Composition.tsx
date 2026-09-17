// What a finished garage includes (composition cards).

import { company } from '@/lib/site-data';
import { SectionHead } from '@/components/ui/SectionHead';

export function Composition() {
  return (
    <section className="section" id="composition">
      <div className="container">
        <SectionHead
          eyebrow="Состав"
          title="Комплектация"
          text="Базовая комплектация гаража: сварной каркас, сэндвич-панели и секционные ворота."
        />
        <div className="composition-grid" data-composition>
          {company.composition.map((item) => (
            <article className="composition-card" key={item.title}>
              <div className="composition-card__media">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.img}
                  alt={item.title}
                  width={720}
                  height={480}
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="composition-card__title">{item.title}</div>
              <p className="composition-card__text">{item.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
