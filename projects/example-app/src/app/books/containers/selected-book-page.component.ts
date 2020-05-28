import { ChangeDetectionStrategy, Component } from '@angular/core';

import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { SelectedBookPageActions } from '@example-app/books/actions';
import { Book } from '@example-app/books/models';
import * as fromBooks from '@example-app/books/reducers';

@Component({
  selector: 'bc-selected-book-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <bc-book-detail
      [book]="book$ | async"
      [inCollection]="isSelectedBookInCollection$ | async"
      (add)="addToCollection($event)"
      (remove)="removeFromCollection($event)"
    >
    </bc-book-detail>
  `,
})
export class SelectedBookPageComponent {
  book$: Observable<Book>;
  isSelectedBookInCollection$: Observable<boolean>;

  constructor(private store: Store<fromBooks.State>) {
    this.book$ = store.pipe(select(fromBooks.selectSelectedBook)) as Observable<
      Book
    >;
    this.isSelectedBookInCollection$ = store.pipe(
      select(fromBooks.isSelectedBookInCollection)
    );
  }

  addToCollection(book: Book) {
    this.store.dispatch(SelectedBookPageActions.addBook({ book }));
  }

  removeFromCollection(book: Book) {
    this.store.dispatch(SelectedBookPageActions.removeBook({ book }));
  }
}
