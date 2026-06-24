# Металл Монтаж 33

Лендинг компании по производству и монтажу металлических гаражей и навесов. Статический сайт без сборки и зависимостей — открывается в браузере как есть.

## Возможности

### Контент и разделы

- Первый экран с CTA, телефоном и ключевыми преимуществами
- Карусели гаражей (4 размера) и навесов (5 типов)
- Типы кровли, основные и дополнительные услуги
- Блок «Как мы работаем» (7 этапов)
- FAQ с аккордеоном (один открытый пункт за раз)
- Контакты: телефоны, email, часы работы, мессенджер MAX

### Интерфейс

- Адаптивная вёрстка для телефона, планшета и десктопа
- Фиксированная шапка с учётом `scroll-margin` при переходе по якорям
- Мобильное меню с backdrop и закрытием по Escape
- Переключение тёмной и светлой темы (SVG-иконки)
- Автовыбор темы по `prefers-color-scheme`, сохранение в `localStorage`
- Lightbox для фото в каруселях (клавиши ←/→ и Escape)
- Плавное появление секций при прокрутке (`IntersectionObserver`)
- Кнопка «Наверх» после прокрутки

### PWA и офлайн

- Web App Manifest (`manifest.json`) — установка на домашний экран
- Service Worker (`sw.js`) — кэширование и работа без сети
- HTML/CSS/JS обновляются по стратегии network-first, изображения — cache-first

### SEO и доступность

- Мета-теги, Open Graph, Twitter Card, гео-теги
- JSON-LD: `HomeAndConstructionBusiness`, `WebSite`, каталог гаражей
- `robots.txt` и `sitemap.xml`
- Семантическая разметка, alt у изображений, ARIA у интерактивных элементов
- Учёт `prefers-reduced-motion` в FAQ и анимациях

## Стек

| Слой     | Технологии                       |
| -------- | -------------------------------- |
| Разметка | HTML5                            |
| Стили    | CSS3 (переменные, Grid, Flexbox) |
| Логика   | Vanilla JavaScript (ES2020+)     |

## Структура проекта

```
garages/
├── index.html              # Разметка страницы (SEO-заготовки + секции)
├── main.js                 # Объект company и вся логика сайта
├── styles.css              # Стили, темы, компоненты
├── manifest.json           # PWA-манифест
├── sw.js                   # Service Worker
├── robots.txt              # Правила для поисковых роботов
├── sitemap.xml             # Карта сайта
├── assets/
│   ├── logo-og.webp        # OG-превью, JSON-LD
│   ├── logo-hero.webp      # Hero-карточка (920w)
│   ├── logo-hero-680.webp  # Hero-карточка (680w, preload)
│   ├── logo-48.webp        # Логотип в шапке
│   ├── logo-96.webp        # Логотип 2x
│   ├── logo-44.webp        # Логотип в footer
│   ├── favicon.svg         # Иконка вкладки
│   ├── favicon-48.png      # Favicon PNG
│   ├── icon-192.webp       # PWA-иконка
│   ├── icon-512.webp       # PWA-иконка
│   ├── garage-6x4.webp     # Фото гаражей (+ *-560.webp превью)
│   ├── garage-6x6.webp
│   ├── garage-8x6.webp
│   ├── garage-6x8.webp
│   ├── canopy-car.webp     # Фото навесов (+ *-560.webp превью)
│   ├── canopy-gable.webp
│   ├── canopy-single-slope.webp
│   ├── canopy-two-cars.webp
│   └── canopy-house.webp
└── README.md
```

### Секции main.js

Файл организован сверху вниз по логическим блокам:

| Секция            | Содержимое                                                                                                                                          |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Данные**        | Объект `company` — весь контент сайта                                                                                                               |
| **Константы**     | `THEME_KEY`, `SELECTORS`, `CAROUSEL_NAMES`, SVG-иконки темы и кровли                                                                                |
| **Утилиты**       | `$()`, `setTextById()`, `escapeHtml()`, `carouselImgAttrs()`, `getSiteUrl()`, `absUrl()`, `setMeta()`, `fillContainer()`, `fillDualContainers()`    |
| **Тема**          | `getSystemTheme`, `applyTheme`, `initTheme`                                                                                                         |
| **Рендеринг**     | `renderText`, `renderPhones`, `renderServices`, `renderExtras`, `renderRoofs`, `renderCarousels`, `renderWorkflow`, `renderFaq`, `renderMessengers` |
| **SEO**           | `renderSEO`, `renderJsonLd`, `buildAreaServedJsonLd`                                                                                                |
| **Интерактив**    | FAQ-аккордеон, мобильное меню, lightbox, карусели, scroll reveal, scroll-to-top                                                                     |
| **PWA**           | `registerServiceWorker`                                                                                                                             |
| **Инициализация** | `init()` + `DOMContentLoaded`                                                                                                                       |

