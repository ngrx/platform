import { ChangeDetectionStrategy, Component } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { SelectedBookPageActions } from '@example-app/books/actions/selected-book-page.actions';
import { Book } from '@example-app/books/models';
import * as fromBooks from '@example-app/books/reducers';
import { BookDetailComponent } from '../components';
import { AsyncPipe } from '@angular/common';

@Component({
  standalone: true,
  selector: 'bc-selected-book-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BookDetailComponent, AsyncPipe],
  template: `
    <bc-book-detail
      [book]="(book$ | async)!"
      [inCollection]="(isSelectedBookInCollection$ | async)!"
      (add)="addToCollection($event)"
      (remove)="removeFromCollection($event)"
    >
    </bc-book-detail>
  `,
})
export class SelectedBookPageComponent {
  book$: Observable<Book>;
  isSelectedBookInCollection$: Observable<boolean>;

  constructor(private store: Store) {
    this.book$ = store.select(fromBooks.selectSelectedBook) as Observable<Book>;
    this.isSelectedBookInCollection$ = store.select(
      fromBooks.isSelectedBookInCollection
    );
  }

  addToCollection(book: Book) {
    this.store.dispatch(SelectedBookPageActions.addBook({ book }));
  }

  removeFromCollection(book: Book) {
    this.store.dispatch(SelectedBookPageActions.removeBook({ book }));
  }
}
