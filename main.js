/* ── Данные ──────────────────────────────────────────── */

/**
 * Единый источник контента сайта.
 * Тексты, телефоны, цены и URL редактируются здесь; HTML — заготовки с fallback.
 */
const company = {
  name: 'Металл Монтаж 33',
  shortName: 'ММ33', // Для PWA short_name в manifest.json
  tagline: 'Гаражи и навесы из металла под ключ',
  seo: {
    siteUrl: 'https://metallmontage33.ru', // Канонический домен (без /)
    title:
      'Гаражи и навесы под ключ — Владимирская, Московская, Нижегородская и Ивановская области | Металл Монтаж 33',
    description:
      'Металлические гаражи и навесы под ключ во Владимирской, Московской, Нижегородской и Ивановской областях. Сварной каркас, сэндвич-панели, выезд на замер. От 6 000 ₽.',
    keywords:
      'металлические гаражи под ключ, гараж из сэндвич-панелей, навесы для авто, металлический навес, монтаж металлоконструкций, гаражи Владимир, гаражи Москва, гаражи Нижний Новгород, навесы Московская область, гаражи Иваново, производство гаражей, гараж под ключ цена',
    region: 'RU-VLA, RU-MOW, RU-MOS, RU-NIZ, RU-IVA', // Коды регионов для geo.region
    ogImageWidth: 1200,
    ogImageHeight: 800,
    serviceArea: {
      regions: [
        { name: 'Москва' },
        {
          name: 'Владимирская область',
          cities: [
            'Владимир',
            'Ковров',
            'Муром',
            'Александров',
            'Гусь-Хрустальный',
            'Киржач',
            'Кольчугино',
            'Вязники',
            'Радужный',
            'Собинка',
            'Меленки',
            'Петушки',
            'Камешково',
            'Юрьев-Польский',
            'Суздаль',
            'Гороховец',
            'Лакинск',
            'Струнино',
            'Покров',
            'Костерёво',
            'Судогда',
          ],
        },
        { name: 'Московская область' },
        {
          name: 'Нижегородская область',
          cities: [
            'Нижний Новгород',
            'Арзамас',
            'Ворсма',
            'Дзержинск',
            'Кстово',
            'Кулебаки',
            'Лукоянов',
            'Сергач',
            'Городец',
            'Клявлино',
            'Балахна',
          ],
        },
        {
          name: 'Ивановская область',
          cities: [
            'Иваново',
            'Кинешма',
            'Шуя',
            'Плес',
            'Фурманов',
            'Южа',
            'Заволжье',
            'Пестяки',
          ],
        },
      ],
    },
    ogImage: './assets/logo-og.webp', // OG, Twitter, JSON-LD
  },
  phones: [
    { value: '+7 (904) 254-36-74', href: 'tel:+79042543674' },
    { value: '+7 (920) 343-47-27', href: 'tel:+79203434727' },
  ],
  email: 'MetallMontage33@yandex.ru',
  hours: 'Ежедневно 8:00–18:00',
  messengers: [
    {
      id: 'max', // CSS-модификатор messenger-link--{id}
      label: 'MAX',
      href: 'https://max.ru/u/f9LHodD0cOIq2YDVCLrWTqtmxuz0snFv2pGd3TIadt7A0CoRYGP8OpgDZPc',
      hint: 'Написать в MAX',
    },
  ],
  hero: {
    title: 'Металлические гаражи и навесы под ключ',
    text: 'Производим и монтируем гаражи и навесы из сэндвич-панелей и металлокаркаса. Сварочное соединение, любые размеры по вашим чертежам.',
    sizes: { value: 'Любые', detail: 'по вашим чертежам' },
    geo: [
      'Москва',
      'Московская',
      'Нижегородская',
      'Владимирская',
      'Ивановская',
    ],
    warranty: { value: '3 года', detail: 'на все работы' },
  },
  workflow: {
    title: 'Как мы работаем',
    text: 'От заявки до сдачи объекта — прозрачный процесс без лишних этапов.',
    steps: [
      {
        title: 'Заявка',
        text: 'Оставляете заявку или звоните — обсуждаем задачу и пожелания.',
      },
      {
        title: 'Замер',
        text: 'Выезжаем на участок, замеряем площадку и уточняем детали.',
      },
      {
        title: 'Чертеж',
        text: 'Готовим проект и согласовываем размеры, кровлю и комплектацию.',
      },
      {
        title: 'Производство',
        text: 'Изготавливаем конструкцию на производстве по согласованному проекту.',
      },
      {
        title: 'Доставка',
        text: 'Доставляем готовый комплект на ваш участок.',
      },
      {
        title: 'Монтаж',
        text: 'Собираем и устанавливаем гараж или навес на месте.',
      },
      {
        title: 'Сдача объекта',
        text: 'Принимаете готовый объект — всё готово к использованию.',
      },
    ],
  },
  faq: [
    {
      q: 'Сколько стоит гараж?',
      a: 'Гараж — от 22 000 ₽. Точная цена определяется после замера на участке.',
    },
    {
      q: 'Сколько стоит навес?',
      a: 'Навес — от 6 000 ₽. Точная цена определяется после замера на участке.',
    },
    {
      q: 'От чего зависит стоимость фундамента?',
      a: 'Работа зависит от ваших предпочтений: бетонная плита или сваи.',
    },
    {
      q: 'Как быстро вы выполняете работу?',
      a: 'Мы выполняем работу в кратчайшие сроки — сроки согласуем после замера и утверждения проекта.',
    },
    {
      q: 'Какая гарантия на работу?',
      a: 'Гарантия 3 года.',
    },
    {
      q: 'Можно ли заказать нестандартный размер?',
      a: 'Да. Делаем гаражи и навесы по вашим чертежам — любые размеры, форма кровли и количество машино-мест.',
    },
    {
      q: 'В каком регионе вы работаете?',
      a: 'Работаем во Владимирской, Московской, Нижегородской и Ивановской областях, в Москве и по всем городам в этих регионах.',
    },
    {
      q: 'Из каких материалов делаются конструкции?',
      a: 'Каркас из металла со сварочным соединением, стены из сэндвич-панелей толщиной от 50 до 250 мм. Утеплитель — минеральная вата или пенопласт.',
    },
    {
      q: 'Нужно ли готовить участок до монтажа?',
      a: 'Зависит от типа фундамента. На замере подскажем, что нужно подготовить: площадку под плиту или точки под сваи.',
    },
    {
      q: 'Как оформить заявку?',
      a: 'Позвоните по телефону, напишите на email или в мессенджер MAX — бесплатно проконсультируем и поможем с расчётом.',
    },
  ],
  garages: [
    {
      title: 'Гараж 6×4 м',
      size: '6000 × 4000 × 3600 мм',
      meta: 'Длина 6 м · Ширина 4 м · Высота 3,6 м',
      img: './assets/garage-6x4.webp',
    },
    {
      title: 'Гараж 6×6 м',
      size: '6000 × 6000 × 3600 мм',
      meta: 'Длина 6 м · Ширина 6 м · Высота 3,6 м',
      img: './assets/garage-6x6.webp',
    },
    {
      title: 'Гараж 8×6 м',
      size: '8000 × 6000 × 3600 мм',
      meta: 'Длина 8 м · Ширина 6 м · Высота 3,6 м',
      img: './assets/garage-8x6.webp',
    },
    {
      title: 'Гараж 6×8 м',
      size: '6000 × 8000 × 3600 мм',
      meta: 'Длина 6 м · Ширина 8 м · Высота 3,6 м',
      img: './assets/garage-6x8.webp',
    },
  ],
  canopies: [
    {
      title: 'Навес для авто',
      img: './assets/canopy-car.webp',
    },
    {
      title: 'Навес двускатный',
      img: './assets/canopy-gable.webp',
    },
    {
      title: 'Навес односкатный',
      img: './assets/canopy-single-slope.webp',
    },
    {
      title: 'Навес на 2 авто',
      img: './assets/canopy-two-cars.webp',
    },
    {
      title: 'Навес для дома',
      img: './assets/canopy-house.webp',
    },
  ],
  roofs: [
    {
      title: 'Двускатная',
      text: 'Классическая кровля с двумя скатами — равномерный сход осадков, увеличенная высота под потолком.',
      icon: 'gable', // Ключ в ROOF_ICONS
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

/* ── Константы ───────────────────────────────────────── */

/** Ключ localStorage для сохранения выбранной темы (синхронизирован с inline-скриптом в index.html). */
const THEME_KEY = 'mm33-theme';

/** Цвета meta theme-color для светлой и тёмной темы. */
const THEME_COLORS = {
  light: '#f4efe6',
  dark: '#111418',
};

/** Порог прокрутки (px) для показа кнопки «Наверх». */
const SCROLL_TOP_THRESHOLD = 320;

/** Задержка очистки src в lightbox после закрытия (мс), совпадает с CSS transition. */
const LIGHTBOX_CLOSE_MS = 260;

/** Имена каруселей — значения data-carousel и аргументы initCarousel(). */
const CAROUSEL_NAMES = ['garages', 'canopies'];

/** Селекторы data-атрибутов, используемых в разметке и JS. */
const SELECTORS = {
  themeToggle: '[data-theme-toggle]',
  phone: '[data-phone]',
  phones: '[data-phones]',
  footerPhones: '[data-footer-phones]',
  services: '[data-services]',
  extras: '[data-extras]',
  roofs: '[data-roofs]',
  workflow: '[data-workflow]',
  faq: '[data-faq]',
  messengers: '[data-messengers]',
  footerMessengers: '[data-footer-messengers]',
  navToggle: '[data-nav-toggle]',
  nav: '[data-nav]',
  navBackdrop: '[data-nav-backdrop]',
  carousel: (name) => `[data-carousel="${name}"]`,
  carouselTrack: '[data-carousel-track]',
  carouselPrev: '[data-carousel-prev]',
  carouselNext: '[data-carousel-next]',
  scrollTop: '.scroll-top',
};

/** SVG-иконка луны (показывается в тёмной теме — переключить на светлую). */
const ICON_DARK =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';

/** SVG-иконка солнца (показывается в светлой теме — переключить на тёмную). */
const ICON_LIGHT =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>';

/** SVG-иконки типов кровли для карточек [data-roofs]. */
const ROOF_ICONS = {
  gable:
    '<svg viewBox="0 0 64 40" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M4 34 L32 8 L60 34" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/><line x1="4" y1="34" x2="60" y2="34" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></svg>',
  side: '<svg viewBox="0 0 64 40" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M6 12 L58 32" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/><line x1="6" y1="34" x2="58" y2="34" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></svg>',
  back: '<svg viewBox="0 0 64 40" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M58 12 L6 32" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/><line x1="6" y1="34" x2="58" y2="34" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></svg>',
};

/* ── Утилиты ─────────────────────────────────────────── */

/** Сокращение для document.getElementById. */
function $(id) {
  return document.getElementById(id);
}

/** Безопасная установка textContent по id (если элемент отсутствует — пропуск). */
function setTextById(id, text) {
  const el = $(id);
  if (el) el.textContent = text;
}

/** Экранирование строк для безопасной вставки в innerHTML. */
function escapeHtml(str) {
  return String(str)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

/**
 * Атрибуты <img> для слайдов карусели: srcset с превью -560.webp.
 * Превью генерируется заменой суффикса .webp → -560.webp (см. assets/).
 * @param {string} img — путь к полноразмерному webp
 */
function carouselImgAttrs(img) {
  const small = img.replace(/\.webp$/, '-560.webp');
  return `src="${escapeHtml(img)}" srcset="${escapeHtml(small)} 560w, ${escapeHtml(img)} 680w" sizes="(max-width: 720px) 82vw, (max-width: 980px) 48vw, 520px" width="680" height="453" loading="lazy" decoding="async"`;
}

/** SEO alt для фото гаражей и навесов в каруселях. */
function seoImageAlt(title, kind) {
  const lower = title.toLowerCase();
  if (kind === 'garage') {
    return `Металлический ${lower} из сэндвич-панелей на сварном каркасе — Металл Монтаж 33`;
  }
  return `Металлический ${lower} под ключ — Металл Монтаж 33`;
}

/**
 * Канонический URL сайта из company.seo.siteUrl
 * или вычисленный из window.location (для локальной разработки).
 */
function getSiteUrl() {
  const configured = company.seo?.siteUrl?.replace(/\/$/, '');
  if (configured) return configured;
  if (window.location.protocol.startsWith('http')) {
    const path = window.location.pathname
      .replace(/\/index\.html?$/i, '')
      .replace(/\/$/, '');
    return window.location.origin + path;
  }
  return '';
}

/** Абсолютный URL для относительного пути (OG, JSON-LD). */
function absUrl(path) {
  const base = getSiteUrl();
  if (!base) return path;
  const clean = path.replace(/^\.\//, '');
  return `${base}/${clean}`;
}

/**
 * Создаёт или обновляет meta-тег в <head>.
 * @param {string} name — значение name или property
 * @param {string} content
 * @param {'name'|'property'} attr
 */
function setMeta(name, content, attr = 'name') {
  if (!content) return;
  let el = document.querySelector(`meta[${attr}="${name}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

/**
 * Заполняет innerHTML контейнера по селектору.
 * @returns {Element|null}
 */
function fillContainer(selector, html) {
  const host = document.querySelector(selector);
  if (host) host.innerHTML = html;
  return host;
}

/**
 * Заполняет два связанных контейнера (основной блок + footer).
 * Используется для телефонов и мессенджеров.
 */
function fillDualContainers(
  primarySelector,
  footerSelector,
  items,
  primaryFn,
  footerFn,
) {
  fillContainer(primarySelector, items.map(primaryFn).join(''));
  fillContainer(footerSelector, items.map(footerFn).join(''));
}

/* ── Тема ────────────────────────────────────────────── */

/** Тема ОС по prefers-color-scheme. */
function getSystemTheme() {
  return window.matchMedia('(prefers-color-scheme: light)').matches
    ? 'light'
    : 'dark';
}

/** Сохранённая тема или системная. */
function getActiveTheme() {
  return localStorage.getItem(THEME_KEY) || getSystemTheme();
}

/**
 * Применяет тему: data-theme на <html>, theme-color в meta,
 * иконка и aria-label на [data-theme-toggle].
 */
function applyTheme(theme) {
  const html = document.documentElement;
  html.setAttribute('data-theme', theme);
  const metaThemes = document.querySelectorAll('meta[name="theme-color"]');
  metaThemes.forEach((meta) => {
    const media = meta.getAttribute('media') || '';
    if (media.includes('light')) {
      meta.content = THEME_COLORS.light;
    } else if (media.includes('dark')) {
      meta.content = THEME_COLORS.dark;
    } else if (!media) {
      meta.content = theme === 'light' ? THEME_COLORS.light : THEME_COLORS.dark;
    }
  });
  const btn = document.querySelector(SELECTORS.themeToggle);
  if (btn) {
    btn.innerHTML = theme === 'dark' ? ICON_DARK : ICON_LIGHT;
    btn.setAttribute(
      'aria-label',
      theme === 'dark' ? 'Включить светлую тему' : 'Включить тёмную тему',
    );
  }
}

/** Инициализация темы: применение, переключатель, отслеживание смены ОС. */
function initTheme() {
  applyTheme(getActiveTheme());

  const btn = document.querySelector(SELECTORS.themeToggle);
  if (!btn) return;

  btn.addEventListener('click', () => {
    const current =
      document.documentElement.getAttribute('data-theme') || getSystemTheme();
    const next = current === 'dark' ? 'light' : 'dark';
    localStorage.setItem(THEME_KEY, next);
    applyTheme(next);
  });

  window
    .matchMedia('(prefers-color-scheme: light)')
    .addEventListener('change', () => {
      if (!localStorage.getItem(THEME_KEY)) {
        applyTheme(getSystemTheme());
      }
    });
}

/* ── Рендеринг контента ──────────────────────────────── */

/** Мета-карточки первого экрана: размеры, гарантия, география-теги. */
function renderHeroMeta() {
  const h = company.hero;
  setTextById('hero-sizes', h.sizes?.value ?? 'Любые');
  setTextById('hero-sizes-detail', h.sizes?.detail ?? 'по вашим чертежам');
  setTextById('hero-warranty', h.warranty?.value ?? '3 года');
  setTextById('hero-warranty-detail', h.warranty?.detail ?? 'на все работы');

  const geoEl = $('hero-geo');
  if (!geoEl) return;

  const regions = Array.isArray(h.geo) ? h.geo : [h.geo].filter(Boolean);
  geoEl.innerHTML = regions
    .map((r) => `<span class="meta-card__tag">${escapeHtml(r)}</span>`)
    .join('');
}

/**
 * Подставляет текстовый контент в элементы с id и data-атрибутами.
 * DOM: #page-title, #company-name, #hero-*, #contact-*, #footer-*, [data-phone]
 */
function renderText() {
  const seoTitle =
    company.seo?.title || `${company.name} — гаражи и навесы под ключ`;
  setTextById('page-title', seoTitle);
  document.title = seoTitle;
  setTextById('company-name', company.name);
  setTextById('footer-company-name', company.name);
  setTextById('footer-company-name2', company.name);
  setTextById('hero-title', company.hero.title);
  setTextById('hero-text', company.hero.text);
  renderHeroMeta();

  const primaryPhone = company.phones[0];
  const phoneBtn = document.querySelector(SELECTORS.phone);
  if (phoneBtn && primaryPhone) {
    phoneBtn.href = primaryPhone.href;
    phoneBtn.textContent = `Позвонить ${primaryPhone.value}`;
  }

  setTextById('contact-email', company.email);
  const emailTile = $('contact-email-tile');
  if (emailTile) emailTile.href = `mailto:${company.email}`;
  const footerEmail = $('footer-email');
  if (footerEmail) {
    footerEmail.href = `mailto:${company.email}`;
    footerEmail.textContent = company.email;
  }

  setTextById('contact-hours', company.hours);
  setTextById('footer-hours', company.hours);
  setTextById('year', new Date().getFullYear());
}

/** HTML плитки телефона для блока контактов. */
function phoneTileHtml(p) {
  return `
    <a class="contact-tile contact-tile--accent" href="${escapeHtml(p.href)}">
      <span class="contact-tile__label">Телефон</span>
      <span class="contact-tile__value">${escapeHtml(p.value)}</span>
    </a>
  `;
}

/** HTML пункта телефона для footer. */
function phoneFooterHtml(p) {
  return `
    <li>
      <a href="${escapeHtml(p.href)}">${escapeHtml(p.value)}</a>
    </li>
  `;
}

/** DOM: [data-phones], [data-footer-phones] */
function renderPhones() {
  fillDualContainers(
    SELECTORS.phones,
    SELECTORS.footerPhones,
    company.phones,
    phoneTileHtml,
    phoneFooterHtml,
  );
}

/** DOM: [data-services] */
function renderServices() {
  fillContainer(
    SELECTORS.services,
    company.services
      .map(
        (s) => `
      <li class="service-item">
        <span class="service-item__bullet" aria-hidden="true"></span>
        <span>${escapeHtml(s)}</span>
      </li>
    `,
      )
      .join(''),
  );
}

/** DOM: [data-extras] — карточки дополнительных услуг. */
function renderExtras() {
  fillContainer(
    SELECTORS.extras,
    company.extras
      .map(
        (e, i) => `
      <article class="card">
        <div class="card__num">${String(i + 1).padStart(2, '0')}</div>
        <h3 class="card__title">${escapeHtml(e.title)}</h3>
        <p class="card__text">${escapeHtml(e.text)}</p>
      </article>
    `,
      )
      .join(''),
  );
}

/** DOM: [data-roofs] — карточки типов кровли с SVG-иконками. */
function renderRoofs() {
  fillContainer(
    SELECTORS.roofs,
    company.roofs
      .map(
        (r, i) => `
      <article class="roof-card">
        <div class="roof-card__meta">кровля ${String(i + 1).padStart(2, '0')}</div>
        <div class="roof-card__icon" aria-hidden="true">${
          ROOF_ICONS[r.icon] || ''
        }</div>
        <h3 class="roof-card__title">${escapeHtml(r.title)}</h3>
        <p class="roof-card__text">${escapeHtml(r.text)}</p>
      </article>
    `,
      )
      .join(''),
  );
}

/**
 * Общий рендер трека карусели.
 * DOM: [data-carousel="{name}"] [data-carousel-track]
 */
function renderCarouselTrack(name, items, buildSlide) {
  const track = document.querySelector(
    `${SELECTORS.carousel(name)} ${SELECTORS.carouselTrack}`,
  );
  if (!track) return;
  track.innerHTML = items.map(buildSlide).join('');
}

/** HTML слайда гаража с размером и мета-данными. */
function garageSlideHtml(p) {
  return `
    <article class="slide">
      <div class="slide__img">
        <img ${carouselImgAttrs(p.img)} alt="${escapeHtml(seoImageAlt(p.title, 'garage'))}" />
        <span class="slide__badge">сварной каркас</span>
      </div>
      <div class="slide__body">
        <div class="slide__kicker">типовой размер</div>
        <h3 class="slide__title">${escapeHtml(p.title)}</h3>
        <p class="slide__size">${escapeHtml(p.size)}</p>
        <p class="slide__meta">${escapeHtml(p.meta)}</p>
      </div>
    </article>
  `;
}

/** HTML слайда навеса (фото + заголовок). */
function canopySlideHtml(p) {
  return `
    <article class="slide slide--photo">
      <div class="slide__img slide__img--tall">
        <img ${carouselImgAttrs(p.img)} alt="${escapeHtml(seoImageAlt(p.title, 'canopy'))}" />
        <span class="slide__badge">навес под ключ</span>
      </div>
      <div class="slide__body">
        <div class="slide__kicker">металлоконструкция</div>
        <h3 class="slide__title">${escapeHtml(p.title)}</h3>
      </div>
    </article>
  `;
}

/** Конфигурация каруселей: имя → данные и функция рендера слайда. */
const CAROUSEL_CONFIG = {
  garages: { items: () => company.garages, buildSlide: garageSlideHtml },
  canopies: { items: () => company.canopies, buildSlide: canopySlideHtml },
};

/**
 * Рендер всех каруселей по CAROUSEL_CONFIG.
 * DOM: [data-carousel="garages"], [data-carousel="canopies"]
 */
function renderCarousels() {
  CAROUSEL_NAMES.forEach((name) => {
    const config = CAROUSEL_CONFIG[name];
    if (config) {
      renderCarouselTrack(name, config.items(), config.buildSlide);
    }
  });
}

/** DOM: [data-workflow] — нумерованные шаги. */
function renderWorkflow() {
  if (!company.workflow) return;
  fillContainer(
    SELECTORS.workflow,
    company.workflow.steps
      .map(
        (step, i) => `
      <li class="workflow-step">
        <div class="workflow-step__num" aria-hidden="true">${i + 1}</div>
        <div class="workflow-step__line" aria-hidden="true"></div>
        <div class="workflow-step__body">
          <h3 class="workflow-step__title">${escapeHtml(step.title)}</h3>
          <p class="workflow-step__text">${escapeHtml(step.text)}</p>
        </div>
      </li>
    `,
      )
      .join(''),
  );
}

/** HTML плитки мессенджера для блока контактов. */
function messengerTileHtml(m) {
  return `
    <a
      class="messenger-link messenger-link--${escapeHtml(m.id)}"
      href="${escapeHtml(m.href)}"
      target="_blank"
      rel="noopener noreferrer"
    >
      <span class="messenger-link__label">${escapeHtml(m.label)}</span>
      <span class="messenger-link__hint">${escapeHtml(m.hint)}</span>
    </a>
  `;
}

/** HTML пункта мессенджера для footer. */
function messengerFooterHtml(m) {
  return `
    <li>
      <a href="${escapeHtml(m.href)}" target="_blank" rel="noopener noreferrer">${escapeHtml(m.label)}</a>
    </li>
  `;
}

/** DOM: [data-messengers], [data-footer-messengers] */
function renderMessengers() {
  fillDualContainers(
    SELECTORS.messengers,
    SELECTORS.footerMessengers,
    company.messengers,
    messengerTileHtml,
    messengerFooterHtml,
  );
}

/**
 * DOM: [data-faq] — аккордеон из <details>.
 * После рендера вызывает initFaqAccordion для анимации.
 */
function renderFaq() {
  if (!company.faq) return;
  fillContainer(
    SELECTORS.faq,
    company.faq
      .map(
        (item) => `
      <details class="faq-item">
        <summary class="faq-item__question">
          <span class="faq-item__label">${escapeHtml(item.q)}</span>
          <span class="faq-item__icon" aria-hidden="true"></span>
        </summary>
        <div class="faq-item__panel">
          <div class="faq-item__answer">
            <p>${escapeHtml(item.a)}</p>
          </div>
        </div>
      </details>
    `,
      )
      .join(''),
  );
  initFaqAccordion();
}

/* ── SEO ─────────────────────────────────────────────── */

/** Массив areaServed для JSON-LD: регион + города. */
function buildAreaServedJsonLd() {
  const regions = company.seo?.serviceArea?.regions;
  if (!regions?.length) return [];

  const result = [];
  for (const region of regions) {
    if (!region.name.includes('область') && !region.cities?.length) {
      result.push({ '@type': 'City', name: region.name });
      continue;
    }
    const regionPlace = {
      '@type': 'AdministrativeArea',
      name: region.name,
    };
    result.push(regionPlace);
    if (region.cities?.length) {
      for (const city of region.cities) {
        result.push({
          '@type': 'City',
          name: city,
          containedInPlace: regionPlace,
        });
      }
    }
  }
  return result;
}

/**
 * Создаёт объект Offer для каталога в JSON-LD.
 * @param {string} pageUrl
 * @param {string} price — минимальная цена «от»
 */
function buildProductOffer(pageUrl, price) {
  const offer = {
    '@type': 'Offer',
    priceCurrency: 'RUB',
    price,
    availability: 'https://schema.org/InStock',
  };
  if (pageUrl) {
    offer.url = `${pageUrl}#contact`;
    offer.seller = { '@id': `${pageUrl}#organization` };
  }
  return offer;
}

/** @id товара в JSON-LD для связи каталога с Product на верхнем уровне. */
function productId(pageUrl, kind, index) {
  return `${pageUrl}#product-${kind}-${index}`;
}

/** Product с offers — отдельная сущность в @graph (требование Google для Product). */
function buildCatalogProduct(item, pageUrl, kind, index, price, description) {
  const product = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: item.title,
    description: description || item.meta || item.title,
    image: absUrl(item.img),
    offers: buildProductOffer(pageUrl, price),
  };
  if (pageUrl) product['@id'] = productId(pageUrl, kind, index);
  return product;
}

/** ListItem каталога: ссылка на Product по @id или полный объект без pageUrl. */
function buildCatalogListItems(items, pageUrl, kind, price, descriptionFn) {
  return items.map((item, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    item: pageUrl
      ? { '@id': productId(pageUrl, kind, i) }
      : {
          '@type': 'Product',
          name: item.title,
          description: descriptionFn(item),
          image: absUrl(item.img),
          offers: buildProductOffer(pageUrl, price),
        },
  }));
}

/** FAQPage для расширенных сниппетов в поиске. */
function buildFaqJsonLd(pageUrl) {
  if (!company.faq?.length) return null;

  const faq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: company.faq.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a,
      },
    })),
  };

  if (pageUrl) faq.url = `${pageUrl}#faq`;
  return faq;
}

