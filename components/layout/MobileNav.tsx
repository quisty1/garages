'use client';

import Link from 'next/link';

// Mobile drawer nav: open/close, focus trap, inert background, breakpoint sync.
// Catalog + Services are dropdowns (desktop hover/focus) / accordion (mobile drawer).

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FocusEvent,
} from 'react';
import { MOBILE_MENU_QUERY } from '@/lib/constants';
import { getFocusable, setMenuBackgroundInert } from '@/lib/focus';
import {
  catalogCanopiesHref,
  catalogGaragesHref,
  catalogHref,
} from '@/lib/catalog';
import type { LandingNavLink } from '@/lib/landing-pages';

type DropdownKey = 'catalog' | 'services';

export function MobileNavControls({
  serviceLinks,
}: {
  serviceLinks: LandingNavLink[];
}) {
  const toggleRef = useRef<HTMLButtonElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const catalogChevronRef = useRef<HTMLButtonElement>(null);
  const servicesTriggerRef = useRef<HTMLButtonElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const [catalogOpen, setCatalogOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);

  const closeDropdowns = useCallback(() => {
    setCatalogOpen(false);
    setServicesOpen(false);
  }, []);

  const setOpen = useCallback(
    (open: boolean, { restoreFocus = true } = {}) => {
      const toggle = toggleRef.current;
      const nav = navRef.current;
      const backdrop = document.querySelector<HTMLDivElement>(
        '[data-nav-backdrop]',
      );
      if (!toggle || !nav) return;

      const wasOpen = nav.classList.contains('is-open');
      nav.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
      document.body.classList.toggle('menu-open', open);

      if (!open) {
        closeDropdowns();
      }

      const mobileQuery = window.matchMedia(MOBILE_MENU_QUERY);
      // aria-hidden only applies in the drawer layout; desktop keeps nav visible.
      if (mobileQuery.matches) {
        nav.setAttribute('aria-hidden', String(!open));
      } else {
        nav.removeAttribute('aria-hidden');
      }

      if (backdrop) {
        backdrop.classList.toggle('is-visible', open);
        backdrop.hidden = !open;
        backdrop.setAttribute('aria-hidden', String(!open));
      }

      const header = toggle.closest('header');
      if (open || wasOpen) {
        setMenuBackgroundInert(open, header as HTMLElement | null, toggle, nav);
      }

      if (open) {
        returnFocusRef.current = document.activeElement as HTMLElement;
        (getFocusable(nav)[0] || toggle).focus();
      } else if (wasOpen && restoreFocus && returnFocusRef.current?.focus) {
        returnFocusRef.current.focus();
        returnFocusRef.current = null;
      }
    },
    [closeDropdowns],
  );

  useEffect(() => {
    const toggle = toggleRef.current;
    const nav = navRef.current;
    if (!toggle || !nav) return;

    const mobileQuery = window.matchMedia(MOBILE_MENU_QUERY);
    const backdrop = document.querySelector<HTMLDivElement>(
      '[data-nav-backdrop]',
    );

    const onToggle = () => setOpen(!nav.classList.contains('is-open'));
    const onBackdrop = () => setOpen(false);
    const onNavClick = (e: MouseEvent) => {
      // Close after in-page hash navigation; keep drawer open when toggling submenu.
      const target = e.target as Element;
      if (target.closest('.nav__chevron-btn')) return;
      if (target.closest('a')) setOpen(false);
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (!mobileQuery.matches) {
          const catalogItem = nav.querySelector(
            '[data-nav-dropdown="catalog"]',
          );
          const servicesItem = nav.querySelector(
            '[data-nav-dropdown="services"]',
          );
          if (catalogItem?.contains(document.activeElement)) {
            e.preventDefault();
            setCatalogOpen(false);
            catalogChevronRef.current?.focus();
            return;
          }
          if (servicesItem?.contains(document.activeElement)) {
            e.preventDefault();
            setServicesOpen(false);
            servicesTriggerRef.current?.focus();
            return;
          }
        }

        if (!nav.classList.contains('is-open')) return;
        e.preventDefault();
        setOpen(false);
        return;
      }

      if (!nav.classList.contains('is-open')) return;
      if (e.key === 'Tab') {
        const focusable = [toggle, ...getFocusable(nav)];
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };

    const syncBreakpoint = () => {
      closeDropdowns();
      if (!mobileQuery.matches) {
        // Expanding to desktop: force-close without stealing focus.
        setOpen(false, { restoreFocus: false });
        nav.removeAttribute('aria-hidden');
      } else if (!nav.classList.contains('is-open')) {
        if (nav.contains(document.activeElement)) toggle.focus();
        nav.setAttribute('aria-hidden', 'true');
      }
    };

    toggle.addEventListener('click', onToggle);
    backdrop?.addEventListener('click', onBackdrop);
    nav.addEventListener('click', onNavClick);
    document.addEventListener('keydown', onKeyDown);
    mobileQuery.addEventListener('change', syncBreakpoint);
    syncBreakpoint();
    document.documentElement.classList.add('js-ready');

    return () => {
      toggle.removeEventListener('click', onToggle);
      backdrop?.removeEventListener('click', onBackdrop);
      nav.removeEventListener('click', onNavClick);
      document.removeEventListener('keydown', onKeyDown);
      mobileQuery.removeEventListener('change', syncBreakpoint);
      // Drop body lock / inert if the drawer was open when this tree unmounts.
      setOpen(false, { restoreFocus: false });
    };
  }, [closeDropdowns, setOpen]);

  const isMobileNav = () => window.matchMedia(MOBILE_MENU_QUERY).matches;

  const openDropdown = (key: DropdownKey) => {
    if (key === 'catalog') {
      setCatalogOpen(true);
      setServicesOpen(false);
    } else {
      setServicesOpen(true);
      setCatalogOpen(false);
    }
  };

  const closeDropdown = (key: DropdownKey) => {
    if (key === 'catalog') setCatalogOpen(false);
    else setServicesOpen(false);
  };

  const onCatalogToggle = () => {
    if (isMobileNav()) {
      setCatalogOpen((open) => !open);
      setServicesOpen(false);
    }
  };

  const onServicesToggle = () => {
    if (isMobileNav()) {
      setServicesOpen((open) => !open);
      setCatalogOpen(false);
    }
  };

  const onDropdownBlur =
    (key: DropdownKey) => (e: FocusEvent<HTMLLIElement>) => {
      if (isMobileNav()) return;
      if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
        closeDropdown(key);
      }
    };

  return (
    <>
      <button
        ref={toggleRef}
        className="nav-toggle"
        type="button"
        aria-label="Открыть меню"
        aria-expanded="false"
        aria-controls="site-nav"
        data-nav-toggle
      >
        <span className="nav-toggle__icon" aria-hidden="true">
          <span className="nav-toggle__bar" />
          <span className="nav-toggle__bar" />
          <span className="nav-toggle__bar" />
        </span>
      </button>

      <nav
        ref={navRef}
        className="nav"
        id="site-nav"
        aria-label="Основная навигация"
        data-nav
      >
        <ul className="nav__list">
          <li
            className={`nav__item nav__item--dropdown${servicesOpen ? ' is-open' : ''}`}
            data-nav-dropdown="services"
            onMouseEnter={() => {
              if (!isMobileNav()) openDropdown('services');
            }}
            onMouseLeave={() => {
              if (!isMobileNav()) closeDropdown('services');
            }}
            onFocus={() => {
              if (!isMobileNav()) openDropdown('services');
            }}
            onBlur={onDropdownBlur('services')}
          >
            <div className="nav__dropdown-row">
              <Link
                className="nav__link nav__link--dropdown"
                href="/#directions"
              >
                Услуги
                <span
                  className="nav__chevron nav__chevron--inline"
                  aria-hidden="true"
                />
              </Link>
              <button
                ref={servicesTriggerRef}
                type="button"
                className="nav__chevron-btn"
                aria-expanded={servicesOpen}
                aria-haspopup="true"
                aria-controls="nav-services"
                aria-label={
                  servicesOpen ? 'Скрыть список услуг' : 'Показать список услуг'
                }
                onClick={onServicesToggle}
              >
                <span className="nav__chevron" aria-hidden="true" />
              </button>
            </div>
            <ul
              id="nav-services"
              className="nav__submenu"
              hidden={!servicesOpen}
            >
              {serviceLinks.map(({ label, href }) => (
                <li key={href}>
                  <Link className="nav__sublink" href={href}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </li>
          <li
            className={`nav__item nav__item--dropdown${catalogOpen ? ' is-open' : ''}`}
            data-nav-dropdown="catalog"
            onMouseEnter={() => {
              if (!isMobileNav()) openDropdown('catalog');
            }}
            onMouseLeave={() => {
              if (!isMobileNav()) closeDropdown('catalog');
            }}
            onFocus={() => {
              if (!isMobileNav()) openDropdown('catalog');
            }}
            onBlur={onDropdownBlur('catalog')}
          >
            <div className="nav__dropdown-row">
              <Link
                className="nav__link nav__link--dropdown"
                href={catalogHref()}
              >
                Каталог
                <span
                  className="nav__chevron nav__chevron--inline"
                  aria-hidden="true"
                />
              </Link>
              <button
                ref={catalogChevronRef}
                type="button"
                className="nav__chevron-btn"
                aria-expanded={catalogOpen}
                aria-haspopup="true"
                aria-controls="nav-catalog"
                aria-label={
                  catalogOpen
                    ? 'Скрыть разделы каталога'
                    : 'Показать разделы каталога'
                }
                onClick={onCatalogToggle}
              >
                <span className="nav__chevron" aria-hidden="true" />
              </button>
            </div>
            <ul id="nav-catalog" className="nav__submenu" hidden={!catalogOpen}>
              <li>
                <Link className="nav__sublink" href={catalogGaragesHref()}>
                  Гаражи
                </Link>
              </li>
              <li>
                <Link className="nav__sublink" href={catalogCanopiesHref()}>
                  Навесы
                </Link>
              </li>
            </ul>
          </li>
          <li>
            <Link className="nav__link" href="/#garages">
              Наши работы
            </Link>
          </li>
          <li>
            <Link className="nav__link" href="/blog/">
              Блог
            </Link>
          </li>
          <li>
            <Link className="nav__link" href="/about/">
              О компании
            </Link>
          </li>
          <li>
            <Link className="nav__link" href="/#faq">
              Вопросы
            </Link>
          </li>
          <li>
            <Link className="nav__link nav__link--contact" href="/#contact">
              Контакты
            </Link>
          </li>
        </ul>
      </nav>
    </>
  );
}

export function NavBackdrop() {
  return (
    <div className="nav-backdrop" data-nav-backdrop aria-hidden="true" hidden />
  );
}
