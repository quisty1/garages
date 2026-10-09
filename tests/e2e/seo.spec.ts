import { test, expect } from '@playwright/test';
import sitemapEntries from '../../app/sitemap';

test('every sitemap page exposes complete SEO and social previews without JS', async ({
  browser,
  request,
}) => {
  const sitemap = await request.get('/sitemap.xml');
  const urls = [...(await sitemap.text()).matchAll(/<loc>(.*?)<\/loc>/g)].map(
    (match) => new URL(match[1]),
  );
  expect(urls.map((url) => url.href).sort()).toEqual(
    sitemapEntries()
      .map((entry) => entry.url)
      .sort(),
  );
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  });
  const page = await context.newPage();
  const titles = new Set<string>();
  const descriptions = new Set<string>();
  for (const url of urls) {
    const response = await page.goto(url.pathname);
    expect(response?.status(), url.pathname).toBe(200);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('h1')).toBeVisible();
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
      url.pathname,
    ).toBeLessThanOrEqual(390);
    await expect(page.locator('head link[rel="canonical"]')).toHaveAttribute(
      'href',
      url.href,
    );
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      'content',
      /\bindex, follow\b/,
    );
    for (const selector of [
      'meta[property="og:image"]',
      'meta[name="twitter:image"]',
    ]) {
      await expect(
        page.locator(selector),
        `${url.pathname}: ${selector}`,
      ).toHaveCount(1);
      const image = await page.locator(selector).getAttribute('content');
      expect(image, `${url.pathname}: ${selector}`).toMatch(
        /^https:\/\/metallmontage33\.ru\/assets\//,
      );
      expect((await request.get(new URL(image!).pathname)).status()).toBe(200);
    }
    const title = await page.title();
    const description = await page
      .locator('meta[name="description"]')
      .getAttribute('content');
    expect(title.length).toBeGreaterThan(0);
    expect(description?.length).toBeGreaterThan(0);
    expect(titles.has(title), `duplicate title: ${url.pathname}`).toBe(false);
    expect(
      descriptions.has(description!),
      `duplicate description: ${url.pathname}`,
    ).toBe(false);
    titles.add(title);
    descriptions.add(description!);
  }
  await context.close();
});

test('error documents cannot claim the homepage canonical', async ({
  page,
}) => {
  await page.goto('/404.html');
  await expect(page.locator('meta[name="robots"]').last()).toHaveAttribute(
    'content',
    /noindex/,
  );
  await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
});

test('landing and article first images offer a medium resolution for mobile screens', async ({
  page,
}) => {
  for (const [path, selector] of [
    ['/garazhi-iz-sendvich-panelej/', '.landing-hero img'],
    ['/blog/kak-vybrat-metallicheskij-garazh/', '.blog-article__cover img'],
  ]) {
    await page.goto(path);
    const homepagePrefetch = page.waitForRequest(
      (request) => new URL(request.url()).pathname === '/__next.__PAGE__.txt',
      { timeout: 2500 },
    );
    await page.getByRole('link', { name: 'Главная', exact: true }).hover();
    await expect(homepagePrefetch).rejects.toThrow(/Timeout/);
    const image = page.locator(selector).first();
    await expect(image).toHaveAttribute('srcset', /\S+ 960w/);
    await expect(image).toHaveAttribute('fetchpriority', 'high');
  }
});