/**
 * Обновляет meta-теги, canonical, OG, Twitter и JSON-LD из company.seo.
 * DOM: meta в <head>, #canonical-link, #json-ld
 */
function renderSEO() {
  const seo = company.seo;
  if (!seo) return;

  const siteUrl = getSiteUrl();
  const pageUrl = siteUrl ? `${siteUrl}/` : '';
  const description = seo.description;
  const ogImage = absUrl(seo.ogImage || './assets/logo-og.webp');
  const regions = seo.serviceArea?.regions;
  const placename = regions?.length
    ? `${regions
        .map((region) => {
          if (!region.cities?.length) return region.name;
          return `${region.name} (${region.cities.slice(0, 5).join(', ')} и др.)`;
        })
        .join('; ')}; по всем городам в этих регионах`
    : 'Владимирская, Московская, Нижегородская и Ивановская области';

  setMeta('description', description);
  setMeta('keywords', seo.keywords);
  setMeta('robots', 'index, follow, max-image-preview:large');
  setMeta('author', company.name);
  setMeta('geo.region', seo.region);
  setMeta('geo.placename', placename);

  setMeta('og:type', 'website', 'property');
  setMeta('og:site_name', company.name, 'property');
  setMeta('og:title', seo.title, 'property');
  setMeta('og:description', description, 'property');
  setMeta('og:locale', 'ru_RU', 'property');
  setMeta('og:image', ogImage, 'property');
  setMeta('og:image:secure_url', ogImage, 'property');
  setMeta('og:image:width', String(seo.ogImageWidth || 1200), 'property');
  setMeta('og:image:height', String(seo.ogImageHeight || 800), 'property');
  setMeta('og:image:type', 'image/webp', 'property');
  setMeta(
    'og:image:alt',
    `${company.name} — гаражи и навесы под ключ`,
    'property',
  );
  if (pageUrl) {
    setMeta('og:url', pageUrl, 'property');
    const canonical = $('canonical-link');
    if (canonical) canonical.href = pageUrl;
  }

  setMeta('twitter:card', 'summary_large_image');
  setMeta('twitter:title', seo.title);
  setMeta('twitter:description', description);
  setMeta('twitter:image', ogImage);
  setMeta('twitter:image:alt', `${company.name} — гаражи и навесы под ключ`);

  renderJsonLd(siteUrl, pageUrl, ogImage);
}

