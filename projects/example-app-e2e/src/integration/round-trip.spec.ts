import { expect, test } from '@playwright/test';

const mockBooks = [
  createMockBook('book-1', 'Book 1', 'Author 1'),
  createMockBook('book-2', 'Book 2', 'Author 2'),
  createMockBook('book-3', 'Book 3', 'Author 3'),
  createMockBook('book-4', 'Book 4', 'Author 4'),
  createMockBook('book-5', 'Book 5', 'Author 5'),
];

test('Full round trip', async ({ page }) => {
  await page.route(
    'https://www.googleapis.com/books/v1/volumes**',
    async (route) => {
      const url = new URL(route.request().url());
      const volumeId = url.pathname.split('/volumes/')[1];

      if (volumeId) {
        const book = mockBooks.find((candidate) => candidate.id === volumeId);

        await route.fulfill({
          contentType: 'application/json',
          json: book ?? mockBooks[0],
          status: 200,
        });
        return;
      }

      await route.fulfill({
        contentType: 'application/json',
        json: { items: mockBooks },
        status: 200,
      });
    }
  );

  await page.goto('/');

  await test.step('shows a message when the credentials are wrong', async () => {
    await page.getByPlaceholder(/username/i).fill('wronguser');
    await page.getByPlaceholder(/password/i).fill('supersafepassword');
    await page.getByRole('button', { name: /login/i }).click();

    await expect(page.getByText('Invalid username or password')).toBeVisible();
  });

  await test.step('is possible to login', async () => {
    await page.getByPlaceholder(/username/i).fill('test');
    await page.getByPlaceholder(/username/i).press('Enter');
    await expect(page.getByRole('button', { name: /menu/i })).toBeVisible();
  });

  await test.step('is possible to search for books', async () => {
    await expect(page.getByRole('button', { name: /menu/i })).toBeVisible();
    await page.getByRole('button', { name: /menu/i }).click();
    await page.getByText(/browse books/i).click();
    await page.getByPlaceholder(/search for a book/i).fill('Book');
    await expect.poll(() => page.locator('bc-book-preview').count()).toBe(5);
  });

  await test.step('is possible to add books', async () => {
    await page.locator('bc-book-preview').first().click();
    await page.getByRole('button', { name: /add book to collection/i }).click();

    await expect(
      page.getByRole('button', { name: /add book to collection/i })
    ).toHaveCount(0);
  });

  await test.step('is possible to remove books', async () => {
    await page.goBack();
    await page.locator('bc-book-preview').nth(4).click();
    await page.getByRole('button', { name: /add book to collection/i }).click();
    await page
      .getByRole('button', { name: /remove book from collection/i })
      .click();

    await expect(
      page.getByRole('button', { name: /remove book from collection/i })
    ).toHaveCount(0);
  });

  await test.step('is possible to show the collection', async () => {
    await page.getByRole('button', { name: /menu/i }).click();
    await page.getByText(/my collection/i).click();

    await expect(page.locator('bc-book-preview')).toHaveCount(1);
  });

  await test.step('is possible to sign out', async () => {
    await page.getByRole('button', { name: /menu/i }).click();
    await page.getByText(/sign out/i).click();
    await page.getByRole('button', { name: /ok/i }).click();

    await expect(page.getByPlaceholder(/username/i)).toBeVisible();
    await expect(page.getByPlaceholder(/password/i)).toBeVisible();
  });
});

function createMockBook(id: string, title: string, author: string) {
  return {
    id,
    volumeInfo: {
      title,
      subtitle: `${title} subtitle`,
      authors: [author],
      publisher: `${author} Publishing`,
      publishDate: '1988-01-01',
      description: `${title} description`,
      averageRating: 5,
      ratingsCount: 100,
      imageLinks: {
        thumbnail: 'https://example.com/thumbnail.jpg',
        smallThumbnail: 'https://example.com/small-thumbnail.jpg',
      },
    },
  };
}
