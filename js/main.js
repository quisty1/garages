// Entry: add the .js class, then init theme, content, UI, and the Service Worker.
import { company } from './shared.js';
import { initTheme } from './theme.js';
import {
  renderAdvantages,
  renderCarousels,
  renderExtras,
  renderFaq,
  renderMessengers,
  renderPhones,
  renderPriceFactors,
  renderRoofs,
  renderServices,
  renderText,
  renderWorkflow,
} from './content.js';
import { renderSEO } from './seo.js';
import {
  initCarousels,
  initFaqAccordion,
  initLightbox,
  initMobileMenu,
  initScrollReveal,
  initScrollTop,
} from './ui.js';
import { registerServiceWorker } from './pwa.js';

// CSS switches to interactive drawer rules only after this script executes.
document.documentElement.classList.add('js');

// Isolate a failed init step so the rest of the page can still start.
function runInitStep(label, callback) {
  try {
    callback();
  } catch (error) {
    console.error(`[MM33] Не удалось инициализировать: ${label}.`, error);
  }
}

// Entry point. Call order matters:
// 1. Theme — before interactive paint (toggle icon).
// 2. Content and SEO render — fill the DOM before binding handlers.
// 3. FAQ accordion — after renderFaq() (or on the HTML fallback).
// 4. Carousels and lightbox — after renderCarousels() (slides in the DOM).
// 5. Scroll reveal / scroll-top — independent of content.
// 6. Service Worker — last, does not block the UI.
function init() {
  runInitStep('тему', initTheme);

  if (company) {
    [
      ['основной текст', renderText],
      ['метаданные', renderSEO],
      ['телефоны', renderPhones],
      ['услуги', renderServices],
      ['преимущества', renderAdvantages],
      ['дополнительные услуги', renderExtras],
      ['факторы цены', renderPriceFactors],
      ['этапы работы', renderWorkflow],
      ['FAQ', renderFaq],
      ['виды кровли', renderRoofs],
      ['галереи', renderCarousels],
      ['мессенджеры', renderMessengers],
    ].forEach(([label, callback]) => runInitStep(label, callback));
  } else {
    console.error(
      '[MM33] site-data.js не загрузился; используется HTML fallback.',
    );
  }

  [
    ['FAQ', initFaqAccordion],
    ['мобильное меню', initMobileMenu],
    ['карусели', initCarousels],
    ['просмотр изображений', initLightbox],
    ['анимацию секций', initScrollReveal],
    ['кнопку прокрутки', initScrollTop],
    ['Service Worker', registerServiceWorker],
  ].forEach(([label, callback]) => runInitStep(label, callback));
}

document.addEventListener('DOMContentLoaded', init);
