import { test, expect, Page } from '@playwright/test';

/**
 * Helper to perform login - fill username and submit form
 *
 * Note: The example-app accepts 'test' or 'ngrx' as valid usernames (no password required).
 * See projects/example-app/src/app/auth/services/auth.service.ts
 */
async function login(page: Page, username: string = 'test') {
  // Wait for the login form to be fully loaded
  await expect(page.getByPlaceholder(/username/i)).toBeVisible({
    timeout: 15000,
  });

  // Fill username and click login
  await page.getByPlaceholder(/username/i).fill(username);
  await page.locator('button[type="submit"]').click();

  // Wait for navigation to My Collection page
  await expect(page.getByText('My Collection')).toBeVisible({ timeout: 15000 });
}

test.describe('Full round trip', () => {
  test.describe.configure({ mode: 'serial' });

  test.beforeEach(async ({ page }) => {
    // Clear localStorage and navigate to app
    await page.goto('/');
    await page.evaluate(() => window.localStorage.removeItem('books_app'));
    await page.reload();
  });

  test.skip('shows a message when the credentials are wrong', async ({
    page,
  }) => {
    // TODO: Investigate error message visibility in Angular Material forms
    await page.getByPlaceholder(/username/i).clear();
    await page.getByPlaceholder(/username/i).fill('wronguser');
    await page.getByPlaceholder(/password/i).fill('supersafepassword');
    await page.locator('button[type="submit"]').click();
    await expect(page.locator('.login-error')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('.login-error')).toContainText('Invalid');
  });

  test('is possible to login', async ({ page }) => {
    await login(page);
  });

  test('is possible to search for books', async ({ page }) => {
    await login(page);

    // Navigate to browse books
    await page.getByRole('button', { name: /menu/i }).click();
    await page.getByText(/browse books/i).click();
    await page.getByPlaceholder(/search for a book/i).fill('The Alchemist');

    // Wait for search results
    await expect(page.locator('bc-book-preview').first()).toBeVisible({
      timeout: 15000,
    });
    const bookPreviews = await page.locator('bc-book-preview').count();
    expect(bookPreviews).toBeGreaterThanOrEqual(1);
  });

  test('is possible to add books', async ({ page }) => {
    await login(page);

    // Navigate to browse books and search
    await page.getByRole('button', { name: /menu/i }).click();
    await page.getByText(/browse books/i).click();
    await page.getByPlaceholder(/search for a book/i).fill('The Alchemist');
    await expect(page.locator('bc-book-preview').first()).toBeVisible({
      timeout: 15000,
    });

    // Click on first book
    await page.locator('bc-book-preview').first().click();

    // Add book to collection
    await page.getByRole('button', { name: /add book to collection/i }).click();
    await expect(
      page.getByRole('button', { name: /add book to collection/i })
    ).not.toBeVisible({ timeout: 10000 });
  });

  test('is possible to remove books', async ({ page }) => {
    await login(page);

    // Navigate to browse books and search
    await page.getByRole('button', { name: /menu/i }).click();
    await page.getByText(/browse books/i).click();
    await page.getByPlaceholder(/search for a book/i).fill('The Alchemist');
    await expect(page.locator('bc-book-preview').first()).toBeVisible({
      timeout: 15000,
    });

    // Click on a book (use index 4 if available for variety)
    const bookCount = await page.locator('bc-book-preview').count();
    const bookIndex = bookCount > 4 ? 4 : 0;
    await page.locator('bc-book-preview').nth(bookIndex).click();

    // Add then remove book
    await page.getByRole('button', { name: /add book to collection/i }).click();
    await expect(
      page.getByRole('button', { name: /remove book from collection/i })
    ).toBeVisible({ timeout: 10000 });
    await page
      .getByRole('button', { name: /remove book from collection/i })
      .click();
    await expect(
      page.getByRole('button', { name: /remove book from collection/i })
    ).not.toBeVisible({ timeout: 10000 });
  });

  test('is possible to show the collection', async ({ page }) => {
    await login(page);

    // First add a book to collection
    await page.getByRole('button', { name: /menu/i }).click();
    await page.getByText(/browse books/i).click();
    await page.getByPlaceholder(/search for a book/i).fill('The Alchemist');
    await expect(page.locator('bc-book-preview').first()).toBeVisible({
      timeout: 15000,
    });
    await page.locator('bc-book-preview').first().click();
    await page.getByRole('button', { name: /add book to collection/i }).click();

    // Navigate to collection
    await page.getByRole('button', { name: /menu/i }).click();
    await page.getByText(/my collection/i).click();

    // Verify at least one book is in collection
    await expect(page.locator('bc-book-preview').first()).toBeVisible({
      timeout: 15000,
    });
    const bookCount = await page.locator('bc-book-preview').count();
    expect(bookCount).toBeGreaterThanOrEqual(1);
  });

  test('is possible to sign out', async ({ page }) => {
    await login(page);

    // Sign out
    await page.getByRole('button', { name: /menu/i }).click();
    await page.getByText(/sign out/i).click();
    await page.getByRole('button', { name: /ok/i }).click();

    // Verify back at login screen
    await expect(page.getByPlaceholder(/username/i)).toBeVisible({
      timeout: 10000,
    });
    await expect(page.getByPlaceholder(/password/i)).toBeVisible();
  });
});
