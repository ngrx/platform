import { Book } from '../book-list/books.service';

export interface AppState {
  books: ReadonlyArray<Book>;
  collection: ReadonlyArray<string>;
}
