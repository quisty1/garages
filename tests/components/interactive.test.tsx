// Component tests for mobile nav, carousel controls, and contact copy.

import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render } from '@testing-library/react';
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

    const services = document.querySelector<HTMLButtonElement>(
      '[aria-controls="nav-services"]',
    )!;
    const catalog = document.querySelector<HTMLButtonElement>(
      '[aria-controls="nav-catalog"]',
    )!;
    await user.click(services);
    expect(services).toHaveAttribute('aria-expanded', 'true');
    await user.click(catalog);
    expect(catalog).toHaveAttribute('aria-expanded', 'true');
    expect(services).toHaveAttribute('aria-expanded', 'false');

    await user.click(document.querySelector('[data-nav-backdrop]')!);
    expect(nav).not.toHaveClass('is-open');
    await user.click(toggle);
    await user.keyboard('{Escape}');
    expect(nav).not.toHaveClass('is-open');
  });

  it('opens desktop dropdowns with pointer and keyboard focus', () => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
    render(
      <header>
        <div className="header-inner">
          <MobileNavControls serviceLinks={[]} />
        </div>
      </header>,
    );

    const services = document.querySelector<HTMLElement>(
      '[data-nav-dropdown="services"]',
    )!;
    const catalog = document.querySelector<HTMLElement>(
      '[data-nav-dropdown="catalog"]',
    )!;
    fireEvent.mouseEnter(services);
    expect(services).toHaveClass('is-open');
    fireEvent.mouseLeave(services);
    expect(services).not.toHaveClass('is-open');
    fireEvent.mouseEnter(catalog);
    expect(catalog).toHaveClass('is-open');
    catalog.querySelector<HTMLButtonElement>('button')!.focus();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(catalog).not.toHaveClass('is-open');
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

  it('moves between slides with reduced motion', async () => {
    const user = userEvent.setup();
    const scrollIntoView = vi.fn();
    Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', {
      configurable: true,
      value: scrollIntoView,
    });
    Object.defineProperty(HTMLElement.prototype, 'scrollWidth', {
      configurable: true,
      get: () => 600,
    });
    Object.defineProperty(HTMLElement.prototype, 'clientWidth', {
      configurable: true,
      get: () => 300,
    });
    vi.mocked(window.matchMedia).mockImplementation((query: string) => ({
      matches: query.includes('prefers-reduced-motion'),
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
    render(
      <Carousel
        name="canopies"
        label="Карусель навесов"
        kind="canopy"
        slides={[
          { title: 'Навес 1', img: '/assets/canopy-1.webp' },
          { title: 'Навес 2', img: '/assets/canopy-2.webp' },
        ]}
      />,
    );

    await user.click(
      document.querySelector<HTMLButtonElement>('[data-carousel-next]')!,
    );
    expect(scrollIntoView).toHaveBeenCalledWith({
      behavior: 'auto',
      inline: 'start',
      block: 'nearest',
    });
    const previous = document.querySelector<HTMLButtonElement>(
      '[data-carousel-prev]',
    )!;
    previous.disabled = false;
    await user.click(previous);
    expect(scrollIntoView).toHaveBeenCalledTimes(2);
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
