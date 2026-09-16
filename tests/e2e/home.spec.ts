// Playwright e2e smoke tests against the static export served from out/.

import { test, expect } from '@playwright/test';

test.describe('main page e2e', () => {
  test('loads hero and key CTAs', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toContainText('Металлические гаражи');
    await expect(page.locator('[data-cta]').first()).toBeVisible();
    await expect(page.locator('a[href^="tel:"]').first()).toBeVisible();
  });

  test('calculator updates range', async ({ page }) => {
    await page.goto('/#calculator');
    const price = page.locator('[data-calculator-price]');
    const before = await price.textContent();
    await page.locator('select[name="type"]').selectOption('canopies');
    await expect(price).not.toHaveText(before || '');
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
  });

  test('FAQ accordion opens', async ({ page }) => {
    await page.goto('/#faq');
    const first = page.locator('.faq-item').first();
    await first.locator('summary').click();
    await expect(first).toHaveClass(/is-open/);
  });

  test('lightbox opens and closes with Escape', async ({ page }) => {
    await page.goto('/#garages');
    await page.locator('[data-carousel="garages"] .slide__img').first().click();
    const lightbox = page.locator('.lightbox');
    await expect(lightbox).toHaveClass(/is-open/);
    await page.keyboard.press('Escape');
    await expect(lightbox).not.toHaveClass(/is-open/);
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
    await page.goto('/');
    await page.waitForFunction(
      () => navigator.serviceWorker?.controller,
      null,
      {
        timeout: 15_000,
      },
    );

    await context.setOffline(true);
    try {
      await page.reload();
      await expect(page.locator('h1')).toContainText('Металлические гаражи');
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
    await page.locator('[data-cta]').first().click();
    const calls = await page.evaluate(
      () => (window as unknown as { __ymCalls: unknown[][] }).__ymCalls,
    );
    expect(calls).toContainEqual([
      110290656,
      'reachGoal',
      'cta_calculate',
      { placement: 'hero' },
    ]);
  });
});
