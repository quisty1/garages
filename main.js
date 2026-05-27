const company = {
  name: 'СтройГараж',
  phone: '+7 (000) 000-00-00',
  phoneHref: 'tel:+70000000000',
  email: 'info@example.com',
  addressMain: 'г. Москва, ул. Примерная, 1',
  hours: 'Пн–Сб 9:00–18:00',
  messengers: [
    {
      id: 'telegram',
      label: 'Telegram',
      href: 'https://t.me/example',
      hint: '@example',
    },
    {
      id: 'whatsapp',
      label: 'WhatsApp',
      href: 'https://wa.me/70000000000',
      hint: 'Написать в WhatsApp',
    },
    {
      id: 'max',
      label: 'MAX',
      href: 'https://max.ru/example',
      hint: 'Написать в MAX',
    },
  ],
  yearStart: 2020,
  hero: {
    title: 'Гаражи, которые служат десятилетиями',
    text: 'Проектируем, производим и монтируем гаражи из качественных материалов. Сроки, смета и контроль на каждом этапе — всё прозрачно.',
    geo: 'Владимирская область',
    warranty: '3 года',
  },
  addresses: [
    'г. Москва, ул. Примерная, 1 (производство)',
    'г. Москва, ул. Доставка, 10 (склад и отгрузка)',
    'МО, г. Химки, ул. Пробная, 5 (выездная бригада)',
  ],
  guarantees: [
    'Гарантия на монтажные работы — 3 года',
    'Подбор материалов под климат и нагрузки',
    'Согласование сметы и комплектации до начала работ',
    'Контроль качества на этапе монтажа',
  ],
  services: [
    {
      icon: '1',
      title: 'Каркасные гаражи',
      text: 'Рациональная конструкция: быстрый монтаж и хорошие теплоизоляционные решения.',
    },
    {
      icon: '2',
      title: 'Гаражи из сэндвич-панелей',
      text: 'Герметичная стеновая система для комфортной температуры внутри.',
    },
    {
      icon: '3',
      title: 'Кровля и ворота',
      text: 'Подбираем тип ворот, утепление и покрытие кровли под вашу задачу.',
    },
    {
      icon: '4',
      title: 'Монтаж под ключ',
      text: 'Организуем доставку, сборку, крепление и финальную сдачу объекта.',
    },
  ],
  steps: [
    {
      title: 'Заявка и консультация',
      text: 'Уточняем размер, ворота и адрес. Помогаем подобрать оптимальную комплектацию.',
    },
    {
      title: 'Расчёт и смета',
      text: 'Делаем предварительный расчёт и фиксируем перечень работ в смете.',
    },
    {
      title: 'Производство и доставка',
      text: 'Изготавливаем элементы конструкции и планируем логистику до площадки.',
    },
    {
      title: 'Монтаж и сдача',
      text: 'Выполняем монтаж, проверяем геометрию и передаём готовый гараж с документами.',
    },
  ],
  portfolio: [
    {
      title: 'Гараж 6×3 м',
      meta: 'Сэндвич-панели, утепление, ворота 2.7×2.2',
      img: 'https://placehold.co/900x620/png?text=Гараж+1',
    },
    {
      title: 'Гараж 7×4 м',
      meta: 'Каркас, кровля с покрытием, вентиляция',
      img: 'https://placehold.co/900x620/png?text=Гараж+2',
    },
    {
      title: 'Гараж 6×4 м',
      meta: 'Усиление каркаса, утепление, откатные ворота',
      img: 'https://placehold.co/900x620/png?text=Гараж+3',
    },
    {
      title: 'Гараж 8×4 м',
      meta: 'Сэндвич-панели, двускатная кровля, электропроводка',
      img: 'https://placehold.co/900x620/png?text=Гараж+4',
    },
    {
      title: 'Гараж 5×3 м',
      meta: 'Быстрый монтаж, стандартная комплектация',
      img: 'https://placehold.co/900x620/png?text=Гараж+5',
    },
  ],
  faq: [
    {
      q: 'Сколько времени занимает строительство?',
      a: 'Зависит от комплектации и условий площадки. Обычно монтаж занимает от нескольких дней, а подготовка и производство — по графику после расчёта.',
    },
    {
      q: 'Можно ли адаптировать гараж под мой участок?',
      a: 'Да. Поможем с привязкой по месту и учтём особенности подъезда, фундамента и расположения ворот.',
    },
    {
      q: 'Какие материалы вы используете?',
      a: 'Работаем с проверенными поставщиками. Точный перечень комплектующих фиксируем в смете по выбранной конфигурации.',
    },
    {
      q: 'Есть ли гарантия на монтаж?',
      a: 'Да. Гарантия указывается в договоре и распространяется на монтажные работы и установленные элементы.',
    },
    {
      q: 'Вы делаете проект и смету?',
      a: 'Да, подготовим проектное решение и смету под выбранный размер, ворота и материалы. Для старта достаточно заявки и адреса.',
    },
  ],
};

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
  // Title / hero
  $('page-title').textContent = `${company.name} — гаражи под ключ`;
  $('company-name').textContent = company.name;
  $('footer-company-name').textContent = company.name;
  $('footer-company-name2').textContent = company.name;
  $('hero-title').textContent = company.hero.title;
  $('hero-text').textContent = company.hero.text;
  $('hero-geo').textContent = company.hero.geo;
  $('hero-warranty').textContent = company.hero.warranty;
  const phoneTile = $('contact-phone-tile');
  if (phoneTile) phoneTile.href = company.phoneHref;
  $('contact-phone').textContent = company.phone;
  $('footer-phone').href = company.phoneHref;
  $('footer-phone').textContent = company.phone;

  const emailTile = $('contact-email-tile');
  if (emailTile) emailTile.href = `mailto:${company.email}`;
  $('contact-email').textContent = company.email;
  $('footer-email').href = `mailto:${company.email}`;
  $('footer-email').textContent = company.email;

  const hoursEl = $('contact-hours');
  if (hoursEl) hoursEl.textContent = company.hours;
  $('footer-hours').textContent = company.hours;
  $('year').textContent = new Date().getFullYear();
  // CTA phone link (secondary button)
  document.querySelector('[data-phone]').href = company.phoneHref;
}

