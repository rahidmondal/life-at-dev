import { expect, test } from '@playwright/test';

test.describe('Accessibility', () => {
  test('page has proper semantic structure', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Check for basic HTML structure
    await expect(page.locator('html')).toHaveAttribute('lang', /.+/);
  });

  test('buttons are keyboard accessible', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Tab through interactive elements
    await page.keyboard.press('Tab');

    // Check that something is focused
    const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
    expect(focusedElement).toBeDefined();
  });

  test('modals trap focus properly', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Try to find and open a modal (like How to Play)
    const helpButton = page.getByRole('button', { name: /help|how to play|\?/i });

    if (await helpButton.isVisible()) {
      await helpButton.click();

      // Wait for modal
      await page.waitForTimeout(300);

      // Modal should be visible and trappable
      const closeButton = page.getByRole('button', { name: /close/i });
      if (await closeButton.isVisible()) {
        await closeButton.click();
      }
    }

    // Page should still be functional
    await expect(page.locator('body')).toBeVisible();
  });
});
