// Garage catalog section wrapping the shared Carousel.

import { company } from '@/lib/site-data';
import { Carousel } from '@/components/ui/Carousel';
import { SectionHead } from '@/components/ui/SectionHead';

export function Garages() {
  return (
    <section className="section" id="garages">
      <div className="container">
        <SectionHead
          eyebrow="Каталог / сварные гаражи"
          title="Гаражи"
          text="Четыре популярных размера металлических гаражей из сэндвич-панелей. Изготовление и монтаж под ключ во Владимирской, Московской, Нижегородской и Ивановской областях."
        />
        <Carousel
          name="garages"
          label="Карусель гаражей"
          slides={[...company.garages]}
          kind="garage"
        />
      </div>
    </section>
  );
}