function renderServices() {
  const host = document.querySelector('[data-services]');
  if (!host) return;
  host.innerHTML = company.services
    .map(
      (s) => `
      <article class="card">
        <div class="card__icon" aria-hidden="true">${escapeHtml(s.icon)}</div>
        <h3 class="card__title">${escapeHtml(s.title)}</h3>
        <p class="card__text">${escapeHtml(s.text)}</p>
      </article>
    `,
    )
    .join('');
}

function renderPortfolio() {
  const track = document.querySelector('[data-carousel-track]');
  if (!track) return;
  track.innerHTML = company.portfolio
    .map(
      (p) => `
      <article class="slide">
        <div class="slide__img">
          <img src="${p.img}" alt="${escapeHtml(p.title)}" loading="lazy" />
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

function renderSteps() {
  const host = document.querySelector('[data-steps]');
  if (!host) return;
  host.innerHTML = company.steps
    .map(
      (s, idx) => `
      <article class="step">
        <div class="step__num">${idx + 1}</div>
        <h3 class="step__title">${escapeHtml(s.title)}</h3>
        <p class="step__text">${escapeHtml(s.text)}</p>
      </article>
    `,
    )
    .join('');
}

function renderGuarantees() {
  const host = document.getElementById('guarantees-list');
  if (!host) return;
  host.innerHTML = company.guarantees
    .map((g) => `<li>${escapeHtml(g)}</li>`)
    .join('');
}

function renderAddresses() {
  const host = document.getElementById('addresses-list');
  if (!host) return;
  host.innerHTML = company.addresses
    .map((a) => `<li>${escapeHtml(a)}</li>`)
    .join('');

  const contactAddresses = document.querySelector('[data-contact-addresses]');
  if (contactAddresses) {
    contactAddresses.innerHTML = company.addresses
      .map((a) => `<li>${escapeHtml(a)}</li>`)
      .join('');
  }
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
          <a href="${escapeHtml(m.href)}" target="_blank" rel="noopener noreferrer">${escapeHtml(m.label)}</a>
        </li>
      `,
      )
      .join('');
  }
}

function renderFAQ() {
  const host = document.querySelector('[data-faq]');
  if (!host) return;
  host.innerHTML = company.faq
    .map(
      (item, idx) => `
      <div class="faq-item" data-open="false" data-faq-item="${idx}">
        <button class="faq-q" type="button" aria-expanded="false" aria-controls="faq-a-${idx}" data-faq-q>
          <span>${escapeHtml(item.q)}</span>
          <div class="faq-icon" aria-hidden="true">+</div>
        </button>
        <div class="faq-a" id="faq-a-${idx}">
          <div class="faq-a__inner">${escapeHtml(item.a)}</div>
        </div>
      </div>
    `,
    )
    .join('');
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

function initPortfolioCarousel() {
  const carousel = document.querySelector('[data-carousel="portfolio"]');
  if (!carousel) return;
  const viewport = carousel.querySelector('[data-carousel-viewport]');
  const prevBtn = carousel.querySelector('[data-carousel-prev]');
  const nextBtn = carousel.querySelector('[data-carousel-next]');
  const slides = Array.from(carousel.querySelectorAll('.slide'));
  if (!viewport || slides.length === 0) return;

  let activeIndex = 0;

  function goTo(index) {
    activeIndex = Math.max(0, Math.min(slides.length - 1, index));
    slides[activeIndex].scrollIntoView({
      behavior: 'smooth',
      inline: 'start',
      block: 'nearest',
    });
  }

  prevBtn.addEventListener('click', () => goTo(activeIndex - 1));
  nextBtn.addEventListener('click', () => goTo(activeIndex + 1));
}

function initFAQ() {
  const items = document.querySelectorAll('[data-faq-item]');
  if (!items.length) return;
  items.forEach((item) => {
    const btn = item.querySelector('[data-faq-q]');
    const icon = item.querySelector('.faq-icon');
    const content = item.querySelector('.faq-a');
    if (!btn || !icon || !content) return;
    btn.addEventListener('click', () => {
      const isOpen = item.getAttribute('data-open') === 'true';
      item.setAttribute('data-open', String(!isOpen));
      btn.setAttribute('aria-expanded', String(!isOpen));
      icon.textContent = isOpen ? '+' : '-';
    });
  });
}

function init() {
  renderText();
  renderServices();
  renderPortfolio();
  renderSteps();
  renderGuarantees();
  renderAddresses();
  renderMessengers();
  renderFAQ();
  initMobileMenu();
  initPortfolioCarousel();
  initFAQ();
}

document.addEventListener('DOMContentLoaded', init);
