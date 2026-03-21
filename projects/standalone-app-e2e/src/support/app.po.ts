import type { Locator, Page } from '@playwright/test';

export const getGreeting = (page: Page): Locator => page.locator('h1');

export const loadFeature = async (page: Page): Promise<void> => {
  await page.locator('a').click();
};
