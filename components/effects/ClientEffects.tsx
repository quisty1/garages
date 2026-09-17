'use client';

// Client-only page effects: progress bar, hero tilt, scroll reveal, nav, SW.

import { useEffect } from 'react';
import { SCROLL_TOP_THRESHOLD } from '@/lib/constants';
import { initAnalytics } from '@/lib/analytics';

// Drive the header progress bar via --page-progress (0–1).
function initPageProgress() {
  let frame = 0;
  const update = () => {
    frame = 0;
    const max = Math.max(
      1,
      document.documentElement.scrollHeight - window.innerHeight,
    );
    document.documentElement.style.setProperty(
      '--page-progress',
      Math.min(1, window.scrollY / max).toFixed(4),
    );
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
  };
}

// Subtle pointer-driven tilt on blueprint cards (desktop + motion OK).
function initHeroBlueprint() {
  const cards = document.querySelectorAll<HTMLElement>('[data-hero-card]');
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (!cards.length || !finePointer.matches || reduced.matches) {
    return () => undefined;
  }

  const cleanups: Array<() => void> = [];
  cards.forEach((card) => {
    let frame = 0;
    let nextX = 0;
    let nextY = 0;
    const paint = () => {
      frame = 0;
      card.style.setProperty('--hero-ry', `${(nextX * 3.5).toFixed(2)}deg`);
      card.style.setProperty('--hero-rx', `${(-nextY * 3).toFixed(2)}deg`);
      card.style.setProperty('--hero-shift-x', `${(-nextX * 8).toFixed(2)}px`);
      card.style.setProperty('--hero-shift-y', `${(-nextY * 7).toFixed(2)}px`);
    };
    const onMove = (event: PointerEvent) => {
      const rect = card.getBoundingClientRect();
      nextX = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      nextY = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
      if (!frame) frame = requestAnimationFrame(paint);
    };
    const onLeave = () => {
      nextX = 0;
      nextY = 0;
      if (!frame) frame = requestAnimationFrame(paint);
    };
    card.addEventListener('pointermove', onMove);
    card.addEventListener('pointerleave', onLeave);
    cleanups.push(() => {
      card.removeEventListener('pointermove', onMove);
      card.removeEventListener('pointerleave', onLeave);
      if (frame) cancelAnimationFrame(frame);
    });
  });
  return () => cleanups.forEach((fn) => fn());
}

// Staggered fade-up for section blocks below the fold; skip if reduced motion.
function initScrollReveal() {
  if (!('IntersectionObserver' in window)) return () => undefined;
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (motion.matches || !Element.prototype.animate) return () => undefined;

  const running = new Set<Animation>();
  const pending = new Set<Element>();
  const observer = new IntersectionObserver(
    (entries) => {
      // Stagger siblings within the same parent (cap delay at 3 steps).
      const groups = new Map<Element | null, number>();
      entries.forEach(({ target, isIntersecting }) => {
        if (!isIntersecting || !pending.has(target)) return;
        observer.unobserve(target);
        pending.delete(target);
        target.classList.remove('scroll-reveal-pending');
        if (motion.matches || !target.animate) return;
        const index = groups.get(target.parentElement) || 0;
        groups.set(target.parentElement, index + 1);
        const animation = target.animate(
          [
            { opacity: 0, transform: 'translateY(64px)' },
            { opacity: 1, transform: 'translateY(0)' },
          ],
          {
            duration: 1100,
            delay: Math.min(index, 3) * 140,
            easing: 'cubic-bezier(.2,.55,.25,1)',
            fill: 'backwards',
          },
        );
        running.add(animation);
        animation.finished
          .catch(() => undefined)
          .finally(() => running.delete(animation));
      });
    },
    {
      threshold: 0,
      rootMargin: `0px 0px -${Math.min(120, Math.round(window.innerHeight * 0.15))}px 0px`,
    },
  );

  document
    .querySelectorAll(
      '.section__head, .carousel, .project, .workflow-step, .composition-card, .card, .stat-card, .roof-card, .factor-cell, .faq-item, .contacts-panel',
    )
    .forEach((el) => {
      if (el.getBoundingClientRect().top >= window.innerHeight) {
        observer.observe(el);
        pending.add(el);
        el.classList.add('scroll-reveal-pending');
      }
    });

  // Keyboard users should not wait for the reveal animation to start.
  const onFocusIn = (event: FocusEvent) => {
    const target = (event.target as Element | null)?.closest(
      '.scroll-reveal-pending',
    );
    if (!target) return;
    target.classList.remove('scroll-reveal-pending');
    pending.delete(target);
    observer.unobserve(target);
  };
  document.addEventListener('focusin', onFocusIn);

  const onMotion = () => {
    if (!motion.matches) return;
    running.forEach((animation) => animation.cancel());
    pending.forEach((el) => el.classList.remove('scroll-reveal-pending'));
    pending.clear();
    observer.disconnect();
  };
  motion.addEventListener('change', onMotion);

  return () => {
    document.removeEventListener('focusin', onFocusIn);
    motion.removeEventListener('change', onMotion);
    observer.disconnect();
  };
}

// Highlight the nav link whose section is currently under the sticky header.
function initActiveNavigation() {
  const links = [
    ...document.querySelectorAll<HTMLAnchorElement>('#site-nav a[href^="#"]'),
  ];
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
      initScrollReveal(),
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
