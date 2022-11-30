import { createActionGroup, props } from '@ngrx/store';
import { Book } from '../book-list/books.model';

export const BooksActions = createActionGroup({
  source: 'Books List/Collection',
  events: {
    'Add Book': props<{ bookId: string }>(),
    'Remove Book': props<{ bookId: string }>(),
    'Retrieved Book List': props<{ books: ReadonlyArray<Book> }>(),
  },
});
