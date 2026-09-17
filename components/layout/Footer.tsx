import Link from 'next/link';
// Site footer with contacts, messengers, and legal links.

import { company } from '@/lib/site-data';
import { formatAddressLine, getMapUrl } from '@/lib/format';
import { MessengerLinks } from '@/components/ui/MessengerLinks';

export function Footer() {
  const addressLine = formatAddressLine(company.address);
  const mapUrl = getMapUrl(company.address);
  const year = new Date().getFullYear();
  const { legal } = company;

  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/favicon-48.png"
            srcSet="/assets/favicon-48.png 1x, /assets/favicon-96.png 2x"
            alt="Логотип Металл Монтаж 33"
            width={44}
            height={44}
            loading="lazy"
            decoding="async"
          />
          <div>
            <div className="footer-brand__name" id="footer-company-name">
              {company.name}
            </div>
            <div className="footer-brand__sub">Гаражи и навесы под ключ</div>
          </div>
        </div>

        <div className="footer-cols">
          <div className="footer-col">
            <div className="footer-col__title">Телефоны</div>
            <ul className="footer-list" data-footer-phones>
              {company.phones.map((phone) => (
                <li key={phone.href}>
                  <a href={phone.href}>{phone.value}</a>
                </li>
              ))}
            </ul>
            <MessengerLinks variant="footer" />
          </div>
          <div className="footer-col">
            <div className="footer-col__title">Контакты</div>
            <ul className="footer-list">
              <li>
                Email:{' '}
                <a href={`mailto:${company.email}`} id="footer-email">
                  {company.email}
                </a>
              </li>
              <li>
                Адрес:{' '}
                <a
                  id="footer-address-link"
                  href={mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span id="footer-address">{addressLine}</span>
                </a>
              </li>
              <li>
                Время работы: <span id="footer-hours">{company.hours}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="container footer-bottom">
        <div className="footer-bottom__meta">
          <div>
            © <span id="year">{year}</span>{' '}
            <span id="footer-company-name2">{company.name}</span>. Все права
            защищены.
          </div>
          <div className="footer-legal" id="footer-legal">
            {legal.form} {legal.fullName} · ИНН {legal.inn} · ОГРНИП{' '}
            {legal.ogrnip}
          </div>
          <div className="footer-credit">
            Сайт разработал{' '}
            <a
              href="https://t.me/yar_bragin"
              rel="noopener noreferrer"
              target="_blank"
            >
              Брагин Ярослав
            </a>
          </div>
        </div>
        <div className="footer-bottom__links">
          <Link href="/metallicheskie-garazhi/">Гаражи</Link>
          <Link href="/navesy-dlya-avtomobilej/">Навесы</Link>
          <Link href="/#garage-projects">Наши работы</Link>
          <Link href="/#directions">Услуги</Link>
          <a href="#workflow">Этапы</a>
          <a href="#faq">Вопросы</a>
          <a href="#contact">Контакты</a>
        </div>
      </div>
    </footer>
  );
}
