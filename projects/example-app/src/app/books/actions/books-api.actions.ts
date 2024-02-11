import { createActionGroup, props } from '@ngrx/store';

import { Book } from '@example-app/books/models';

export const booksApiActions = createActionGroup({
  source: 'Books/API',
  events: {
    'Search Success': props<{ books: Book[] }>(),
    'Search Failure': props<{ errorMsg: string }>(),
  },
});
