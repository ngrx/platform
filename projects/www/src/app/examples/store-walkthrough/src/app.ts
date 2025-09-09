import { Component, inject, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import { selectBookCollection, selectBooks } from './state/books.selectors';
import { BooksActions, BooksApiActions } from './state/books.actions';
import { GoogleBooks } from './book-list/books';
import { BookList } from './book-list/book-list';
import { BookCollection } from './book-collection/book-collection';

@Component({
  selector: 'app-root',
  template: `
    <h1>Oliver Sacks Books Collection</h1>

    <h2>Books</h2>
    <app-book-list [books]="books()!" (add)="onAdd($event)" />

    <h2>My Collection</h2>
    <app-book-collection
      [books]="bookCollection()!"
      (remove)="onRemove($event)"
    />
  `,
  imports: [BookList, BookCollection],
})
export class App implements OnInit {
  private readonly booksService = inject(GoogleBooks);
  private readonly store = inject(Store);

  protected books = this.store.selectSignal(selectBooks);
  protected bookCollection = this.store.selectSignal(selectBookCollection);

  protected onAdd(bookId: string) {
    this.store.dispatch(BooksActions.addBook({ bookId }));
  }

  protected onRemove(bookId: string) {
    this.store.dispatch(BooksActions.removeBook({ bookId }));
  }

  ngOnInit() {
    this.booksService
      .getBooks()
      .subscribe((books) =>
        this.store.dispatch(BooksApiActions.retrievedBookList({ books }))
      );
  }
}
