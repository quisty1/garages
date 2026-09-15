// Factors that influence the final project price.

import { company } from '@/lib/site-data';
import { SectionHead } from '@/components/ui/SectionHead';

export function PriceFactors() {
  return (
    <section className="section" id="price-factors">
      <div className="container">
        <SectionHead
          eyebrow="Расчёт сметы"
          title="Факторы влияющие на стоимость"
          centered
        />
        <div className="factors-grid" data-price-factors>
          {company.priceFactors.map((factor, index) => (
            <article
              className={`factor-cell${index === company.priceFactors.length - 1 ? ' factor-cell--alt' : ''}`}
              key={factor.title}
            >
              <h3 className="factor-cell__title">{factor.title}</h3>
              <p className="factor-cell__text">{factor.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
