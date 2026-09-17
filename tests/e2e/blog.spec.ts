// E2E: blog index and each post render with expected titles and structure.
import { test, expect } from '@playwright/test';
import { blogHref, getAllPosts } from '../../lib/blog';

const posts = getAllPosts();

test('blog index lists articles', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  const response = await page.goto('/blog/');
  expect(response?.status()).toBe(200);
  await expect(page.locator('h1')).toHaveText('Блог Металл Монтаж 33');
  for (const post of posts) {
    await expect(page.locator(`a[href="${blogHref(post)}"]`)).toBeVisible();
  }
  await context.close();
});

test('blog article has author, SEO and related links', async ({
  browser,
  request,
}) => {
  const post = posts[0];
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  const response = await page.goto(blogHref(post));
  expect(response?.status()).toBe(200);
  await expect(page.locator('h1')).toHaveText(post.title);
  await expect(page.getByText('Металл Монтаж 33').first()).toBeVisible();
  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    'content',
    post.description,
  );
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    'href',
    `https://metallmontage33.ru${blogHref(post)}`,
  );
  const schema = JSON.parse(
    await page.locator('script[type="application/ld+json"]').innerText(),
  );
  const article = schema['@graph'].find(
    (item: Record<string, unknown>) => item['@type'] === 'BlogPosting',
  );
  expect(article?.headline).toBe(post.title);
  expect(article?.author?.name).toBe('Металл Монтаж 33');
  expect(await (await request.get('/sitemap.xml')).text()).toContain(
    blogHref(post),
  );
  await context.close();
});
