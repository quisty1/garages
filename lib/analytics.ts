// Yandex Metrika loader, host allowlist, and conversion click tracking.

import { company } from './site-data';
import type { AnalyticsGoal } from './constants';
import { GOAL } from './constants';

export const METRIKA_SCRIPT_URL = 'https://mc.yandex.ru/metrika/tag.js';

export { GOAL };

declare global {
  interface Window {
    ym?: ((...args: unknown[]) => void) & {
      a?: unknown[][];
      l?: number;
    };
  }
}

function getConfig() {
  return company.analytics.yandexMetrika;
}

export function getCounterId(): number | null {
  const counterId = Number(getConfig()?.counterId);
  return Number.isSafeInteger(counterId) && counterId > 0 ? counterId : null;
}

// Empty allowlist means track on every hostname (useful for local debugging).
export function isAllowedHost(
  hostname = typeof window !== 'undefined' ? window.location.hostname : '',
): boolean {
  const allowedHosts = getConfig()?.allowedHosts as string[] | undefined;
  return (
    !Array.isArray(allowedHosts) ||
    allowedHosts.length === 0 ||
    allowedHosts.includes(hostname)
  );
}

// Queue Metrika calls until the remote tag.js script loads.
function createMetrikaQueue(): void {
  if (typeof window.ym === 'function') return;

  window.ym = function queueMetrikaCall(...args: unknown[]) {
    window.ym!.a = window.ym!.a || [];
    window.ym!.a.push(args);
  };
  window.ym.l = Date.now();
}

function loadMetrikaScript(): void {
  if (document.querySelector(`script[src="${METRIKA_SCRIPT_URL}"]`)) return;

  const script = document.createElement('script');
  script.async = true;
  script.src = METRIKA_SCRIPT_URL;
  document.head.append(script);
}

export function sendGoal(
  goal: AnalyticsGoal | string,
  params: Record<string, unknown> = {},
): void {
  const counterId = getCounterId();
  if (!counterId || typeof window.ym !== 'function') return;
  window.ym(counterId, 'reachGoal', goal, params);
}

function getLinkPlacement(link: Element): string {
  if (link.closest('.site-header')) return 'header';
  if (link.closest('.hero')) return 'hero';
  if (link.closest('.site-footer')) return 'footer';
  if (link.closest('#contact')) return 'contact';
  return 'content';
}

// Infer goal from data attributes or link type (tel / mailto / messengers / map).
function trackConversionClick(event: MouseEvent): void {
  if (!(event.target instanceof Element)) return;
  const element = event.target.closest('a, button');
  if (!element) return;

  const htmlElement = element as HTMLElement;
  const explicitGoal = htmlElement.dataset.analyticsGoal;
  if (explicitGoal) {
    sendGoal(explicitGoal, {
      label:
        htmlElement.dataset.analyticsLabel || element.textContent?.trim() || '',
    });
    return;
  }

  if (element.matches('[data-cta]')) {
    sendGoal(GOAL.cta_calculate, { placement: getLinkPlacement(element) });
    return;
  }

  const href = element.getAttribute('href') || '';
  if (href.startsWith('tel:')) {
    sendGoal(GOAL.phone_click, { placement: getLinkPlacement(element) });
  } else if (href.startsWith('mailto:')) {
    sendGoal(GOAL.email_click, { placement: getLinkPlacement(element) });
  } else if (element.matches('.messenger-link')) {
    sendGoal(GOAL.messenger_click, {
      placement: getLinkPlacement(element),
      messenger:
        element.querySelector('.messenger-link__label')?.textContent?.trim() ||
        'unknown',
    });
  } else if (element.matches('#contact-address-tile, #footer-address-link')) {
    sendGoal(GOAL.map_click, { placement: getLinkPlacement(element) });
  }
}

export function initAnalytics(): () => void {
  // Skip tracking on hosts outside the site-data allowlist.
  const counterId = getCounterId();
  if (!counterId || !isAllowedHost()) return () => undefined;

  createMetrikaQueue();
  loadMetrikaScript();
  window.ym?.(counterId, 'init', {
    clickmap: true,
    trackLinks: true,
    accurateTrackBounce: true,
    webvisor: false,
  });

  // Capture phase so we still see clicks stopped by other handlers.
  document.addEventListener('click', trackConversionClick, { capture: true });
  return () => {
    document.removeEventListener('click', trackConversionClick, {
      capture: true,
    });
  };
}
