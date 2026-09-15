// Canopy catalog section wrapping the shared Carousel.

import { company } from '@/lib/site-data';
import { Carousel } from '@/components/ui/Carousel';
import { SectionHead } from '@/components/ui/SectionHead';

export function Canopies() {
  return (
    <section className="section section--muted" id="canopies">
      <div className="container">
        <SectionHead
          eyebrow="Каталог / навесы"
          title="Навесы"
          text="Металлические навесы для авто, дома и хозяйственных нужд — под ключ с доставкой и монтажом в Москве и по всем городам четырёх областей."
        />
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
