// Visual regression screenshots for hero and mobile menu states.

import { test, expect } from '@playwright/test';

test.describe('visual regression', () => {
  test('desktop dark hero', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.addInitScript(() => localStorage.setItem('mm33-theme', 'dark'));
    await page.goto('/');
    await expect(page).toHaveScreenshot('desktop-dark.png', {
      fullPage: false,
      maxDiffPixelRatio: 0.02,
    });
  });

  test('desktop light hero', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.addInitScript(() => localStorage.setItem('mm33-theme', 'light'));
    await page.goto('/');
    await expect(page).toHaveScreenshot('desktop-light.png', {
      fullPage: false,
      maxDiffPixelRatio: 0.02,
    });
  });

  test('mobile dark', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.addInitScript(() => localStorage.setItem('mm33-theme', 'dark'));
    await page.goto('/');
    await expect(page).toHaveScreenshot('mobile-dark.png', {
      fullPage: false,
      maxDiffPixelRatio: 0.02,
    });
  });

  test('mobile menu open', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.addInitScript(() => localStorage.setItem('mm33-theme', 'dark'));
    await page.goto('/');
    await page.locator('[data-nav-toggle]').click();
    await expect(page).toHaveScreenshot('mobile-menu.png', {
      fullPage: false,
      maxDiffPixelRatio: 0.02,
    });
  });

  test('calculator section', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.addInitScript(() => localStorage.setItem('mm33-theme', 'dark'));
    await page.goto('/#calculator');
    await expect(page.locator('#calculator')).toHaveScreenshot('calculator.png', {
      maxDiffPixelRatio: 0.02,
    });
  });
});
