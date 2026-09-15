// List of services offered under the brand.

import { company } from '@/lib/site-data';

export function Services() {
  return (
    <section className="section section--muted" id="services">
      <div className="container">
        <div className="two-cols">
          <div>
            <div className="section__eyebrow">Работы и комплектация</div>
            <h2 className="section__title">Услуги</h2>
            <p className="section__text">
              Полный цикл: от чертежа до монтажа на вашем участке.
            </p>
            <ul className="checklist" data-services>
              {company.services.map((service) => (
                <li className="service-item" key={service}>
                  <span className="service-item__bullet" aria-hidden="true" />
                  <span>{service}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="side-card">
            <div className="side-card__top">Индивидуальный проект</div>
            <div className="side-card__body">
              <p className="side-card__text">
                Мы можем изменить любую деталь проекта согласно Вашим
                пожеланиям: размер, форма, цвет, дополнительные опции.
              </p>
              <ul className="side-list">
                <li>Размеры по вашим чертежам</li>
                <li>Любое количество машино-мест</li>
                <li>Толщина панелей 50–250 мм</li>
                <li>Утеплитель: мин. вата или пенопласт</li>
              </ul>
            </div>
            <div className="side-card__actions">
              <a className="btn btn--primary" href="#calculator" data-cta>
                Получить расчёт
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
