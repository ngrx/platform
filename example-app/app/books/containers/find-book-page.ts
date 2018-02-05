import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { take } from 'rxjs/operators';

import * as fromBooks from '../reducers';
import * as book from '../actions/book';
import { Book } from '../models/book';

@Component({
  selector: 'bc-find-book-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <bc-book-search [query]="searchQuery$ | async" [searching]="loading$ | async" [error]="error$ | async" (search)="search($event)"></bc-book-search>
    <bc-book-preview-list [books]="books$ | async"></bc-book-preview-list>
  `,
})
export class FindBookPageComponent {
  searchQuery$: Observable<string>;
  books$: Observable<Book[]>;
  loading$: Observable<boolean>;
  error$: Observable<string>;

  constructor(private store: Store<fromBooks.State>) {
    this.searchQuery$ = store.pipe(select(fromBooks.getSearchQuery), take(1));
    this.books$ = store.pipe(select(fromBooks.getSearchResults));
    this.loading$ = store.pipe(select(fromBooks.getSearchLoading));
    this.error$ = store.pipe(select(fromBooks.getSearchError));
  }

  search(query: string) {
    this.store.dispatch(new book.Search(query));
  }
}
