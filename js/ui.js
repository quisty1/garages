// Interactive UI: FAQ accordion, mobile menu, lightbox, carousels, scroll.
import {
  CAROUSEL_NAMES,
  getFocusable,
  SELECTORS,
  setMenuBackgroundInert,
  setPageInert,
} from './shared.js';

// Scroll threshold (px) before showing the "Back to top" button.
const SCROLL_TOP_THRESHOLD = 320;

// Delay (ms) before clearing lightbox src after close; matches the CSS transition.
const LIGHTBOX_CLOSE_MS = 260;

// Breakpoint where the header switches between the drawer and desktop nav.
const MOBILE_MENU_QUERY = '(max-width: 1360px)';

// FAQ accordion: one open item, height/opacity animation.
// With prefers-reduced-motion, open instantly with no transition.
// DOM: .faq-item, .faq-item__question, .faq-item__panel
function initFaqAccordion() {
  const items = document.querySelectorAll('.faq-item');
  if (!items.length) return;

  const reducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)',
  ).matches;

  items.forEach((item) => {
    const summary = item.querySelector('.faq-item__question');
    const panel = item.querySelector('.faq-item__panel');
    if (!summary || !panel) return;

    summary.addEventListener('click', (e) => {
      e.preventDefault();
      const isOpen = item.classList.contains('is-open');

      if (isOpen) {
        if (reducedMotion) {
          item.classList.remove('is-open');
          item.removeAttribute('open');
          return;
        }
        closeFaqItem(item, panel);
        return;
      }

      // Close other open items (accordion: one at a time)
      items.forEach((other) => {
        if (other !== item && other.classList.contains('is-open')) {
          const otherPanel = other.querySelector('.faq-item__panel');
          if (!otherPanel) return;
          if (reducedMotion) {
            other.classList.remove('is-open');
            other.removeAttribute('open');
          } else {
            closeFaqItem(other, otherPanel);
          }
        }
      });

      if (reducedMotion) {
        item.classList.add('is-open');
        item.setAttribute('open', '');
        return;
      }

      openFaqItem(item, panel);
    });
  });
}

// Animated FAQ panel open (height → scrollHeight → auto).
function openFaqItem(item, panel) {
  item.classList.add('is-open');
  item.setAttribute('open', '');
  panel.style.height = '0px';
  panel.style.opacity = '0';

  requestAnimationFrame(() => {
    panel.style.height = `${panel.scrollHeight}px`;
    panel.style.opacity = '1';
  });

  const onEnd = (e) => {
    if (e.propertyName !== 'height') return;
    panel.removeEventListener('transitionend', onEnd);
    if (item.classList.contains('is-open')) {
      panel.style.height = 'auto';
    }
  };
  panel.addEventListener('transitionend', onEnd);
}

// Animated FAQ panel close.
function closeFaqItem(item, panel) {
  panel.style.height = `${panel.scrollHeight}px`;
  panel.style.opacity = '1';
  requestAnimationFrame(() => {
    panel.style.height = '0px';
    panel.style.opacity = '0';
  });

  const onEnd = (e) => {
    if (e.propertyName !== 'height') return;
    panel.removeEventListener('transitionend', onEnd);
    item.classList.remove('is-open');
    item.removeAttribute('open');
    panel.style.height = '';
    panel.style.opacity = '';
  };
  panel.addEventListener('transitionend', onEnd);
}

