import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import * as fromBooks from '../reducers';
import * as CollectionActions from '../actions/collection';
import { Book } from '../models/book';

@Component({
  selector: 'bc-selected-book-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <bc-book-detail
      [book]="book$ | async"
      [inCollection]="isSelectedBookInCollection$ | async"
      (add)="addToCollection($event)"
      (remove)="removeFromCollection($event)">
    </bc-book-detail>
  `,
})
export class SelectedBookPageComponent {
  book$: Observable<Book>;
  isSelectedBookInCollection$: Observable<boolean>;

  constructor(private store: Store<fromBooks.State>) {
    this.book$ = store.pipe(select(fromBooks.getSelectedBook));
    this.isSelectedBookInCollection$ = store.pipe(
      select(fromBooks.isSelectedBookInCollection)
    );
  }

  addToCollection(book: Book) {
    this.store.dispatch(new CollectionActions.AddBook(book));
  }

  removeFromCollection(book: Book) {
    this.store.dispatch(new CollectionActions.RemoveBook(book));
  }
}
