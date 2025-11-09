import { test, expect } from '@playwright/test';

test.use({ storageState: 'tests/e2e/authStorage.json' });
test('user logs in and sees dashboard', async ({ page }) => {
  await page.goto('http://localhost:5173/dashboard');
  await expect(page.locator('h1')).toContainText('Dashboard');
});

