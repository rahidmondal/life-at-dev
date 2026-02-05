import { expect, test } from '@playwright/test';

test.describe('Navigation and UI', () => {
  test('page has proper title', async ({ page }) => {
    await page.goto('/');

    // Check page title exists
    await expect(page).toHaveTitle(/.+/);
  });

  test('page is responsive', async ({ page }) => {
    await page.goto('/');

    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await expect(page.locator('body')).toBeVisible();

    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator('body')).toBeVisible();
  });

  test('no console errors on load', async ({ page }) => {
    const consoleErrors: string[] = [];

    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Filter out known acceptable errors (e.g., third-party script failures)
    const criticalErrors = consoleErrors.filter(
      error => !error.includes('favicon') && !error.includes('manifest') && !error.includes('Failed to load resource'),
    );

    expect(criticalErrors).toHaveLength(0);
  });
});
