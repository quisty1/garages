const company = {
  name: 'Металл Монтаж 33',
  shortName: 'ММ33',
  tagline: 'Гаражи и навесы из металла под ключ',
  phones: [
    { label: 'Алексей', value: '8 (904) 254-36-74', href: 'tel:+79042543674' },
    { label: 'Евгений', value: '8 (920) 343-47-27', href: 'tel:+79203434727' },
  ],
  email: 'MetallMontage33@yandex.ru',
  hours: 'Ежедневно 8:00–18:00',
  messengers: [
    {
      id: 'max',
      label: 'MAX',
      href: 'https://max.ru/u/f9LHodD0cOIq2YDVCLrWTqtmxuz0snFv2pGd3TIadt7A0CoRYGP8OpgDZPc',
      hint: 'Написать в MAX',
    },
  ],
  hero: {
    title: 'Металлические гаражи и навесы под ключ',
    text: 'Производим и монтируем гаражи и навесы из сэндвич-панелей и металлокаркаса. Сварочное соединение, любые размеры по вашим чертежам.',
    geo: 'Владимирская область',
    warranty: 'Гарантия качества',
  },
  garages: [
    {
      title: 'Гараж 6×4 м',
      size: '6000 × 4000 × 3600 мм',
      meta: 'Длина 6 м · Ширина 4 м · Высота 3,6 м',
      img: 'https://placehold.co/900x620/0f0f0f/ff8a1f/png?text=%D0%93%D0%B0%D1%80%D0%B0%D0%B6+6%C3%974+%D0%BC',
    },
    {
      title: 'Гараж 6×6 м',
      size: '6000 × 6000 × 3600 мм',
      meta: 'Длина 6 м · Ширина 6 м · Высота 3,6 м',
      img: 'https://placehold.co/900x620/0f0f0f/ff8a1f/png?text=%D0%93%D0%B0%D1%80%D0%B0%D0%B6+6%C3%976+%D0%BC',
    },
    {
      title: 'Гараж 8×6 м',
      size: '8000 × 6000 × 3600 мм',
      meta: 'Длина 8 м · Ширина 6 м · Высота 3,6 м',
      img: 'https://placehold.co/900x620/0f0f0f/ff8a1f/png?text=%D0%93%D0%B0%D1%80%D0%B0%D0%B6+8%C3%976+%D0%BC',
    },
    {
      title: 'Гараж 6×8 м',
      size: '6000 × 8000 × 3600 мм',
      meta: 'Длина 6 м · Ширина 8 м · Высота 3,6 м',
      img: 'https://placehold.co/900x620/0f0f0f/ff8a1f/png?text=%D0%93%D0%B0%D1%80%D0%B0%D0%B6+6%C3%978+%D0%BC',
    },
  ],
  canopies: [
    {
      title: 'Навес для авто',
      img: 'https://placehold.co/900x620/1a1a1a/ff8a1f/png?text=%D0%9D%D0%B0%D0%B2%D0%B5%D1%81+1',
    },
    {
      title: 'Навес двускатный',
      img: 'https://placehold.co/900x620/1a1a1a/ff8a1f/png?text=%D0%9D%D0%B0%D0%B2%D0%B5%D1%81+2',
    },
    {
      title: 'Навес односкатный',
      img: 'https://placehold.co/900x620/1a1a1a/ff8a1f/png?text=%D0%9D%D0%B0%D0%B2%D0%B5%D1%81+3',
    },
    {
      title: 'Навес на 2 авто',
      img: 'https://placehold.co/900x620/1a1a1a/ff8a1f/png?text=%D0%9D%D0%B0%D0%B2%D0%B5%D1%81+4',
    },
    {
      title: 'Навес для дома',
      img: 'https://placehold.co/900x620/1a1a1a/ff8a1f/png?text=%D0%9D%D0%B0%D0%B2%D0%B5%D1%81+5',
    },
  ],
  roofs: [
    {
      title: 'Двускатная',
      text: 'Классическая кровля с двумя скатами — равномерный сход осадков, увеличенная высота под потолком.',
      icon: 'gable',
    },
    {
      title: 'Скат набок',
      text: 'Односкатная кровля с уклоном в сторону — практичное решение для пристроек и узких участков.',
      icon: 'side',
    },
    {
      title: 'Скат назад',
      text: 'Уклон кровли назад — фасад остаётся высоким, осадки уходят с тыльной стороны.',
      icon: 'back',
    },
  ],
  services: [
    'Гаражи выполнены на сварочном соединении',
    'Делаем размеры по вашим чертежам',
    'Количество мест для машин — неограниченно',
    'Тип кровли: односкатная, двускатная',
    'Секционные ворота с автоматическим приводом',
    'Толщина стеновых панелей от 50 мм до 250 мм',
    'Утеплитель: минеральная вата или пенопласт',
  ],
  extras: [
    {
      title: 'Водосток',
      text: 'Организованный отвод воды с кровли — защита фасада и фундамента от подтопления.',
    },
    {
      title: 'Снегозадержание',
      text: 'Барьеры на кровле, предотвращающие лавинообразный сход снега.',
    },
    {
      title: 'Вытяжка',
      text: 'Естественная или принудительная вентиляция для комфортного микроклимата внутри.',
    },
  ],
};

