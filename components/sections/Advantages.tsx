// Why-us stats and advantage cards.

import { company } from '@/lib/site-data';
import { SectionHead } from '@/components/ui/SectionHead';

export function Advantages() {
  return (
    <section className="section" id="advantages">
      <div className="container">
        <SectionHead
          eyebrow="Почему мы"
          title="Преимущества"
          text={
            'Панели 50–250\u00a0мм, сварной каркас и гарантия 3\u00a0года на все работы.'
          }
        />
        <div className="stats-grid" data-advantages>
          {company.advantages.map((item, index) => {
            const num = String(index + 1).padStart(2, '0');
            const variant =
              index % 2 === 0 ? 'stat-card--primary' : 'stat-card--steel';
            return (
              <article className={`stat-card ${variant}`} key={item.title}>
                <div className="stat-card__num" aria-hidden="true">
                  {num}
                </div>
                <div className="stat-card__title">{item.title}</div>
                <p className="stat-card__value">{item.value}</p>
                <p className="stat-card__text">
                  {item.lines.map((line) => (
                    <span key={line}>{line}</span>
                  ))}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
