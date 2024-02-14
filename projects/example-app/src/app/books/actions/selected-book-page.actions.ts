import { createActionGroup, props } from '@ngrx/store';

import { Book } from '@example-app/books/models';

export const SelectedBookPageActions = createActionGroup({
  source: 'Selected Book Page',
  events: {
    /**
     * Add Book to Collection Action
     */
    'Add Book': props<{ book: Book }>(),

    /**
     * Remove Book from Collection Action
     */
    'Remove Book': props<{ book: Book }>(),
  },
});
