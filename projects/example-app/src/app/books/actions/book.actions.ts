import { createActionGroup, props } from '@ngrx/store';

import { Book } from '@example-app/books/models';

export const bookActions = createActionGroup({
  source: 'Book Exists Guard',
  events: {
    'Load Book': props<{ book: Book }>(),
  },
});
