// Yandex Metrika loader, host allowlist, and conversion click tracking.

import { analyticsConfig } from './analytics-config';
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

let metrikaInitialized = false;
let clickListenerBound = false;

function getConfig() {
  return analyticsConfig.yandexMetrika;
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

function trackPageView(counterId: number): void {
  if (typeof window.ym !== 'function') return;
  window.ym(counterId, 'hit', window.location.href, {
    title: document.title,
  });
}

function getLinkPlacement(link: Element): string {
  if (link.closest('.site-header')) return 'header';
  if (link.closest('.hero')) return 'hero';
  if (link.closest('.site-footer')) return 'footer';
  if (link.closest('#contact')) return 'contact';
  return 'content';
}

// Explicit data-analytics-goal, or tel/mailto link schemes.
function trackConversionClick(event: MouseEvent): void {
  if (!(event.target instanceof Element)) return;
  const element = event.target.closest('a, button');
  if (!element) return;

  const htmlElement = element as HTMLElement;
  const explicitGoal = htmlElement.dataset.analyticsGoal;
  if (explicitGoal) {
    const placement = getLinkPlacement(element);
    const label = htmlElement.dataset.analyticsLabel;
    const params: Record<string, unknown> = { placement };
    if (explicitGoal === GOAL.messenger_click) {
      params.messenger = label || 'unknown';
    } else if (label) {
      params.label = label;
    }
    sendGoal(explicitGoal, params);
    return;
  }

  const href = element.getAttribute('href') || '';
  if (href.startsWith('tel:')) {
    sendGoal(GOAL.phone_click, { placement: getLinkPlacement(element) });
  } else if (href.startsWith('mailto:')) {
    sendGoal(GOAL.email_click, { placement: getLinkPlacement(element) });
  }
}

export function initAnalytics(): () => void {
  // Skip tracking on hosts outside the analytics-config allowlist.
  const counterId = getCounterId();
  if (!counterId || !isAllowedHost()) return () => undefined;

  createMetrikaQueue();
  loadMetrikaScript();

  if (!metrikaInitialized) {
    window.ym?.(counterId, 'init', {
      clickmap: true,
      trackLinks: true,
      accurateTrackBounce: true,
      webvisor: false,
    });
    metrikaInitialized = true;
  } else {
    // SPA navigations remount ClientEffects; send a virtual pageview.
    trackPageView(counterId);
  }

  // Capture phase so we still see clicks stopped by other handlers.
  // Keep the listener for the document lifetime across SPA page mounts.
  if (!clickListenerBound) {
    document.addEventListener('click', trackConversionClick, { capture: true });
    clickListenerBound = true;
  }

  return () => undefined;
}
