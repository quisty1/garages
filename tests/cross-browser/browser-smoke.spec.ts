import { expect, test } from '@playwright/test';

test('core interactions work outside Chromium', async ({ page }) => {
  await page.goto('/');

  await expect(page.locator('h1')).toContainText('Металлические гаражи');
  await page.locator('select[name="type"]').selectOption('canopies');
  await expect(page.locator('[data-calculator-price]')).toContainText('₽');

  await page.setViewportSize({ width: 390, height: 844 });
  await page.locator('[data-nav-toggle]').click();
  await expect(page.locator('[data-nav]')).toHaveClass(/is-open/);
});
