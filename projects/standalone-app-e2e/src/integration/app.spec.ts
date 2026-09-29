import { expect, test } from '@playwright/test';
import { getGreeting, loadFeature } from '../support/app.po';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('should display welcome message', async ({ page }) => {
  await expect(getGreeting(page)).toContainText('Welcome ngrx-standalone-app');
  await loadFeature(page);
  await expect(page.locator('body')).toContainText(
    'Feature State: { "loaded": true }'
  );
});
