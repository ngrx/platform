import { Book } from '../book-list/books.service';

export interface AppState {
  books: Array<Book>;
  collection: Array<string>;
}