/**
 * Записывает JSON-LD (LocalBusiness + WebSite + Product[]) в #json-ld.
 * Каждый гараж — отдельный Product на верхнем уровне с offers (требование Google).
 */
function renderJsonLd(siteUrl, pageUrl, ogImage) {
  const host = $('json-ld');
  if (!host) return;

  const phones = company.phones.map((p) => p.href.replace('tel:', ''));

  const localBusiness = {
    '@context': 'https://schema.org',
    '@type': 'HomeAndConstructionBusiness',
    name: company.name,
    description: company.seo.description,
    slogan: company.tagline,
    image: ogImage,
    email: company.email,
    telephone: phones,
    priceRange: 'от 6 000 ₽',
    areaServed: buildAreaServedJsonLd(),
    contactPoint: company.phones.map((phone) => ({
      '@type': 'ContactPoint',
      telephone: phone.href.replace('tel:', ''),
      contactType: 'sales',
      areaServed: 'RU',
      availableLanguage: ['ru'],
    })),
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: [
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
          'Sunday',
        ],
        opens: '08:00',
        closes: '18:00',
      },
    ],
    knowsAbout: [
      'Металлические гаражи',
      'Навесы для автомобилей',
      'Сэндвич-панели',
      'Монтаж металлоконструкций',
    ],
    hasOfferCatalog: [
      {
        '@type': 'OfferCatalog',
        name: 'Металлические гаражи',
        itemListElement: buildCatalogListItems(
          company.garages,
          pageUrl,
          'garage',
          '22000',
          (g) => g.meta,
        ),
      },
      {
        '@type': 'OfferCatalog',
        name: 'Металлические навесы',
        itemListElement: buildCatalogListItems(
          company.canopies,
          pageUrl,
          'canopy',
          '6000',
          (c) => seoImageAlt(c.title, 'canopy'),
        ),
      },
    ],
    sameAs: company.messengers.map((messenger) => messenger.href),
  };

  if (pageUrl) {
    localBusiness.url = pageUrl;
    localBusiness['@id'] = `${pageUrl}#organization`;
  }

  const webSite = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: company.name,
    description: company.seo.description,
    inLanguage: 'ru-RU',
  };

  if (pageUrl) {
    webSite.url = pageUrl;
    webSite['@id'] = `${pageUrl}#website`;
    webSite.publisher = { '@id': `${pageUrl}#organization` };
  }

  const webPage = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: company.seo.title,
    description: company.seo.description,
    inLanguage: 'ru-RU',
    primaryImageOfPage: {
      '@type': 'ImageObject',
      url: ogImage,
      width: company.seo.ogImageWidth || 1200,
      height: company.seo.ogImageHeight || 800,
    },
  };

  if (pageUrl) {
    webPage.url = pageUrl;
    webPage['@id'] = `${pageUrl}#webpage`;
    webPage.isPartOf = { '@id': `${pageUrl}#website` };
    webPage.about = { '@id': `${pageUrl}#organization` };
  }

  const garageProducts = company.garages.map((g, i) =>
    buildCatalogProduct(g, pageUrl, 'garage', i, '22000', g.meta),
  );

  const canopyProducts = company.canopies.map((c, i) =>
    buildCatalogProduct(
      c,
      pageUrl,
      'canopy',
      i,
      '6000',
      seoImageAlt(c.title, 'canopy'),
    ),
  );

  const schemas = [
    localBusiness,
    webSite,
    webPage,
    ...garageProducts,
    ...canopyProducts,
  ];
  const faqPage = buildFaqJsonLd(pageUrl);
  if (faqPage) schemas.push(faqPage);

  host.textContent = JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': schemas,
  });
}

