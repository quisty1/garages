# Металл Монтаж 33

Лендинг компании по производству и монтажу металлических гаражей и навесов.

Сайт собран на **Next.js App Router + TypeScript** и публикуется как **статический экспорт** (`out/`) на обычный хостинг Timeweb без Node.js-сервера.

Production: https://metallmontage33.ru/

## Почему Next.js static export

- Единый типизированный источник контента и пререндер HTML: тексты, контакты и SEO доступны без JavaScript.
- Компонентная архитектура с «островами» интерактивности (тема, меню, калькулятор, FAQ, карусели, lightbox).
- Metadata API, `robots.ts`, `sitemap.ts` и JSON-LD без дублирования разметки вручную.
- Итоговый артефакт — обычные HTML/CSS/JS файлы в `out/`, совместимые с FTP-хостингом.

### Ограничения режима `output: 'export'`

- Нет Server Actions, middleware, cookies, ISR, API routes и serverless-функций.
- Нет Node.js runtime на хостинге — только статические файлы.
- `next/image` оптимизация на сервере недоступна; используются нативные `<img>` и текущие `srcset`.

## Стек

| Слой      | Технологии                                               |
| --------- | -------------------------------------------------------- |
| Framework | Next.js App Router, React, TypeScript (strict)           |
| Стили     | Существующие CSS-токены и partials (без Tailwind/UI-kit) |
| Деплой    | Static export → `out/` → Timeweb FTP                     |
| Тесты     | Vitest + coverage, Testing Library, Playwright, axe-core |

## Структура

```
app/                 # App Router: layout, page, robots, sitemap
components/          # UI-секции и client islands
lib/                 # site-data, calculator, seo, analytics, focus
styles/              # CSS partials (токены и секции)
public/              # assets, manifest.json, sw.js, favicon
scripts/             # validate-out, patch-sw-precache
tests/               # unit, components, e2e, a11y, visual
out/                 # production static export (после build)
```

Контент и коэффициенты калькулятора редактируются в [`lib/site-data.ts`](lib/site-data.ts).

## npm-команды

| Команда                             | Назначение                                 |
| ----------------------------------- | ------------------------------------------ |
| `npm run dev`                       | Локальная разработка Next.js               |
| `npm run build`                     | Production static export в `out/`          |
| `npm run preview` / `npm run start` | Локальный HTTP preview папки `out/`        |
| `npm run typecheck`                 | TypeScript приложения и Playwright-тестов  |
| `npm run lint`                      | ESLint + Stylelint                         |
| `npm run test`                      | Unit + component (Vitest)                  |
| `npm run test:coverage`             | Vitest с обязательными порогами покрытия   |
| `npm run test:e2e`                  | Playwright E2E (нужен `out/`)              |
| `npm run test:a11y`                 | axe + keyboard checks                      |
| `npm run test:cross-browser`        | Smoke-тесты Firefox и WebKit               |
| `npm run test:visual`               | Visual regression screenshots              |
| `npm run validate`                  | Проверки содержимого `out/`                |
| `npm run ci`                        | typecheck + lint + test + build + validate |

## Локальный запуск

Нужен Node.js 22.22.2 или новее и npm 11.17.0.

```bash
npm ci
npm run dev
```

Preview production-сборки:

```bash
npm run build
npm run preview
```

Откройте http://localhost:3000 — нужен HTTP, не `file://`.

## PWA

- `public/manifest.json` — installability
- `public/sw.js` — network-first для навигации и `/_next/static`, SWR для картинок, cache versioning, нормализация query, bounded runtime cache (48), пропуск Range/206/`Vary: *`
- После `build` `postbuild` (`scripts/patch-sw-precache.mjs`) подставляет hashed JS/CSS из `out/_next` в `NEXT_SHELL_FILES`, которые входят в `PRECACHE_URLS` (install-time precache)
- Активация оставляет до двух поколений `mm33-*` кэшей, чтобы открытые вкладки переживали FTP-деплой без старых hashed-файлов на сервере

## Аналитика (Yandex Metrica)

Счётчик загружается только на `metallmontage33.ru` / `www.metallmontage33.ru`.

Goal IDs (без переименования):

- `cta_calculate`
- `cta_contact`
- `phone_click`
- `email_click`
- `messenger_click`
- `map_click`
- `contact_copy`
- `calculator_start`
- `calculator_complete`

## Деплой на Timeweb

GitHub Actions (`.github/workflows/deploy-timeweb.yml`):

1. `npm ci`
2. `npm run ci`
3. Playwright e2e, accessibility и Firefox/WebKit smoke-проверки
4. Visual regression в Windows с платформенными baseline-снимками
5. Загрузка проверенного `out/` как workflow artifact
6. `lftp mirror` содержимого **`out/`** в корень хостинга

Тот же набор проверок запускается для pull request в `main`, но без публикации.
Сборка, typecheck приложения и Playwright-тестов, ESLint, Stylelint, coverage,
проверка `out/` (включая обход локальных ссылок и ресурсов) и браузерные
проверки остаются обязательными.
FTP повторяет временно неудачные соединения до пяти раз.

### GitHub Secrets (имена)

- `TIMEWEB_FTP_SERVER`
- `TIMEWEB_FTP_USERNAME`
- `TIMEWEB_FTP_PASSWORD`

Значения секретов в репозиторий не коммитятся.

## SEO

Отдельные посадочные страницы экспортируются в HTML с собственными title,
description, canonical, Open Graph, Twitter Card, хлебными крошками и FAQ:

- `/metallicheskie-garazhi/` — выбор и комплектация металлического гаража.
- `/garazhi-iz-sendvich-panelej/` — панели, утепление и эксплуатация.
- `/garazhi-na-dve-mashiny/` — планировка, проёмы и хранение.
- `/navesy-dlya-avtomobilej/` — размещение навеса, опоры и кровля.

Контент хранится в `lib/landing-pages.ts`, шаблон — в `app/[slug]/page.tsx`.
Новая запись автоматически добавляется в статическую генерацию, карту сайта
и блок ссылок. FAQ в HTML и JSON-LD формируется из одного источника.
Для навесов калькулятор сразу открывается в соответствующем режиме.
Тексты написаны для этих страниц; процент уникальности во внешнем сервисе
не проверялся. Проверки посадочных: `npx playwright test landings --project=e2e`.

- Metadata API: title, description, canonical, Open Graph, Twitter Card, geo
- JSON-LD: `HomeAndConstructionBusiness`, `WebSite`, `WebPage`, `FAQPage`, Offer + `PriceSpecification.minPrice` («цены от»)
- `robots.txt` и `sitemap.xml` (включая изображения)

## Доступность и no-JS

Без JavaScript доступны контент, контакты и SEO в пререндеренном HTML. Интерактив (меню, lightbox, калькулятор, тема) деградирует, но не ломает страницу.
