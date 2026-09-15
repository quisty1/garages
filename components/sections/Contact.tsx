// Contact panel: phones, email, map, requisites, copy buttons.

import { company } from '@/lib/site-data';
import { formatAddressLine, getMapUrl } from '@/lib/format';
import { ContactCopy } from './ContactCopy';
import { MessengerLinks } from '@/components/ui/MessengerLinks';
import { SectionHead } from '@/components/ui/SectionHead';

export function Contact() {
  const addressLine = formatAddressLine(company.address);
  const mapUrl = getMapUrl(company.address);
  const { legal } = company;

  return (
    <section
      className="section section--contact"
      id="contact"
      aria-label="Контакты"
    >
      <div className="container">
        <SectionHead
          eyebrow="Расчёт и консультация"
          title="Контакты"
          text="Позвоните или напишите — ответим и поможем с расчётом (размер, ворота, материалы, адрес)."
          contact
        />

        <div className="contacts-panel">
          <div className="contacts-panel__grid" data-phones>
            {company.phones.map((phone) => (
              <a
                className="contact-tile contact-tile--accent"
                href={phone.href}
                key={phone.href}
              >
                <span className="contact-tile__label">Телефон</span>
                <span className="contact-tile__value">{phone.value}</span>
              </a>
            ))}
          </div>

          <div className="contacts-panel__grid contacts-panel__grid--2">
            <a
              className="contact-tile"
              href={`mailto:${company.email}`}
              id="contact-email-tile"
            >
              <span className="contact-tile__label">Email</span>
              <span className="contact-tile__value" id="contact-email">
                {company.email}
              </span>
            </a>
            <div className="contact-tile contact-tile--static">
              <span className="contact-tile__label">Время работы</span>
              <span className="contact-tile__value" id="contact-hours">
                {company.hours}
              </span>
            </div>
          </div>

          <a
            className="contact-tile contact-tile--address"
            id="contact-address-tile"
            href={mapUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="contact-tile__label">Адрес</span>
            <span className="contact-tile__value" id="contact-address">
              {addressLine}
            </span>
            <span className="contact-tile__hint">Открыть на карте</span>
          </a>

          <div className="contacts-panel__block">
            <h3 className="contacts-panel__subtitle">Мессенджеры</h3>
            <MessengerLinks />
          </div>

          <ContactCopy />
        </div>

        <div className="requisites-panel" id="requisites">
          <h3 className="requisites-panel__title">Реквизиты компании</h3>
          <div className="requisites-panel__name" id="requisites-name">
            {legal.form} {legal.fullName}
          </div>
          <ul className="requisites-panel__list">
            <li>
              <strong>ОГРНИП</strong>
              <span id="requisites-ogrnip">{legal.ogrnip}</span>
            </li>
            <li>
              <strong>ИНН</strong>
              <span id="requisites-inn">{legal.inn}</span>
            </li>
          </ul>
          <div id="requisites-bank-details">
            <div className="requisites-panel__subtitle">Банковские реквизиты</div>
            <ul className="requisites-panel__list">
              <li>
                <strong>Банк</strong>
                <span id="requisites-bank">{legal.bank.name}</span>
              </li>
              <li>
                <strong>Р/с</strong>
                <span id="requisites-account">{legal.bank.account}</span>
              </li>
              <li>
                <strong>К/с</strong>
                <span id="requisites-corr-account">{legal.bank.corrAccount}</span>
              </li>
              <li>
                <strong>БИК</strong>
                <span id="requisites-bic">{legal.bank.bic}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
