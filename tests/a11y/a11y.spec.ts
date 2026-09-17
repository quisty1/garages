// axe-core accessibility checks across theme × viewport combinations.

import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('accessibility', () => {
  for (const { name, theme, width, height } of [
    { name: 'desktop dark', theme: 'dark', width: 1440, height: 900 },
    { name: 'desktop light', theme: 'light', width: 1440, height: 900 },
    { name: 'mobile dark', theme: 'dark', width: 390, height: 844 },
    { name: 'mobile light', theme: 'light', width: 390, height: 844 },
  ] as const) {
    test(`${name} has no WCAG A/AA axe violations`, async ({ page }) => {
      await page.setViewportSize({ width, height });
      await page.addInitScript((value) => {
        localStorage.setItem('mm33-theme', value);
      }, theme);
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.goto('/');
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa'])
        .analyze();
      expect(results.violations).toEqual([]);
    });
  }

  test('keyboard can open FAQ and close lightbox with Escape', async ({
    page,
  }) => {
    await page.goto('/#faq');
    await page.locator('.faq-item__question').first().focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('.faq-item').first()).toHaveClass(/is-open/);

    await page.goto('/#garages');
    await page.locator('[data-carousel="garages"] .slide__img').first().focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('.lightbox')).toHaveClass(/is-open/);
    await page.keyboard.press('Escape');
    await expect(page.locator('.lightbox')).not.toHaveClass(/is-open/);
    await expect(page.locator('body')).not.toHaveClass(/lightbox-open/);
  });
});
