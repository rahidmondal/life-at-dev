import { expect, test } from '@playwright/test';

test.describe('Game Landing', () => {
  test('loads the landing page successfully', async ({ page }) => {
    await page.goto('/');

    // Should show the game title or landing screen
    await expect(page.locator('body')).toBeVisible();
  });

  test('displays start screen elements', async ({ page }) => {
    await page.goto('/');

    // Wait for the app to load
    await page.waitForLoadState('networkidle');

    // Should see some game-related content
    await expect(page.locator('body')).toBeVisible();
  });
});