/* ── Theme ───────────────────────────────────────────── */

const THEME_KEY = 'mm33-theme';

const ICON_DARK =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';

const ICON_LIGHT =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>';

function getSystemTheme() {
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

function getActiveTheme() {
  return localStorage.getItem(THEME_KEY) || getSystemTheme();
}

function applyTheme(theme) {
  const html = document.documentElement;
  html.setAttribute('data-theme', theme);
  const metaTheme = document.querySelector('meta[name="theme-color"]');
  if (metaTheme) {
    metaTheme.content = theme === 'light' ? '#f2f2f2' : '#0f0f0f';
  }
  const btn = document.querySelector('[data-theme-toggle]');
  if (btn) {
    btn.innerHTML = theme === 'dark' ? ICON_DARK : ICON_LIGHT;
    btn.setAttribute('aria-label', theme === 'dark' ? 'Включить светлую тему' : 'Включить тёмную тему');
  }
}

function initTheme() {
  applyTheme(getActiveTheme());

  const btn = document.querySelector('[data-theme-toggle]');
  if (!btn) return;

  btn.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme') || getSystemTheme();
    const next = current === 'dark' ? 'light' : 'dark';
    localStorage.setItem(THEME_KEY, next);
    applyTheme(next);
  });

  window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', () => {
    if (!localStorage.getItem(THEME_KEY)) {
      applyTheme(getSystemTheme());
    }
  });
}

/* ── Helpers ─────────────────────────────────────────── */

function $(id) {
  return document.getElementById(id);
}

