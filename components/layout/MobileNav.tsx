'use client';

// Mobile drawer nav: open/close, focus trap, inert background, breakpoint sync.

import { useCallback, useEffect, useRef } from 'react';
import { MOBILE_MENU_QUERY } from '@/lib/constants';
import { getFocusable, setMenuBackgroundInert } from '@/lib/focus';

export function MobileNavControls() {
  const toggleRef = useRef<HTMLButtonElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);

  const setOpen = useCallback((open: boolean, { restoreFocus = true } = {}) => {
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
  }, []);

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
      // Close after in-page hash navigation.
      if ((e.target as Element).closest('a')) setOpen(false);
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (!nav.classList.contains('is-open')) return;
      if (e.key === 'Escape') {
        e.preventDefault();
        setOpen(false);
        return;
      }
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
    };
  }, [setOpen]);

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
          <li>
            <a className="nav__link" href="#garages">
              Гаражи
            </a>
          </li>
          <li>
            <a className="nav__link" href="#canopies">
              Навесы
            </a>
          </li>
          <li>
            <a className="nav__link" href="#garage-projects">
              Наши работы
            </a>
          </li>
          <li>
            <a className="nav__link" href="#services">
              Услуги
            </a>
          </li>
          <li>
            <a className="nav__link" href="#workflow">
              Этапы
            </a>
          </li>
          <li>
            <a className="nav__link" href="#faq">
              Вопросы
            </a>
          </li>
          <li>
            <a className="nav__link nav__link--contact" href="#contact">
              Контакты
            </a>
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
