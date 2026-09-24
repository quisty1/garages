'use client';

// Client-only page effects: progress bar, hero tilt, nav, SW.

import { useEffect } from 'react';
import { SCROLL_TOP_THRESHOLD } from '@/lib/constants';
import { initAnalytics } from '@/lib/analytics';

// Drive the header progress bar on the bar itself (0–1).
function initPageProgress() {
  let frame = 0;
  const bar = document.querySelector<HTMLElement>('.page-progress span');
  if (!bar) return () => undefined;
  const update = () => {
    frame = 0;
    const max = Math.max(
      1,
      document.documentElement.scrollHeight - window.innerHeight,
    );
    bar.style.transform = `scaleX(${Math.min(1, window.scrollY / max).toFixed(4)})`;
  };
  const schedule = () => {
    if (!frame) frame = requestAnimationFrame(update);
  };
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule, { passive: true });
  update();
  return () => {
    window.removeEventListener('scroll', schedule);
    window.removeEventListener('resize', schedule);
    if (frame) cancelAnimationFrame(frame);
    bar.style.removeProperty('transform');
  };
}

// Subtle pointer-driven tilt on blueprint cards (desktop + motion OK).
function initHeroBlueprint() {
  const cards = document.querySelectorAll<HTMLElement>('[data-hero-card]');
  const finePointer = window.matchMedia(
    '(min-width: 1121px) and (hover: hover) and (pointer: fine)',
  );
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (!cards.length || !finePointer.matches || reduced.matches) {
    return () => undefined;
  }

  const cleanups: Array<() => void> = [];
  cards.forEach((card) => {
    const image = card.querySelector<HTMLElement>('.hero-card__img img');
    if (!image) return;
    let frame = 0;
    let nextX = 0;
    let nextY = 0;
    const paint = () => {
      frame = 0;
      card.style.transform = `perspective(1100px) rotateX(${(-nextY * 3).toFixed(2)}deg) rotateY(${(nextX * 3.5).toFixed(2)}deg)`;
      image.style.transform = `translate3d(${(-nextX * 8).toFixed(2)}px, ${(-nextY * 7).toFixed(2)}px, 0) scale(1.01)`;
    };
    const reset = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      card.style.removeProperty('transform');
      image.style.removeProperty('transform');
    };
    const onMove = (event: PointerEvent) => {
      if (!finePointer.matches || reduced.matches) return;
      const rect = card.getBoundingClientRect();
      nextX = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      nextY = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
      if (!frame) frame = requestAnimationFrame(paint);
    };
    const onLeave = () => {
      if (!finePointer.matches || reduced.matches) {
        reset();
        return;
      }
      nextX = 0;
      nextY = 0;
      if (!frame) frame = requestAnimationFrame(paint);
    };
    card.addEventListener('pointermove', onMove);
    card.addEventListener('pointerleave', onLeave);
    finePointer.addEventListener('change', reset);
    reduced.addEventListener('change', reset);
    cleanups.push(() => {
      card.removeEventListener('pointermove', onMove);
      card.removeEventListener('pointerleave', onLeave);
      finePointer.removeEventListener('change', reset);
      reduced.removeEventListener('change', reset);
      reset();
    });
  });
  return () => cleanups.forEach((fn) => fn());
}

// Highlight the nav link whose section is currently under the sticky header.
function initActiveNavigation() {
  const links = [
    ...document.querySelectorAll<HTMLAnchorElement>('#site-nav a'),
  ].filter((link) => Boolean(link.hash));
  const targets = links
    .map((link) => ({
      link,
      section: document.getElementById(link.hash.slice(1)),
    }))
    .filter(({ section }) => section);
  let pending = false;
  function update() {
    pending = false;
    const scrollPadding =
      parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) ||
      0;
    let active: (typeof targets)[number] | null = null;
    targets.forEach((item) => {
      const margin =
        parseFloat(getComputedStyle(item.section!).scrollMarginTop) || 0;
      if (
        item.section!.getBoundingClientRect().top <=
        scrollPadding + margin + 24
      ) {
        active = item;
      }
    });
    targets.forEach(({ link }) => {
      if (link === active?.link) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }
  function schedule() {
    if (pending) return;
    pending = true;
    requestAnimationFrame(update);
  }
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);
  update();
  return () => {
    window.removeEventListener('scroll', schedule);
    window.removeEventListener('resize', schedule);
  };
}

function initScrollTop() {
  const btn = document.querySelector<HTMLElement>('.scroll-top');
  if (!btn) return () => undefined;
  let visible = false;
  const update = () => {
    const show = window.scrollY > SCROLL_TOP_THRESHOLD;
    if (show === visible) return;
    visible = show;
    btn.classList.toggle('is-visible', show);
    btn.setAttribute('aria-hidden', show ? 'false' : 'true');
    if (show) btn.removeAttribute('tabindex');
    else btn.setAttribute('tabindex', '-1');
  };
  btn.setAttribute('aria-hidden', 'true');
  btn.setAttribute('tabindex', '-1');
  update();
  window.addEventListener('scroll', update, { passive: true });
  return () => window.removeEventListener('scroll', update);
}

// Production-only SW; re-check for updates when the tab becomes visible.
function registerServiceWorker() {
  if (
    process.env.NODE_ENV !== 'production' ||
    !('serviceWorker' in navigator)
  ) {
    return () => undefined;
  }

  let disposed = false;
  let registration: ServiceWorkerRegistration | null = null;
  const checkForUpdate = () => {
    registration?.update().catch((error) => {
      console.warn('[MM33] Service Worker update check failed.', error);
    });
  };
  const onVisibilityChange = () => {
    if (document.visibilityState === 'visible') checkForUpdate();
  };

  navigator.serviceWorker
    .register('/sw.js')
    .then((nextRegistration) => {
      if (disposed) return;
      registration = nextRegistration;
      checkForUpdate();
      document.addEventListener('visibilitychange', onVisibilityChange);
    })
    .catch((error) => {
      if (disposed) return;
      console.warn('[MM33] Service Worker registration failed.', error);
    });

  return () => {
    disposed = true;
    document.removeEventListener('visibilitychange', onVisibilityChange);
  };
}

export function ClientEffects() {
  useEffect(() => {
    document.documentElement.classList.add('js');
    const cleanups = [
      initPageProgress(),
      initHeroBlueprint(),
      initActiveNavigation(),
      initScrollTop(),
    ];
    cleanups.push(initAnalytics(), registerServiceWorker());
    return () => cleanups.forEach((fn) => fn());
  }, []);

  return null;
}

export function ScrollTopButton() {
  return (
    <a className="scroll-top" href="#top" aria-label="Наверх">
      ↑
    </a>
  );
}
