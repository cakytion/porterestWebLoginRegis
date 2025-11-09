import { chromium } from '@playwright/test';

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  await page.goto('http://localhost:5173');
  await page.getByText('Sign in with Google', { exact: false }).click();

  console.log('Complete the Google sign-in in the opened browser. After redirect back to app, press Enter here to save storage.');
  process.stdin.setRawMode(true);
  await new Promise(resolve => process.stdin.once('data', resolve));

  await context.storageState({ path: 'tests/e2e/authStorage.json' });
  console.log('Saved storage state to tests/e2e/authStorage.json');

  await browser.close();
  process.exit(0);
})();