/* ── Интерактив ──────────────────────────────────────── */

/**
 * FAQ-аккордеон: один открытый пункт, анимация height/opacity.
 * При prefers-reduced-motion — мгновенное открытие без transition.
 * DOM: .faq-item, .faq-item__question, .faq-item__panel
 */
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

      // Закрыть другие открытые пункты (аккордеон — один за раз)
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

/** Анимированное раскрытие панели FAQ (height → scrollHeight → auto). */
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

/** Анимированное закрытие панели FAQ. */
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

/**
 * Мобильное меню: backdrop, закрытие по Escape и клику вне.
 * DOM: [data-nav-toggle], [data-nav], [data-nav-backdrop]
 */
function initMobileMenu() {
  const toggle = document.querySelector(SELECTORS.navToggle);
  const nav = document.querySelector(SELECTORS.nav);
  const backdrop = document.querySelector(SELECTORS.navBackdrop);
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

/**
 * Lightbox для фото каруселей: клик по .slide__img, навигация ←/→, Escape.
 * Создаёт overlay в document.body при инициализации.
 */
function initLightbox() {
  const overlay = document.createElement('div');
  overlay.className = 'lightbox';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', 'Просмотр изображения');
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
    <img class="lightbox__img" src="" alt="" />
    <div class="lightbox__caption"></div>
  `;
  document.body.appendChild(overlay);

  const img = overlay.querySelector('.lightbox__img');
  const caption = overlay.querySelector('.lightbox__caption');
  const closeBtn = overlay.querySelector('.lightbox__close');
  const prevBtn = overlay.querySelector('.lightbox__nav--prev');
  const nextBtn = overlay.querySelector('.lightbox__nav--next');

  let items = [];
  let currentIndex = 0;

  function updateNav() {
    const hasMany = items.length > 1;
    prevBtn.hidden = !hasMany;
    nextBtn.hidden = !hasMany;
    prevBtn.disabled = currentIndex <= 0;
    nextBtn.disabled = currentIndex >= items.length - 1;
  }

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

  function open(galleryItems, startIndex = 0) {
    items = galleryItems;
    show(startIndex);
    overlay.removeAttribute('hidden');
    requestAnimationFrame(() => overlay.classList.add('is-open'));
    document.body.classList.add('lightbox-open');
    closeBtn.focus();
  }

  function close() {
    overlay.classList.remove('is-open');
    document.body.classList.remove('lightbox-open');
    items = [];
    currentIndex = 0;
    // Очистка src после анимации закрытия
    setTimeout(() => {
      img.src = '';
    }, LIGHTBOX_CLOSE_MS);
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
    if (!overlay.classList.contains('is-open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') step(-1);
    if (e.key === 'ArrowRight') step(1);
  });

  // Делегирование: клик по фото в любой карусели открывает lightbox
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
    );
  });
}

/**
 * Карусель: стрелки прокручивают слайды через scrollIntoView.
 * DOM: [data-carousel="{name}"], [data-carousel-prev/next], .slide
 */
function initCarousel(name) {
  const carousel = document.querySelector(SELECTORS.carousel(name));
  if (!carousel) return;
  const prevBtn = carousel.querySelector(SELECTORS.carouselPrev);
  const nextBtn = carousel.querySelector(SELECTORS.carouselNext);
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

/** Инициализация всех каруселей из CAROUSEL_NAMES. */
function initCarousels() {
  CAROUSEL_NAMES.forEach(initCarousel);
}

/**
 * Плавное появление секций при прокрутке.
 * DOM: .section — добавляет классы reveal / is-visible.
 * Отключается при prefers-reduced-motion или без IntersectionObserver.
 */
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

/**
 * Кнопка «Наверх»: видимость после прокрутки > SCROLL_TOP_THRESHOLD.
 * DOM: .scroll-top — tabindex и aria-hidden управляются динамически.
 */
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

/* ── PWA ─────────────────────────────────────────────── */

/**
 * Регистрация Service Worker на localhost/HTTPS.
 * При смене controller — автоперезагрузка страницы.
 */
function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) return;

  navigator.serviceWorker
    .register('./sw.js')
    .then((registration) => {
      registration.update();

      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
          registration.update();
        }
      });
    })
    .catch(() => {});

  let refreshing = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (refreshing) return;
    refreshing = true;
    window.location.reload();
  });
}

/* ── Инициализация ───────────────────────────────────── */

/**
 * Точка входа. Порядок вызовов важен:
 * 1. Тема — до отрисовки интерактива (иконка переключателя).
 * 2. Рендер контента и SEO — заполнение DOM до привязки обработчиков.
 * 3. FAQ — renderFaq() вызывает initFaqAccordion() внутри.
 * 4. Карусели и lightbox — после renderCarousels() (слайды в DOM).
 * 5. Scroll reveal / scroll-top — независимы от контента.
 * 6. Service Worker — в конце, не блокирует UI.
 */
function init() {
  initTheme();
  renderText();
  renderSEO();
  renderPhones();
  renderServices();
  renderExtras();
  renderWorkflow();
  renderFaq();
  renderRoofs();
  renderCarousels();
  renderMessengers();
  initMobileMenu();
  initCarousels();
  initLightbox();
  initScrollReveal();
  initScrollTop();
  registerServiceWorker();
}

document.addEventListener('DOMContentLoaded', init);
