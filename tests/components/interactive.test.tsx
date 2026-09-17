// Component tests for mobile nav, carousel controls, and contact copy.

import { describe, expect, it, vi } from 'vitest';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MobileNavControls, NavBackdrop } from '@/components/layout/MobileNav';
import { Carousel } from '@/components/ui/Carousel';
import { ContactCopy } from '@/components/sections/ContactCopy';

describe('MobileNav', () => {
  it('toggles drawer open state', async () => {
    const user = userEvent.setup();
    // Force the mobile drawer breakpoint so aria-hidden / inert apply.
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: (query: string) => ({
        matches: query.includes('max-width'),
        media: query,
        addEventListener: () => undefined,
        removeEventListener: () => undefined,
        addListener: () => undefined,
        removeListener: () => undefined,
        dispatchEvent: () => false,
        onchange: null,
      }),
    });

    render(
      <>
        <header>
          <div className="header-inner">
            <MobileNavControls
              serviceLinks={[
                { label: 'Гаражи', href: '/garazhi/' },
                { label: 'Навесы', href: '/navesy/' },
              ]}
            />
          </div>
        </header>
        <NavBackdrop />
      </>,
    );

    const toggle = document.querySelector(
      '[data-nav-toggle]',
    ) as HTMLButtonElement;
    const nav = document.querySelector('[data-nav]') as HTMLElement;
    await user.click(toggle);
    expect(nav).toHaveClass('is-open');
  });
});

describe('Carousel', () => {
  it('renders slides and controls', () => {
    render(
      <Carousel
        name="garages"
        label="Карусель гаражей"
        kind="garage"
        slides={[
          {
            title: 'Гараж 6×4 м',
            size: '6000 × 4000 × 2400 мм',
            meta: 'Длина 6 м',
            img: '/assets/garage-6x4.webp',
          },
        ]}
      />,
    );
    expect(document.querySelector('[data-carousel="garages"]')).toBeTruthy();
    expect(document.querySelector('[data-carousel-prev]')).toBeTruthy();
    expect(document.querySelector('.slide__title')?.textContent).toContain(
      'Гараж',
    );
  });
});

describe('ContactCopy', () => {
  it('renders copy buttons when clipboard is available', async () => {
    const writeText = vi.fn(async () => undefined);
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText },
    });
    document.body.innerHTML = `
      <div class="contacts-panel">
        <a href="tel:+79042543674"><span class="contact-tile__value">+7 (904) 254-36-74</span></a>
        <span id="contact-email">MetallMontage33@yandex.ru</span>
        <div id="requisites">
          <h3 class="requisites-panel__title">Реквизиты компании</h3>
          <div id="requisites-name">ИП Test</div>
          <div class="requisites-panel__subtitle">Банковские реквизиты</div>
          <span id="requisites-ogrnip">123456789012345</span>
          <span id="requisites-inn">123456789012</span>
          <span id="requisites-bank">Тест Банк</span>
          <span id="requisites-account">111</span>
          <span id="requisites-corr-account">222</span>
          <span id="requisites-bic">333</span>
        </div>
        <div id="copy-host"></div>
      </div>
    `;
    const host = document.getElementById('copy-host')!;
    const { container } = render(<ContactCopy />, { container: host });
    await new Promise((r) => setTimeout(r, 0));
    expect(
      container.querySelectorAll('.contact-copy__button').length,
    ).toBeGreaterThan(0);
    const requisitesButton = Array.from(
      container.querySelectorAll<HTMLButtonElement>('.contact-copy__button'),
    ).find((button) => button.textContent?.includes('реквизиты'))!;
    await userEvent.click(requisitesButton);
    expect(writeText).toHaveBeenCalledWith(
      [
        'Реквизиты компании',
        'ИП Test',
        'ОГРНИП 123456789012345',
        'ИНН 123456789012',
        'Банковские реквизиты',
        'Банк Тест Банк',
        'Р/с 111',
        'К/с 222',
        'БИК 333',
      ].join('\n'),
    );
  });
});
