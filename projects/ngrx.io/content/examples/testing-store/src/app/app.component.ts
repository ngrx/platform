import { Component } from '@angular/core';
import { Store, select } from '@ngrx/store';

import { selectBookCollection, selectBooks } from './state/allBooks.selectors';
import {
  retrievedBookList,
  addBook,
  removeBook,
} from './state/allBooks.actions';
import { AppState } from './state/state';
import { GoogleBooksService, Book } from './book-list/books.service';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
})
export class AppComponent {
  books$ = this.store.pipe(select(selectBooks));
  bookCollection$ = this.store.pipe(select(selectBookCollection));

  add(bookId) {
    this.store.dispatch(addBook({ bookId }));
  }

  remove(bookId) {
    this.store.dispatch(removeBook({ bookId }));
  }

  constructor(
    private booksService: GoogleBooksService,
    private store: Store<AppState>
  ) {}

  ngOnInit() {
    this.booksService
      .getBooks()
      .subscribe((Book) => this.store.dispatch(retrievedBookList({ Book })));
  }
}
