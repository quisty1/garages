// Site header: brand, phones, theme toggle, and mobile nav.

import { company } from '@/lib/site-data';
import { landingNavLinks } from '@/lib/landing-pages';
import { BrandLink } from './BrandLink';
import { ThemeToggle } from './ThemeToggle';
import { MobileNavControls, NavBackdrop } from './MobileNav';

export function Header() {
  const primaryPhone = company.phones[0];

  return (
    <>
      <div className="page-progress" aria-hidden="true">
        <span />
      </div>
      <header className="site-header" data-header>
        <div className="container header-inner">
          <div className="brand">
            <BrandLink>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                id="company-logo"
                src="/assets/favicon-48.png"
                srcSet="/assets/favicon-48.png 1x, /assets/favicon-96.png 2x"
                alt="Логотип Металл Монтаж 33"
                width={48}
                height={48}
                decoding="async"
              />
              <span className="brand__text">
                <span className="brand__name" id="company-name">
                  {company.name}
                </span>
                <span className="brand__sub">металлоконструкции под ключ</span>
              </span>
            </BrandLink>
          </div>

          <a
            className="header-phone"
            href={primaryPhone.href}
            data-primary-phone-link
          >
            <span className="header-phone__label">Связаться</span>
            <span className="header-phone__value" data-primary-phone-value>
              {primaryPhone.value}
            </span>
          </a>

          <ThemeToggle />
          <MobileNavControls serviceLinks={landingNavLinks} />
        </div>
      </header>
      <NavBackdrop />
    </>
  );
}
