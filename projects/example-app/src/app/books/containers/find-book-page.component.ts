import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { Store } from '@ngrx/store';

import { FindBookPageActions } from '@example-app/books/actions/find-book-page.actions';
import * as fromBooks from '@example-app/books/reducers';
import { BookPreviewListComponent, BookSearchComponent } from '../components';
import { AsyncPipe } from '@angular/common';

@Component({
  standalone: true,
  selector: 'bc-find-book-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BookSearchComponent, AsyncPipe, BookPreviewListComponent],
  template: `
    <bc-book-search
      [query]="searchQuery()"
      [searching]="loading()"
      [error]="error()"
      (search)="search($event)"
    >
    </bc-book-search>
    <bc-book-preview-list [books]="books()"></bc-book-preview-list>
  `,
})
export class FindBookPageComponent {
  private readonly store = inject(Store);

  protected readonly searchQuery = this.store.selectSignal(
    fromBooks.selectSearchQuery
  );
  protected readonly books = this.store.selectSignal(
    fromBooks.selectSearchResults
  );
  protected readonly loading = this.store.selectSignal(
    fromBooks.selectSearchLoading
  );
  protected readonly error = this.store.selectSignal(
    fromBooks.selectSearchError
  );

  search(query: string) {
    this.store.dispatch(FindBookPageActions.searchBooks({ query }));
  }
}