// Mobile menu: modal drawer semantics, focus trap, backdrop and breakpoint reset.
// DOM: [data-nav-toggle], [data-nav], [data-nav-backdrop]
function initMobileMenu() {
  const toggle = document.querySelector(SELECTORS.navToggle);
  const nav = document.querySelector(SELECTORS.nav);
  const backdrop = document.querySelector(SELECTORS.navBackdrop);
  if (!toggle || !nav) return;
  const header = toggle.closest('header');
  const mobileQuery = window.matchMedia(MOBILE_MENU_QUERY);
  let returnFocusTo = null;

  // Open/close the drawer, restore focus, and mark the rest of the page inert.
  const setOpen = (open, { restoreFocus = true } = {}) => {
    const wasOpen = nav.classList.contains('is-open');
    nav.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
    document.body.classList.toggle('menu-open', open);
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
    if (open || wasOpen) setMenuBackgroundInert(open, header, toggle, nav);

    if (open) {
      returnFocusTo = document.activeElement;
      (getFocusable(nav)[0] || toggle).focus();
    } else if (wasOpen && restoreFocus && returnFocusTo?.focus) {
      returnFocusTo.focus();
      returnFocusTo = null;
    }
  };

  toggle.addEventListener('click', () => {
    setOpen(!nav.classList.contains('is-open'));
  });
  backdrop?.addEventListener('click', () => setOpen(false));
  nav.querySelectorAll('a').forEach((a) => {
    a.addEventListener('click', () => setOpen(false));
  });
  document.addEventListener('keydown', (e) => {
    if (!nav.classList.contains('is-open')) return;
    if (e.key === 'Escape') {
      e.preventDefault();
      setOpen(false);
      return;
    }
    if (e.key === 'Tab') {
      // Keep Tab cycling inside the open drawer (toggle + nav controls).
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
  });

  // Close the drawer when crossing the desktop breakpoint; hide it on mobile.
  const syncBreakpoint = () => {
    if (!mobileQuery.matches) {
      setOpen(false, { restoreFocus: false });
      nav.removeAttribute('aria-hidden');
    } else if (!nav.classList.contains('is-open')) {
      if (nav.contains(document.activeElement)) toggle.focus();
      nav.setAttribute('aria-hidden', 'true');
    }
  };
  mobileQuery.addEventListener('change', syncBreakpoint);
  syncBreakpoint();
  document.documentElement.classList.add('js-ready');
}

// Carousel photo lightbox: click .slide__img, ←/→ navigation, Escape.
// Creates an overlay on document.body at init.
function initLightbox() {
  const overlay = document.createElement('div');
  overlay.className = 'lightbox';
  overlay.hidden = true;
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-hidden', 'true');
  overlay.setAttribute('aria-label', 'Просмотр изображения');
  overlay.setAttribute('aria-describedby', 'lightbox-caption');
  overlay.innerHTML = `
    <button class="lightbox__close" type="button" aria-label="Закрыть просмотр">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
           stroke-linecap="round" aria-hidden="true">
        <line x1="18" y1="6" x2="6" y2="18"/>
        <line x1="6" y1="6" x2="18" y2="18"/>
      </svg>
    </button>
    <button class="lightbox__nav lightbox__nav--prev" type="button" aria-label="Предыдущее фото" hidden>
      ←
    </button>
    <button class="lightbox__nav lightbox__nav--next" type="button" aria-label="Следующее фото" hidden>
      →
    </button>
    <img class="lightbox__img" alt="" />
    <div class="lightbox__caption" id="lightbox-caption" aria-live="polite"></div>
  `;
  document.body.appendChild(overlay);

  const img = overlay.querySelector('.lightbox__img');
  const caption = overlay.querySelector('.lightbox__caption');
  const closeBtn = overlay.querySelector('.lightbox__close');
  const prevBtn = overlay.querySelector('.lightbox__nav--prev');
  const nextBtn = overlay.querySelector('.lightbox__nav--next');

  let items = [];
  let currentIndex = 0;
  let opener = null;
  let closeTimer = 0;
  let isOpen = false;

  // Enable prev/next only when the gallery has more than one photo.
  function updateNav() {
    const hasMany = items.length > 1;
    prevBtn.hidden = !hasMany;
    nextBtn.hidden = !hasMany;
    prevBtn.disabled = currentIndex <= 0;
    nextBtn.disabled = currentIndex >= items.length - 1;
  }

  // Swap the displayed photo and caption for the current gallery index.
  function show(index) {
    currentIndex = Math.max(0, Math.min(items.length - 1, index));
    const item = items[currentIndex];
    img.src = item.src;
    img.alt = item.alt;
    caption.textContent =
      items.length > 1
        ? `${item.alt} · ${currentIndex + 1} / ${items.length}`
        : item.alt;
    updateNav();
  }

  // Open the overlay, trap focus, and inert the rest of the page.
  function open(galleryItems, startIndex = 0, trigger = null) {
    if (!galleryItems.length) return;
    window.clearTimeout(closeTimer);
    items = galleryItems;
    show(startIndex);
    opener = trigger || document.activeElement;
    isOpen = true;
    overlay.hidden = false;
    overlay.setAttribute('aria-hidden', 'false');
    requestAnimationFrame(() => {
      if (isOpen) overlay.classList.add('is-open');
    });
    document.body.classList.add('lightbox-open');
    setPageInert(true);
    closeBtn.focus();
  }

  // Restore focus to the opener after the close animation.
  function close() {
    if (!isOpen) return;
    isOpen = false;
    overlay.classList.remove('is-open');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('lightbox-open');
    setPageInert(false);
    const focusTarget = opener;
    opener = null;
    items = [];
    currentIndex = 0;
    // Clear src after the close animation
    closeTimer = window.setTimeout(() => {
      overlay.hidden = true;
      img.removeAttribute('src');
      img.alt = '';
      caption.textContent = '';
    }, LIGHTBOX_CLOSE_MS);
    focusTarget?.focus?.();
  }

  function step(delta) {
    if (items.length <= 1) return;
    show(currentIndex + delta);
  }

  closeBtn.addEventListener('click', close);
  prevBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    step(-1);
  });
  nextBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    step(1);
  });
  img.addEventListener('click', (e) => e.stopPropagation());
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) close();
  });
  document.addEventListener('keydown', (e) => {
    if (!isOpen) return;
    if (e.key === 'Escape') {
      e.preventDefault();
      close();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      step(-1);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      step(1);
    } else if (e.key === 'Tab') {
      // Keep Tab cycling inside the open lightbox.
      const focusable = getFocusable(overlay);
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
  });

  // Delegation: a photo click in any carousel opens the lightbox
  document.addEventListener('click', (e) => {
    const slideImg = e.target.closest('.slide__img');
    if (!slideImg) return;
    const image = slideImg.querySelector('img');
    if (!image) return;
    e.preventDefault();

    const carousel = slideImg.closest('[data-carousel]');
    const images = carousel
      ? Array.from(carousel.querySelectorAll('.slide__img img'))
      : [image];
    const startIndex = Math.max(0, images.indexOf(image));

    open(
      images.map((el) => ({ src: el.src, alt: el.alt })),
      startIndex,
      slideImg,
    );
  });
}

