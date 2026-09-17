// E2E: each SEO landing page content, calculator, FAQ, and basic a11y.
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { landingPages, landingHref } from '../../lib/landing-pages';

for (const landing of landingPages) {
  test(`${landing.slug}: static SEO, content and FAQ`, async ({
    browser,
    request,
  }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    const response = await page.goto(landingHref(landing));
    expect(response?.status()).toBe(200);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('h1')).toHaveText(landing.h1);
    await expect(page).toHaveTitle(landing.title);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      'content',
      landing.description,
    );
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      `https://metallmontage33.ru${landingHref(landing)}`,
    );
    const schema = JSON.parse(
      await page.locator('script[type="application/ld+json"]').innerText(),
    );
    const faq = schema['@graph'].filter(
      (item: Record<string, unknown>) => item['@type'] === 'FAQPage',
    );
    expect(faq).toHaveLength(1);
    expect(
      faq[0].mainEntity.map((item: { name: string }) => item.name),
    ).toEqual(landing.faq.map((item) => item.q));
    await page.locator('.faq-item summary').first().click();
    await expect(page.locator('.faq-item__answer').first()).toBeVisible();
    expect(await (await request.get('/sitemap.xml')).text()).toContain(
      landingHref(landing),
    );
    await context.close();
  });
}

test('landing navigation, mobile layout, calculator and accessibility', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.locator('#directions a[href="/navesy-dlya-avtomobilej/"]').click();
  await expect(page).toHaveURL(/\/navesy-dlya-avtomobilej\/$/);
  await expect(page.locator('select[name="type"]')).toHaveValue('canopies');
  await page.locator('.faq-item summary').first().click();
  await expect(page.locator('.faq-item').first()).toHaveAttribute('open', '');
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa'])
    .analyze();
  expect(results.violations).toEqual([]);
  await page.screenshot({
    path: 'test-results/landing-mobile.png',
    fullPage: true,
  });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/garazhi-iz-sendvich-panelej/');
  await page.screenshot({ path: 'test-results/landing-desktop.png' });
});

test('offline reload preserves the visited landing', async ({
  page,
  context,
}) => {
  const cdp = await context.newCDPSession(page);
  await cdp.send('Network.setCacheDisabled', { cacheDisabled: true });

  await page.goto('/navesy-dlya-avtomobilej/');
  await page.waitForFunction(() => navigator.serviceWorker?.controller);
  await page.reload();
  await page.waitForFunction(async () => !!(await caches.match(location.href)));
  await page.waitForFunction(async () => {
    const keys = await caches.keys();
    const precache = keys.find((key) => key.includes('precache-'));
    if (!precache) return false;
    const cache = await caches.open(precache);
    const entries = await cache.keys();
    return entries.some(
      (req) => req.url.includes('/_next/static/') && req.url.endsWith('.js'),
    );
  });

  await context.setOffline(true);
  try {
    await page.reload({ waitUntil: 'domcontentloaded' });
    await expect(page.locator('h1')).toHaveText(
      'Металлические навесы для автомобилей',
    );
    await expect
      .poll(() =>
        page.evaluate(() => document.documentElement.classList.contains('js')),
      )
      .toBe(true);
    const bodyColor = await page.evaluate(
      () => getComputedStyle(document.body).color,
    );
    expect(bodyColor).not.toBe('');
    expect(bodyColor).not.toBe('rgba(0, 0, 0, 0)');
    await page.locator('.faq-item summary').first().click();
    await expect(page.locator('.faq-item').first()).toHaveAttribute('open', '');
  } finally {
    await context.setOffline(false);
  }
});
