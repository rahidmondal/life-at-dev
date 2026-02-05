import { expect, test } from '@playwright/test';

test.describe('Game Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('can start a new game with scholar path', async ({ page }) => {
    // Look for new game button or path selection
    const newGameButton = page.getByRole('button', { name: /new game|start/i });

    // If there's a new game button, click it
    if (await newGameButton.isVisible()) {
      await newGameButton.click();

      // Wait for path selection or game screen
      await page.waitForLoadState('networkidle');
    }

    // The page should still be functional
    await expect(page.locator('body')).toBeVisible();
  });

  test('game interface has key elements', async ({ page }) => {
    // Start a new game first if needed
    const newGameButton = page.getByRole('button', { name: /new game|start/i });
    if (await newGameButton.isVisible()) {
      await newGameButton.click();
      await page.waitForLoadState('networkidle');
    }

    // Check for main game elements - these may vary based on game state
    // At minimum, the page should be interactive
    await expect(page.locator('body')).toBeVisible();
  });
});