### Секции styles.css

| Секция                     | Содержимое                                                                                                               |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| **CSS-переменные**         | Тёмная тема (`:root`), светлая (`data-theme`, `prefers-color-scheme`), z-index, отступы секций, transition               |
| **Reset / base**           | `*`, `html`, `body`, типографика                                                                                         |
| **Утилиты**                | `.container`, `.skip-link`, `.section`                                                                                   |
| **Компоненты**             | Header → Hero → Carousel → Roofs → Workflow → FAQ → Services → Contact/Footer → Scroll-to-top → Lightbox → Scroll reveal |
| **Адаптив**                | `@media (max-width: 980px)` и `720px`                                                                                    |
| **prefers-reduced-motion** | FAQ и scroll reveal без анимаций                                                                                         |

## Запуск локально

Сайт не требует установки пакетов. Достаточно открыть `index.html` в браузере.

**Быстрый способ** — открыть `index.html` в браузере. Service Worker и PWA в этом режиме могут работать ограниченно (нужен origin, не `file://`).

**Для разработки** — локальный HTTP-сервер:

```bash
# Python 3
python3 -m http.server 8080

# или npx (если установлен Node.js)
npx serve .
```

Откройте [http://localhost:8080](http://localhost:8080).

> Service Worker регистрируется только по HTTPS или на `localhost`.

## Редактирование контента

Весь контент собран в объекте `company` в `main.js`. HTML-секции содержат заготовки; при загрузке страницы `init()` подставляет актуальные данные.

### Контакты и общая информация

```js
const company = {
  name: 'Металл Монтаж 33',
  shortName: 'ММ33',
  tagline: 'Гаражи и навесы из металла под ключ',
  phones: [
    { value: '+7 (904) 254-36-74', href: 'tel:+79042543674' },
    { value: '+7 (920) 343-47-27', href: 'tel:+79203434727' },
  ],
  email: 'MetallMontage33@yandex.ru',
  hours: 'Ежедневно 8:00–18:00',
  // ...
};
```

### Гаражи и навесы

Массивы `garages` и `canopies` управляют каруселями:

```js
garages: [
  {
    title: 'Гараж 6×4 м',
    size: '6000 × 4000 × 3600 мм',
    meta: 'Длина 6 м · Ширина 4 м · Высота 3,6 м',
    img: './assets/garage-6x4.webp',
  },
  // ...
],
canopies: [
  {
    title: 'Навес для авто',
    img: './assets/canopy-car.webp',
  },
  // ...
],
```

Чтобы добавить или заменить фото — положите файл в `assets/` (формат WebP) и укажите путь в поле `img`. Для каруселей автоматически подставляется превью `*-560.webp` через `carouselImgAttrs()`.

### Остальные поля

| Поле в `main.js` | Что отображает на сайте                                |
| ---------------- | ------------------------------------------------------ |
| `hero`           | Заголовок, текст и мета-карточки первого экрана        |
| `services`       | Список основных услуг                                  |
| `roofs`          | Карточки типов кровли                                  |
| `extras`         | Дополнительные услуги                                  |
| `workflow`       | Заголовок и шаги «Как мы работаем»                     |
| `faq`            | Вопросы и ответы (массив `{ q, a }`)                   |
| `messengers`     | Ссылки на мессенджеры                                  |
| `seo`            | Title, description, keywords, URL, регион, OG-картинка |

После правок `company.seo` функция `renderSEO()` обновляет мета-теги и JSON-LD в `<head>`.

## Тема оформления

- По умолчанию — системная тема устройства
- Кнопка в шапке переключает тёмную и светлую тему
- Выбор сохраняется в `localStorage` под ключом `mm33-theme`

Основные CSS-переменные в `styles.css`:

| Переменная        | Назначение                           |
| ----------------- | ------------------------------------ |
| `--primary`       | Оранжевый акцент                     |
| `--bg`            | Фон страницы                         |
| `--text`          | Основной цвет текста                 |
| `--surface`       | Фон карточек и панелей               |
| `--header-height` | Высота шапки (для якорной прокрутки) |

## PWA и Service Worker

| Файл            | Назначение                                      |
| --------------- | ----------------------------------------------- |
| `manifest.json` | Название, иконки, `start_url`, цвета темы       |
| `sw.js`         | Precache ключевых файлов, стратегии кэширования |

При смене версии кэша (`CACHE` в `sw.js`) старые записи удаляются при активации. После обновления SW страница перезагружается автоматически.

**Домен:** в `manifest.json` указаны `start_url` и `scope` как `/`. При смене домена или пути деплоя обновите их вместе с `seo.siteUrl` в `main.js`.

## Публикация

Сайт состоит только из статических файлов. Загрузите содержимое репозитория на хостинг:

- [metallmontage33.ru](https://metallmontage33.ru/) — основной домен
- [cp283311.tw1.ru](https://cp283311.tw1.ru/) — зеркало на хостинге Timeweb
- Netlify / Vercel / Cloudflare Pages
- Обычный веб-хостинг по FTP

`index.html` должен быть доступен по корневому URL сайта (или подпути, если настроен base path).

## SEO

### Что уже настроено

- Title, description, keywords с региональными ключевыми словами
- Open Graph и Twitter Card
- JSON-LD: `HomeAndConstructionBusiness`, `WebSite`, каталог гаражей (`OfferCatalog`)
- `robots.txt` и `sitemap.xml`
- Гео-мета-теги для Владимирской, Московской, Нижегородской и Ивановской областей, Москвы и всех городов в этих регионах
- Один `h1`, иерархия заголовков, alt у изображений

### Перед публикацией на новый домен

1. Обновите канонический URL в `main.js`:

```js
seo: {
  siteUrl: 'https://metallmontage33.ru',
  mirrorUrls: ['https://cp283311.tw1.ru'],
  serviceArea: {
    regions: [
      {
        name: 'Владимирская область',
        cities: ['Владимир', 'Ковров', 'Муром', /* ... */],
      },
      { name: 'Московская область' },
      { name: 'Нижегородская область' },
      { name: 'Ивановская область' },
    ],
  },
  ogImage: './assets/logo-og.webp',
}
```

2. Синхронизируйте URL в `index.html` (canonical, OG), `robots.txt`, `sitemap.xml` и `manifest.json` — либо полагайтесь на `renderSEO()`, которая подставляет значения из `company.seo` при загрузке. Зеркальные домены (`mirrorUrls`) не дублируют канонический URL — canonical всегда указывает на `siteUrl`.

3. Зарегистрируйте сайт в [Яндекс.Вебмастер](https://webmaster.yandex.ru/) и [Google Search Console](https://search.google.com/search-console).

4. Убедитесь, что `assets/logo-og.webp` на месте — он используется в OG-превью, JSON-LD и PWA.

### SEO-поля в main.js

| Поле                      | Назначение                                               |
| ------------------------- | -------------------------------------------------------- |
| `seo.siteUrl`             | Канонический домен (без завершающего `/`)                |
| `seo.mirrorUrls`          | Дополнительные URL, где доступен тот же сайт             |
| `seo.title`               | Заголовок страницы                                       |
| `seo.description`         | Описание для поисковиков и соцсетей                      |
| `seo.keywords`            | Ключевые слова                                           |
| `seo.region`              | Коды регионов (`RU-VLA, RU-MOW, RU-MOS, RU-NIZ, RU-IVA`) |
| `seo.serviceArea.regions` | Список регионов обслуживания (с городами для JSON-LD)    |
| `seo.ogImage`             | Картинка для превью в соцсетях                           |

## Разработчик

Сайт разработал [Брагин Ярослав](https://t.me/yar_bragin) — [Telegram](https://t.me/yar_bragin).

## Лицензия

Проект создан для компании «Металл Монтаж 33». Все права защищены.
