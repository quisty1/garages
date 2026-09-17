// Completed garage projects gallery (opens in lightbox).

import { company } from '@/lib/site-data';
import { formatProjectPrice } from '@/lib/format';
import { previewPath, seoImageAlt } from '@/lib/images';
import { SectionHead } from '@/components/ui/SectionHead';

export function Projects() {
  return (
    <section className="section" id="garage-projects">
      <div className="container">
        <SectionHead
          eyebrow="Готовые объекты"
          title="Примеры гаражей"
          text="Реализованные гаражи из сэндвич-панелей с размерами, комплектацией и стоимостью под ключ."
        />
        <div className="project-list" data-garage-projects>
          {company.garageProjects.map((project) => {
            const sizeLabel = project.size.split(' × ').slice(0, 2).join('×');
            return (
              <article className="project" key={project.size}>
                <button
                  className="slide__img project__img"
                  type="button"
                  aria-label={`Открыть фото: ${project.title.toLowerCase()} ${sizeLabel}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={project.img}
                    srcSet={`${previewPath(project.img)} 560w, ${project.img} ${project.imgWidth}w`}
                    sizes="(max-width: 720px) 92vw, (max-width: 980px) 88vw, 960px"
                    alt={seoImageAlt(project.title, 'garage')}
                    width={project.imgWidth}
                    height={project.imgHeight}
                    loading="lazy"
                    decoding="async"
                  />
                </button>
                <div className="project__body">
                  <div className="project__title">{project.title}</div>
                  <p className="project__size">{project.size}</p>
                  <p className="project__price">
                    {formatProjectPrice(project.price)}
                  </p>
                  <ul className="project__specs">
                    {project.specs.map((spec) => (
                      <li key={spec}>{spec}</li>
                    ))}
                  </ul>
                  <p className="project__location">{project.location}</p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
