// Roof type options with schematic icons.

import { company } from '@/lib/site-data';
import { RoofIcon } from '@/components/ui/RoofIcon';
import { SectionHead } from '@/components/ui/SectionHead';

export function Roofs() {
  return (
    <section className="section" id="roofs">
      <div className="container">
        <SectionHead
          eyebrow="Конструктив"
          title="Тип кровли"
          text="Подберём оптимальный тип кровли под планировку участка и задачи."
        />
        <div className="roofs-grid" data-roofs>
          {company.roofs.map((roof, index) => (
            <article className="roof-card" key={roof.title}>
              <div className="roof-card__meta">
                кровля {String(index + 1).padStart(2, '0')}
              </div>
              <div className="roof-card__icon" aria-hidden="true">
                <RoofIcon icon={roof.icon} />
              </div>
              <h3 className="roof-card__title">{roof.title}</h3>
              <p className="roof-card__text">{roof.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
