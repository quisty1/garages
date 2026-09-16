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
| Тесты     | Vitest, Testing Library, Playwright, axe-core            |

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
| `npm run typecheck`                 | `tsc --noEmit`                             |
| `npm run lint`                      | ESLint                                     |
| `npm run test`                      | Unit + component (Vitest)                  |
| `npm run test:e2e`                  | Playwright E2E (нужен `out/`)              |
| `npm run test:a11y`                 | axe + keyboard checks                      |
| `npm run test:visual`               | Visual regression screenshots              |
| `npm run validate`                  | Проверки содержимого `out/`                |
| `npm run ci`                        | typecheck + lint + test + build + validate |

## Локальный запуск

Нужен Node.js 20.9 или новее.

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

После `build` скрипт `postbuild` дополняет SW списком shell-файлов из `out/_next`.

## Аналитика (Yandex Metrica)

Счётчик загружается только на `metallmontage33.ru` / `www.metallmontage33.ru`.

Goal IDs (без переименования):

- `cta_calculate`
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
3. Playwright e2e и accessibility-проверки (диагностические: сбой выводит предупреждение, но не блокирует деплой)
4. `lftp mirror` содержимого **`out/`** в корень хостинга

Сборка, typecheck, lint, unit-тесты и проверка `out/` остаются обязательными. FTP повторяет временно неудачные соединения до пяти раз.

### GitHub Secrets (имена)

- `TIMEWEB_FTP_SERVER`
- `TIMEWEB_FTP_USERNAME`
- `TIMEWEB_FTP_PASSWORD`

Значения секретов в репозиторий не коммитятся.

## SEO

- Metadata API: title, description, canonical, Open Graph, Twitter Card, geo
- JSON-LD: `HomeAndConstructionBusiness`, `WebSite`, `WebPage`, `FAQPage`, Offer + `PriceSpecification.minPrice` («цены от»)
- `robots.txt` и `sitemap.xml` (включая изображения)

## Доступность и no-JS

Без JavaScript доступны контент, контакты и SEO в пререндеренном HTML. Интерактив (меню, lightbox, калькулятор, тема) деградирует, но не ломает страницу.
