// Playwright e2e smoke tests against the static export served from out/.

import { test, expect } from '@playwright/test';

test.describe('main page e2e', () => {
  test('loads hero and key CTAs', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toContainText('Металлические гаражи');
    await expect(
      page.locator('[data-analytics-goal="cta_calculate"]').first(),
    ).toBeVisible();
    await expect(page.locator('a[href^="tel:"]').first()).toBeVisible();
  });

  test('spec ticker moves continuously', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.goto('/');
    const track = page.locator('.spec-ticker__track');
    await expect(track).toHaveCSS('animation-name', 'spec-marquee');
    await expect(track).toHaveCSS('animation-play-state', 'running');
    const before = await track.evaluate((el) => getComputedStyle(el).transform);
    await page.waitForTimeout(150);
    const after = await track.evaluate((el) => getComputedStyle(el).transform);
    expect(after).not.toBe(before);
    await expect(page.locator('.spec-ticker').getByRole('button')).toHaveCount(
      0,
    );
  });

  test('spec ticker shows every item without motion in reduced motion', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 320, height: 700 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    const ticker = page.locator('.spec-ticker');
    await expect(page.locator('.spec-ticker__track')).toHaveCSS(
      'animation-name',
      'none',
    );
    await expect(
      ticker.locator('.spec-ticker__group').first().locator('span'),
    ).toHaveCount(5);
    await expect(ticker.getByRole('button')).toHaveCount(0);
    const visible = await ticker
      .locator('.spec-ticker__group')
      .first()
      .locator('span')
      .evaluateAll((items) =>
        items.every((item) => {
          const box = item.getBoundingClientRect();
          return (
            box.width > 0 && box.left >= 0 && box.right <= window.innerWidth
          );
        }),
      );
    expect(visible).toBe(true);
  });

  test('calculator updates range', async ({ page }) => {
    await page.goto('/#calculator');
    const price = page.locator('[data-calculator-price]');
    const before = await price.textContent();
    await page.locator('select[name="type"]').selectOption('canopies');
    await expect(price).not.toHaveText(before || '');
  });

  test('calculator explains invalid dimensions without quoting a price', async ({
    page,
  }) => {
    await page.goto('/#calculator');
    const length = page.locator('input[name="length"]');
    await length.fill('1');
    await expect(length).toHaveAttribute('aria-invalid', 'true');
    await expect(page.locator('#calculator-length-error')).toContainText(
      'от 3 до 30',
    );
    await expect(page.locator('[data-calculator-price]')).toBeEmpty();
    await expect(page.locator('[data-calculator-result]')).toContainText(
      'Проверьте размеры',
    );
    await expect(page.locator('[data-calculator-result] .btn')).toHaveCount(0);

    await length.fill('3.2');
    await expect(page.locator('#calculator-length-error')).toContainText(
      '0,5 м',
    );
    await length.fill('');
    await expect(page.locator('#calculator-length-error')).toContainText(
      'Укажите длину',
    );
    await length.fill('6');
    await expect(length).not.toHaveAttribute('aria-invalid', 'true');
    await expect(page.locator('[data-calculator-price]')).toContainText('₽');
  });

  test('quick lightbox reopen keeps dialog and page lock consistent', async ({
    page,
  }) => {
    await page.goto('/#garages');
    const opener = page
      .locator('[data-carousel="garages"] .slide__img')
      .first();
    await opener.focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('.lightbox')).toHaveClass(/is-open/);
    await page.keyboard.press('Escape');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(350);
    await expect(page.locator('.lightbox')).toHaveClass(/is-open/);
    await expect(page.locator('body')).toHaveClass(/lightbox-open/);
    await expect(page.locator('main')).toHaveAttribute('inert', '');
    await page.keyboard.press('Escape');
    await expect(page.locator('body')).not.toHaveClass(/lightbox-open/);
    await expect(page.locator('main')).not.toHaveAttribute('inert');
    await expect(opener).toBeFocused();
  });

  test('theme toggle switches data-theme', async ({ page }) => {
    await page.goto('/');
    const html = page.locator('html');
    const before = await html.getAttribute('data-theme');
    await page.locator('[data-theme-toggle]').click();
    await expect(html).not.toHaveAttribute('data-theme', before || '');
  });

  test('mobile menu opens and closes with Escape', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    await page.locator('[data-nav-toggle]').click();
    await expect(page.locator('[data-nav]')).toHaveClass(/is-open/);
    await page.keyboard.press('Escape');
    await expect(page.locator('[data-nav]')).not.toHaveClass(/is-open/);
    await expect(page.locator('body')).not.toHaveClass(/menu-open/);
  });

  test('services dropdown lists landing pages', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    const services = page.locator('[data-nav-dropdown="services"]');
    await services.hover();
    await expect(page.locator('#nav-services')).toBeVisible();
    await expect(
      page.locator('#nav-services a[href="/metallicheskie-garazhi/"]'),
    ).toBeVisible();

    const catalog = page.locator('[data-nav-dropdown="catalog"]');
    await catalog.hover();
    await expect(page.locator('#nav-catalog')).toBeVisible();
    await expect(
      page.locator('#nav-catalog a[href="/catalog/garazhi/"]'),
    ).toBeVisible();

    await services.hover();
    await page
      .locator('#nav-services a[href="/navesy-dlya-avtomobilej/"]')
      .click();
    await expect(page).toHaveURL(/\/navesy-dlya-avtomobilej\/?$/);
  });

  test('mobile services accordion expands', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    await page.locator('[data-nav-toggle]').click();
    await page
      .locator('[data-nav-dropdown="services"] .nav__chevron-btn')
      .click();
    await expect(page.locator('[data-nav-dropdown="services"]')).toHaveClass(
      /is-open/,
    );
    await expect(
      page.locator('#nav-services a[href="/garazhi-na-dve-mashiny/"]'),
    ).toBeVisible();
  });

  test('FAQ accordion opens', async ({ page }) => {
    await page.goto('/#faq');
    const first = page.locator('.faq-item').first();
    await first.locator('summary').click();
    await expect(first).toHaveClass(/is-open/);
  });

  for (const catalog of ['garages', 'canopies']) {
    test(`${catalog} lightbox opens full-size photo and closes with Escape`, async ({
      page,
    }) => {
      await page.goto(`/#${catalog}`);
      const firstPhoto = page
        .locator(`[data-carousel="${catalog}"] .slide__img`)
        .first();
      await expect(firstPhoto.locator('img')).toHaveAttribute(
        'srcset',
        /1024w.*1536w/,
      );
      await firstPhoto.click();
      const lightbox = page.locator('.lightbox');
      await expect(lightbox).toHaveClass(/is-open/);
      await expect(lightbox.locator('img')).toHaveAttribute(
        'src',
        /\/assets\/(garage|canopy)-[^/]+\.webp$/,
      );
      await expect
        .poll(() =>
          lightbox
            .locator('img')
            .evaluate((img: HTMLImageElement) => img.naturalWidth),
        )
        .toBe(1536);
      await page.keyboard.press('Escape');
      await expect(lightbox).not.toHaveClass(/is-open/);
      await expect(page.locator('body')).not.toHaveClass(/lightbox-open/);
    });
  }

  test('composition lightbox opens photo and closes with Escape', async ({
    page,
  }) => {
    await page.goto('/#composition');
    const firstPhoto = page.locator('#composition .slide__img').first();
    await firstPhoto.click();
    const lightbox = page.locator('.lightbox');
    await expect(lightbox).toHaveClass(/is-open/);
    await expect(lightbox.locator('img')).toHaveAttribute(
      'src',
      /\/assets\/composition-[^/]+\.webp$/,
    );
    await page.keyboard.press('Escape');
    await expect(lightbox).not.toHaveClass(/is-open/);
    await expect(page.locator('body')).not.toHaveClass(/lightbox-open/);
  });

  test('critical contact links exist', async ({ page }) => {
    await page.goto('/#contact');
    await expect(page.locator('#contact a[href^="tel:"]')).toHaveCount(2);
    await expect(page.locator('#contact-email-tile')).toHaveAttribute(
      'href',
      /mailto:/,
    );
    await expect(
      page.locator('#contact [data-messengers] .messenger-link').first(),
    ).toHaveAttribute('href', /^https?:\/\//);
  });

  test('copies requisites as readable multiline text', async ({
    context,
    page,
  }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/#contact');
    await page.getByRole('button', { name: 'Скопировать реквизиты' }).click();
    await expect(page.getByRole('status')).toHaveText(
      'Скопировано в буфер обмена',
    );

    const copied = await page.evaluate(() => navigator.clipboard.readText());
    expect(copied.replace(/\r\n/g, '\n').split('\n')).toEqual([
      'Реквизиты компании',
      await page.locator('#requisites-name').innerText(),
      `ОГРНИП ${await page.locator('#requisites-ogrnip').innerText()}`,
      `ИНН ${await page.locator('#requisites-inn').innerText()}`,
      'Банковские реквизиты',
      `Банк ${await page.locator('#requisites-bank').innerText()}`,
      `Р/с ${await page.locator('#requisites-account').innerText()}`,
      `К/с ${await page.locator('#requisites-corr-account').innerText()}`,
      `БИК ${await page.locator('#requisites-bic').innerText()}`,
    ]);
  });

  test('reloads the application shell while offline', async ({
    context,
    page,
  }) => {
    const cdp = await context.newCDPSession(page);
    await cdp.send('Network.setCacheDisabled', { cacheDisabled: true });

    await page.goto('/');
    await page.waitForFunction(
      () => navigator.serviceWorker?.controller,
      null,
      { timeout: 15_000 },
    );
    await page.waitForFunction(
      async () => {
        const keys = await caches.keys();
        const precache = keys.find((key) => key.includes('precache-'));
        if (!precache) return false;
        const cache = await caches.open(precache);
        const entries = await cache.keys();
        const hasJs = entries.some(
          (req) =>
            req.url.includes('/_next/static/') && req.url.endsWith('.js'),
        );
        const hasCss = entries.some(
          (req) =>
            req.url.includes('/_next/static/') && req.url.endsWith('.css'),
        );
        return hasJs && hasCss;
      },
      null,
      { timeout: 20_000 },
    );

    await context.setOffline(true);
    try {
      await page.reload({ waitUntil: 'domcontentloaded' });
      await expect(page.locator('h1')).toContainText('Металлические гаражи');
      await expect
        .poll(() =>
          page.evaluate(() =>
            document.documentElement.classList.contains('js'),
          ),
        )
        .toBe(true);
      const bodyColor = await page.evaluate(
        () => getComputedStyle(document.body).color,
      );
      expect(bodyColor).not.toBe('');
      expect(bodyColor).not.toBe('rgba(0, 0, 0, 0)');

      const price = page.locator('[data-calculator-price]');
      const before = await price.textContent();
      await page.locator('select[name="type"]').selectOption('canopies');
      await expect(price).not.toHaveText(before || '');
    } finally {
      await context.setOffline(false);
    }
  });

  test('analytics goals are dispatched via ym stub', async ({ page }) => {
    await page.route('https://mc.yandex.ru/metrika/tag.js', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/javascript',
        body: '',
      });
    });
    await page.addInitScript(() => {
      const calls: unknown[][] = [];
      (
        window as unknown as {
          ym: (...args: unknown[]) => void;
          __ymCalls: unknown[][];
        }
      ).ym = (...args: unknown[]) => {
        calls.push(args);
      };
      (window as unknown as { __ymCalls: unknown[][] }).__ymCalls = calls;
    });
    await page.goto('http://metallmontage33.ru:4173/');

    await page.locator('[data-analytics-goal="cta_calculate"]').first().click();

    const popupPromise = page.waitForEvent('popup');
    await page.locator('[data-footer-messengers] a').first().click();
    await (await popupPromise).close();

    await page.locator('.footer-bottom__links a[href="/blog/"]').click();
    await expect(page.locator('h1')).toContainText('Блог');

    await page
      .locator('a[href="/blog/kak-vybrat-metallicheskij-garazh/"]')
      .first()
      .click();
    await expect(page.locator('h1')).toContainText('металлический гараж');

    const calls = await page.evaluate(
      () => (window as unknown as { __ymCalls: unknown[][] }).__ymCalls,
    );
    const inits = calls.filter((call) => call[1] === 'init');
    const hits = calls.filter((call) => call[1] === 'hit');
    expect(inits).toHaveLength(1);
    expect(hits).toHaveLength(2);
    expect(calls).toContainEqual([
      110290656,
      'reachGoal',
      'cta_calculate',
      { placement: 'hero' },
    ]);
    expect(calls).toContainEqual([
      110290656,
      'reachGoal',
      'messenger_click',
      { placement: 'footer', messenger: 'MAX' },
    ]);
  });

  test('catalog contact CTA sends cta_contact', async ({ page }) => {
    await page.route('https://mc.yandex.ru/metrika/tag.js', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/javascript',
        body: '',
      });
    });
    await page.addInitScript(() => {
      const calls: unknown[][] = [];
      (
        window as unknown as {
          ym: (...args: unknown[]) => void;
          __ymCalls: unknown[][];
        }
      ).ym = (...args: unknown[]) => {
        calls.push(args);
      };
      (window as unknown as { __ymCalls: unknown[][] }).__ymCalls = calls;
    });
    await page.goto('http://metallmontage33.ru:4173/catalog/garazhi/');
    await page.locator('[data-analytics-goal="cta_contact"]').first().click();
    const calls = await page.evaluate(
      () => (window as unknown as { __ymCalls: unknown[][] }).__ymCalls,
    );
    expect(calls).toContainEqual([
      110290656,
      'reachGoal',
      'cta_contact',
      { placement: 'content' },
    ]);
  });
});
