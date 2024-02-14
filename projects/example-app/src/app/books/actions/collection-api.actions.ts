import { createActionGroup, props } from '@ngrx/store';

import { Book } from '@example-app/books/models';

export const CollectionApiActions = createActionGroup({
  source: 'Collection/API',
  events: {
    /**
     * Add Book to Collection Actions
     */
    'Add Book Success': props<{ book: Book }>(),
    'Add Book Failure': props<{ book: Book }>(),

    /**
     * Remove Book from Collection Actions
     */
    'Remove Book Success': props<{ book: Book }>(),
    'Remove Book Failure': props<{ book: Book }>(),

    /**
     * Load Collection Actions
     */
    'Load Books Success': props<{ books: Book[] }>(),
    'Load Books Failure': props<{ error: any }>(),
  },
});
