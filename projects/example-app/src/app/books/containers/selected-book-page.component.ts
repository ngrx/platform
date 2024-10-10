import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { Store } from '@ngrx/store';

import { SelectedBookPageActions } from '@example-app/books/actions/selected-book-page.actions';
import { Book } from '@example-app/books/models';
import * as fromBooks from '@example-app/books/reducers';
import { BookDetailComponent } from '../components';

@Component({
  standalone: true,
  selector: 'bc-selected-book-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BookDetailComponent],
  template: `
    @let value = book(); @if (value) {
    <bc-book-detail
      [book]="value"
      [inCollection]="isSelectedBookInCollection()"
      (add)="addToCollection($event)"
      (remove)="removeFromCollection($event)"
    >
    </bc-book-detail>
    }
  `,
})
export class SelectedBookPageComponent {
  private readonly store = inject(Store);

  protected readonly book = this.store.selectSignal(
    fromBooks.selectSelectedBook
  );
  protected readonly isSelectedBookInCollection = this.store.selectSignal(
    fromBooks.isSelectedBookInCollection
  );

  addToCollection(book: Book) {
    this.store.dispatch(SelectedBookPageActions.addBook({ book }));
  }

  removeFromCollection(book: Book) {
    this.store.dispatch(SelectedBookPageActions.removeBook({ book }));
  }
}
