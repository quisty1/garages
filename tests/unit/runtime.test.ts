import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  formatAddressLine,
  formatMoneyDisplay,
  formatPrice,
  formatProjectPrice,
  getMapUrl,
  money,
} from '@/lib/format';
import {
  getFocusable,
  setMenuBackgroundInert,
  setPageInert,
} from '@/lib/focus';
import {
  getCounterId,
  initAnalytics,
  isAllowedHost,
  METRIKA_SCRIPT_URL,
  sendGoal,
} from '@/lib/analytics';
import type { Address } from '@/lib/types';

describe('format helpers', () => {
  it('formats addresses and builds map fallbacks', () => {
    const address: Address = {
      addressLocality: 'Владимир',
      addressNote: 'район Юрьевец',
      streetAddress: 'ул. Тестовая, 1',
      postalCode: '600000',
      addressRegion: 'Владимирская область',
      addressCountry: 'RU',
      latitude: 56.1,
      longitude: 40.4,
      mapUrl: '',
    };
    expect(formatAddressLine(address)).toBe(
      'г. Владимир, район Юрьевец, ул. Тестовая, 1, 600000',
    );
    expect(getMapUrl({ ...address, mapUrl: 'https://maps.example/test' })).toBe(
      'https://maps.example/test',
    );
    expect(getMapUrl(address)).toContain(
      encodeURIComponent('Владимир, ул. Тестовая, 1'),
    );
    expect(
      getMapUrl({
        ...address,
        addressLocality: '',
        streetAddress: '',
        mapUrl: '',
      }),
    ).toBe('');
  });

  it('formats valid money and rejects non-finite values', () => {
    expect(formatPrice(1150000)).toMatch(/^1\s150\s000$/);
    expect(formatPrice(Number.NaN)).toBe('');
    expect(formatMoneyDisplay(6000)).toMatch(/^6\s000\u00a0₽$/);
    expect(formatMoneyDisplay(Number.POSITIVE_INFINITY)).toBe('');
    expect(formatProjectPrice(6000)).toMatch(/^Цена: 6\s000\u00a0₽$/);
    expect(formatProjectPrice(Number.NaN)).toBe('');
    expect(money(919400)).toMatch(/^919\s000 ₽$/);
  });
});

describe('focus helpers', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('finds only visible focusable descendants', () => {
    document.body.innerHTML = `
      <div id="root">
        <a href="/">Link</a>
        <button hidden>Hidden</button>
        <div hidden><button>Nested hidden</button></div>
        <button aria-hidden="true">ARIA hidden</button>
        <input disabled />
      </div>
    `;
    expect(getFocusable(null)).toEqual([]);
    expect(getFocusable(document.getElementById('root'))).toHaveLength(1);
  });

  it('toggles inert state for page and menu backgrounds', () => {
    document.body.innerHTML = `
      <a class="skip-link" href="#main">Skip</a>
      <header><div class="header-inner">
        <button id="toggle">Menu</button><nav id="nav"></nav><div id="brand"></div>
      </div></header>
      <main id="main"></main><footer></footer><button class="scroll-top"></button>
    `;
    const header = document.querySelector('header');
    const toggle = document.getElementById('toggle');
    const nav = document.getElementById('nav');

    setPageInert(true);
    expect(document.getElementById('main')).toHaveProperty('inert', true);
    setPageInert(false);
    expect(document.getElementById('main')).toHaveProperty('inert', false);

    setMenuBackgroundInert(true, header, toggle, nav);
    expect(document.getElementById('brand')).toHaveProperty('inert', true);
    expect(toggle).not.toHaveProperty('inert', true);
  });
});

describe('analytics runtime', () => {
  beforeEach(() => {
    document.head
      .querySelectorAll(`script[src="${METRIKA_SCRIPT_URL}"]`)
      .forEach((node) => node.remove());
    delete window.ym;
    document.body.innerHTML = '';
  });

  it('validates the configured counter and host allowlist', () => {
    expect(getCounterId()).toBe(110290656);
    expect(isAllowedHost('metallmontage33.ru')).toBe(true);
    expect(isAllowedHost('localhost')).toBe(false);
  });

  it('initializes Metrika, queues goals, and tracks SPA pageviews', () => {
    const now = vi.spyOn(Date, 'now').mockReturnValue(123);
    initAnalytics();

    expect(
      document.querySelector(`script[src="${METRIKA_SCRIPT_URL}"]`),
    ).not.toBeNull();
    expect(window.ym?.l).toBe(123);
    expect(window.ym?.a?.[0]?.[1]).toBe('init');

    const hero = document.createElement('div');
    hero.className = 'hero';
    hero.innerHTML =
      '<a href="#calculator" data-analytics-goal="cta_calculate" data-analytics-label="primary"><span>Рассчитать</span></a>';
    document.body.append(hero);
    hero
      .querySelector('span')
      ?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(window.ym?.a).toContainEqual([
      110290656,
      'reachGoal',
      'cta_calculate',
      { placement: 'hero', label: 'primary' },
    ]);

    initAnalytics();
    expect(window.ym?.a?.some((call) => call[1] === 'hit')).toBe(true);
    now.mockRestore();
  });

  it('tracks scheme and messenger clicks and ignores calls without ym', () => {
    const ym = vi.fn();
    window.ym = ym;
    document.body.innerHTML = `
      <header class="site-header"><a href="tel:+70000000000">Phone</a></header>
      <footer class="site-footer">
        <a href="mailto:test@example.com">Email</a>
        <a href="#" data-analytics-goal="messenger_click" data-analytics-label="MAX">MAX</a>
      </footer>
    `;
    const preventNavigation = (event: Event) => event.preventDefault();
    document.addEventListener('click', preventNavigation);
    initAnalytics();
    document
      .querySelectorAll('a')
      .forEach((link) =>
        link.dispatchEvent(
          new MouseEvent('click', { bubbles: true, cancelable: true }),
        ),
      );
    document.removeEventListener('click', preventNavigation);

    expect(ym).toHaveBeenCalledWith(110290656, 'reachGoal', 'phone_click', {
      placement: 'header',
    });
    expect(ym).toHaveBeenCalledWith(110290656, 'reachGoal', 'email_click', {
      placement: 'footer',
    });
    expect(ym).toHaveBeenCalledWith(110290656, 'reachGoal', 'messenger_click', {
      placement: 'footer',
      messenger: 'MAX',
    });

    delete window.ym;
    expect(() => sendGoal('cta_contact')).not.toThrow();
  });
});