// Carousel: arrows scroll slides via scrollIntoView.
// DOM: [data-carousel="{name}"], [data-carousel-prev/next], .slide
function initCarousel(name) {
  const carousel = document.querySelector(SELECTORS.carousel(name));
  if (!carousel) return;
  const prevBtn = carousel.querySelector(SELECTORS.carouselPrev);
  const nextBtn = carousel.querySelector(SELECTORS.carouselNext);
  const viewport = carousel.querySelector('[data-carousel-viewport]');
  const slides = Array.from(carousel.querySelectorAll('.slide'));
  if (slides.length === 0 || !viewport) return;

  let activeIndex = 0;
  let updateFrame = 0;

  // Disable arrows at the start/end of the scroll range (2px tolerance).
  function updateControls() {
    const tolerance = 2;
    const maxScrollLeft = Math.max(
      0,
      viewport.scrollWidth - viewport.clientWidth,
    );
    if (prevBtn) prevBtn.disabled = viewport.scrollLeft <= tolerance;
    if (nextBtn) {
      nextBtn.disabled = viewport.scrollLeft >= maxScrollLeft - tolerance;
    }
  }

  // Treat the slide nearest the viewport left edge as the active index.
  function syncActiveIndex() {
    updateFrame = 0;
    const viewportLeft = viewport.getBoundingClientRect().left;
    let closestDistance = Number.POSITIVE_INFINITY;
    slides.forEach((slide, index) => {
      const distance = Math.abs(
        slide.getBoundingClientRect().left - viewportLeft,
      );
      if (distance < closestDistance) {
        closestDistance = distance;
        activeIndex = index;
      }
    });
    updateControls();
  }

  // Coalesce scroll/resize into one rAF so we do not sync on every pixel.
  function scheduleSync() {
    if (!updateFrame) updateFrame = requestAnimationFrame(syncActiveIndex);
  }

  // Scroll the chosen slide into view, respecting prefers-reduced-motion.
  function goTo(index) {
    activeIndex = Math.max(0, Math.min(slides.length - 1, index));
    slides[activeIndex].scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ? 'auto'
        : 'smooth',
      inline: 'start',
      block: 'nearest',
    });
    updateControls();
  }
  prevBtn?.addEventListener('click', () => goTo(activeIndex - 1));
  nextBtn?.addEventListener('click', () => goTo(activeIndex + 1));
  viewport.addEventListener('scroll', scheduleSync, { passive: true });
  window.addEventListener('resize', scheduleSync, { passive: true });
  updateControls();
}

// Init all carousels from CAROUSEL_NAMES.
function initCarousels() {
  CAROUSEL_NAMES.forEach(initCarousel);
}

// Fade sections in on scroll.
// DOM: .section — adds reveal / is-visible.
// Disabled with prefers-reduced-motion or without IntersectionObserver.
function initScrollReveal() {
  if (!('IntersectionObserver' in window)) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const sections = document.querySelectorAll('.section');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.07, rootMargin: '0px 0px -32px 0px' },
  );

  sections.forEach((el) => {
    const rect = el.getBoundingClientRect();
    const alreadyVisible = rect.top < window.innerHeight && rect.bottom > 0;
    if (!alreadyVisible) {
      el.classList.add('reveal');
    }
    observer.observe(el);
  });
}

// "Back to top" button: shown after scroll > SCROLL_TOP_THRESHOLD.
// DOM: .scroll-top — tabindex and aria-hidden are set dynamically.
function initScrollTop() {
  const btn = document.querySelector(SELECTORS.scrollTop);
  if (!btn) return;

  let visible = false;

  const update = () => {
    const show = window.scrollY > SCROLL_TOP_THRESHOLD;
    if (show === visible) return;
    visible = show;
    btn.classList.toggle('is-visible', show);
    btn.setAttribute('aria-hidden', show ? 'false' : 'true');
    if (show) {
      btn.removeAttribute('tabindex');
    } else {
      btn.setAttribute('tabindex', '-1');
    }
  };

  btn.setAttribute('aria-hidden', 'true');
  btn.setAttribute('tabindex', '-1');
  update();
  window.addEventListener('scroll', update, { passive: true });
}

export {
  initCarousels,
  initFaqAccordion,
  initLightbox,
  initMobileMenu,
  initScrollReveal,
  initScrollTop,
};
