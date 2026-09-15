// Yandex Metrica: counter bootstrap and delegated conversion goals.
import { company } from './shared.js';

const METRIKA_SCRIPT_URL = 'https://mc.yandex.ru/metrika/tag.js';

function getConfig() {
  return company?.analytics?.yandexMetrika || null;
}

function getCounterId() {
  const counterId = Number(getConfig()?.counterId);
  return Number.isSafeInteger(counterId) && counterId > 0 ? counterId : null;
}

function isAllowedHost() {
  const allowedHosts = getConfig()?.allowedHosts;
  return (
    !Array.isArray(allowedHosts) ||
    allowedHosts.length === 0 ||
    allowedHosts.includes(window.location.hostname)
  );
}

function createMetrikaQueue() {
  if (typeof window.ym === 'function') return;

  window.ym = function queueMetrikaCall(...args) {
    window.ym.a = window.ym.a || [];
    window.ym.a.push(args);
  };
  window.ym.l = Date.now();
}

function loadMetrikaScript() {
  if (document.querySelector(`script[src="${METRIKA_SCRIPT_URL}"]`)) return;

  const script = document.createElement('script');
  script.async = true;
  script.src = METRIKA_SCRIPT_URL;
  document.head.append(script);
}

function sendGoal(goal, params = {}) {
  const counterId = getCounterId();
  if (!counterId || typeof window.ym !== 'function') return;

  window.ym(counterId, 'reachGoal', goal, params);
}

function getLinkPlacement(link) {
  if (link.closest('.site-header')) return 'header';
  if (link.closest('.hero')) return 'hero';
  if (link.closest('.site-footer')) return 'footer';
  if (link.closest('#contact')) return 'contact';
  return 'content';
}

function trackConversionClick(event) {
  if (!(event.target instanceof Element)) return;
  const element = event.target.closest('a, button');
  if (!element) return;

  const explicitGoal = element.dataset.analyticsGoal;
  if (explicitGoal) {
    sendGoal(explicitGoal, {
      label: element.dataset.analyticsLabel || element.textContent.trim(),
    });
    return;
  }

  if (element.matches('[data-cta]')) {
    sendGoal('cta_calculate', { placement: getLinkPlacement(element) });
    return;
  }

  const href = element.getAttribute('href') || '';
  if (href.startsWith('tel:')) {
    sendGoal('phone_click', { placement: getLinkPlacement(element) });
  } else if (href.startsWith('mailto:')) {
    sendGoal('email_click', { placement: getLinkPlacement(element) });
  } else if (element.matches('.messenger-link')) {
    sendGoal('messenger_click', {
      placement: getLinkPlacement(element),
      messenger:
        element.querySelector('.messenger-link__label')?.textContent.trim() ||
        'unknown',
    });
  } else if (element.matches('#contact-address-tile, #footer-address-link')) {
    sendGoal('map_click', { placement: getLinkPlacement(element) });
  }
}

function initAnalytics() {
  const counterId = getCounterId();
  if (!counterId || !isAllowedHost()) return;

  createMetrikaQueue();
  loadMetrikaScript();
  window.ym(counterId, 'init', {
    clickmap: true,
    trackLinks: true,
    accurateTrackBounce: true,
    webvisor: false,
  });

  document.addEventListener('click', trackConversionClick, { capture: true });
}

export { initAnalytics, sendGoal };
