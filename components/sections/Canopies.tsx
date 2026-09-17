// Canopy catalog section wrapping the shared Carousel.

import { company } from '@/lib/site-data';
import { Carousel } from '@/components/ui/Carousel';
import { SectionHead } from '@/components/ui/SectionHead';

export function Canopies() {
  return (
    <section className="section section--muted" id="canopies">
      <div className="container">
        <SectionHead eyebrow="Каталог / навесы" title="Навесы" />
        <Carousel
          name="canopies"
          label="Карусель навесов"
          slides={[...company.canopies]}
          kind="canopy"
        />
      </div>
    </section>
  );
}