function escapeHtml(str) {
  return String(str)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function renderText() {
  $('page-title').textContent = `${company.name} — гаражи и навесы под ключ`;
  $('company-name').textContent = company.name;
  $('footer-company-name').textContent = company.name;
  $('footer-company-name2').textContent = company.name;
  $('hero-title').textContent = company.hero.title;
  $('hero-text').textContent = company.hero.text;
  $('hero-geo').textContent = company.hero.geo;
  $('hero-warranty').textContent = company.hero.warranty;

  const primaryPhone = company.phones[0];
  const phoneBtn = document.querySelector('[data-phone]');
  if (phoneBtn) {
    phoneBtn.href = primaryPhone.href;
    phoneBtn.textContent = `Позвонить ${primaryPhone.value}`;
  }

  $('contact-email').textContent = company.email;
  const emailTile = $('contact-email-tile');
  if (emailTile) emailTile.href = `mailto:${company.email}`;
  $('footer-email').href = `mailto:${company.email}`;
  $('footer-email').textContent = company.email;

  const hoursEl = $('contact-hours');
  if (hoursEl) hoursEl.textContent = company.hours;
  $('footer-hours').textContent = company.hours;
  $('year').textContent = new Date().getFullYear();
}

function renderPhones() {
  const host = document.querySelector('[data-phones]');
  if (!host) return;
  host.innerHTML = company.phones
    .map(
      (p) => `
      <a class="contact-tile contact-tile--accent" href="${escapeHtml(p.href)}">
        <span class="contact-tile__label">Телефон · ${escapeHtml(
          p.label,
        )}</span>
        <span class="contact-tile__value">${escapeHtml(p.value)}</span>
      </a>
    `,
    )
    .join('');

  const footerHost = document.querySelector('[data-footer-phones]');
  if (footerHost) {
    footerHost.innerHTML = company.phones
      .map(
        (p) => `
        <li>
          ${escapeHtml(p.label)}:
          <a href="${escapeHtml(p.href)}">${escapeHtml(p.value)}</a>
        </li>
      `,
      )
      .join('');
  }
}

function renderServices() {
  const host = document.querySelector('[data-services]');
  if (!host) return;
  host.innerHTML = company.services
    .map(
      (s) => `
      <li class="service-item">
        <span class="service-item__bullet" aria-hidden="true"></span>
        <span>${escapeHtml(s)}</span>
      </li>
    `,
    )
    .join('');
}

function renderExtras() {
  const host = document.querySelector('[data-extras]');
  if (!host) return;
  host.innerHTML = company.extras
    .map(
      (e) => `
      <article class="card">
        <h3 class="card__title">${escapeHtml(e.title)}</h3>
        <p class="card__text">${escapeHtml(e.text)}</p>
      </article>
    `,
    )
    .join('');
}

function renderRoofs() {
  const host = document.querySelector('[data-roofs]');
  if (!host) return;

  const icons = {
    gable:
      '<svg viewBox="0 0 64 40" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M4 34 L32 8 L60 34" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/><line x1="4" y1="34" x2="60" y2="34" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></svg>',
    side: '<svg viewBox="0 0 64 40" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M6 12 L58 32" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/><line x1="6" y1="34" x2="58" y2="34" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></svg>',
    back: '<svg viewBox="0 0 64 40" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M58 12 L6 32" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/><line x1="6" y1="34" x2="58" y2="34" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></svg>',
  };

  host.innerHTML = company.roofs
    .map(
      (r) => `
      <article class="roof-card">
        <div class="roof-card__icon" aria-hidden="true">${
          icons[r.icon] || ''
        }</div>
        <h3 class="roof-card__title">${escapeHtml(r.title)}</h3>
        <p class="roof-card__text">${escapeHtml(r.text)}</p>
      </article>
    `,
    )
    .join('');
}

function renderGaragesCarousel() {
  const track = document.querySelector(
    '[data-carousel="garages"] [data-carousel-track]',
  );
  if (!track) return;
  track.innerHTML = company.garages
    .map(
      (p) => `
      <article class="slide">
        <div class="slide__img">
          <img src="${p.img}" alt="${escapeHtml(p.title)}" loading="lazy" />
          <span class="slide__badge">${escapeHtml(p.size)}</span>
        </div>
        <div class="slide__body">
          <h3 class="slide__title">${escapeHtml(p.title)}</h3>
          <p class="slide__meta">${escapeHtml(p.meta)}</p>
        </div>
      </article>
    `,
    )
    .join('');
}

function renderCanopiesCarousel() {
  const track = document.querySelector(
    '[data-carousel="canopies"] [data-carousel-track]',
  );
  if (!track) return;
  track.innerHTML = company.canopies
    .map(
      (p) => `
      <article class="slide slide--photo">
        <div class="slide__img slide__img--tall">
          <img src="${p.img}" alt="${escapeHtml(p.title)}" loading="lazy" />
        </div>
        <div class="slide__body">
          <h3 class="slide__title">${escapeHtml(p.title)}</h3>
        </div>
      </article>
    `,
    )
    .join('');
}

function renderMessengers() {
  const linksHtml = company.messengers
    .map(
      (m) => `
      <a
        class="messenger-link messenger-link--${escapeHtml(m.id)}"
        href="${escapeHtml(m.href)}"
        target="_blank"
        rel="noopener noreferrer"
      >
        <span class="messenger-link__label">${escapeHtml(m.label)}</span>
        <span class="messenger-link__hint">${escapeHtml(m.hint)}</span>
      </a>
    `,
    )
    .join('');

  const sectionHost = document.querySelector('[data-messengers]');
  if (sectionHost) sectionHost.innerHTML = linksHtml;

  const footerHost = document.querySelector('[data-footer-messengers]');
  if (footerHost) {
    footerHost.innerHTML = company.messengers
      .map(
        (m) => `
        <li>
          <a href="${escapeHtml(
            m.href,
          )}" target="_blank" rel="noopener noreferrer">${escapeHtml(
          m.label,
        )}</a>
        </li>
      `,
      )
      .join('');
  }
}

function initMobileMenu() {
  const toggle = document.querySelector('[data-nav-toggle]');
  const nav = document.querySelector('[data-nav]');
  const backdrop = document.querySelector('[data-nav-backdrop]');
  if (!toggle || !nav) return;

  const setOpen = (open) => {
    nav.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
    document.body.classList.toggle('menu-open', open);
    if (backdrop) {
      backdrop.classList.toggle('is-visible', open);
      backdrop.hidden = !open;
      backdrop.setAttribute('aria-hidden', String(!open));
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
    if (e.key === 'Escape' && nav.classList.contains('is-open')) {
      setOpen(false);
    }
  });
}

function initCarousel(name) {
  const carousel = document.querySelector(`[data-carousel="${name}"]`);
  if (!carousel) return;
  const prevBtn = carousel.querySelector('[data-carousel-prev]');
  const nextBtn = carousel.querySelector('[data-carousel-next]');
  const slides = Array.from(carousel.querySelectorAll('.slide'));
  if (slides.length === 0) return;

  let activeIndex = 0;
  function goTo(index) {
    activeIndex = Math.max(0, Math.min(slides.length - 1, index));
    slides[activeIndex].scrollIntoView({
      behavior: 'smooth',
      inline: 'start',
      block: 'nearest',
    });
  }
  prevBtn?.addEventListener('click', () => goTo(activeIndex - 1));
  nextBtn?.addEventListener('click', () => goTo(activeIndex + 1));
}

function init() {
  initTheme();
  renderText();
  renderPhones();
  renderServices();
  renderExtras();
  renderRoofs();
  renderGaragesCarousel();
  renderCanopiesCarousel();
  renderMessengers();
  initMobileMenu();
  initCarousel('garages');
  initCarousel('canopies');
}

document.addEventListener('DOMContentLoaded', init);
