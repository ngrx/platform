import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { Store } from '@ngrx/store';
import { take } from 'rxjs/operators';

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
      [query]="(searchQuery$ | async)!"
      [searching]="(loading$ | async)!"
      [error]="(error$ | async)!"
      (search)="search($event)"
    >
    </bc-book-search>
    <bc-book-preview-list [books]="(books$ | async)!"></bc-book-preview-list>
  `,
})
export class FindBookPageComponent {
  private store = inject(Store);

  protected readonly searchQuery$ = this.store
    .select(fromBooks.selectSearchQuery)
    .pipe(take(1));
  protected readonly books$ = this.store.select(fromBooks.selectSearchResults);
  protected readonly loading$ = this.store.select(
    fromBooks.selectSearchLoading
  );
  protected readonly error$ = this.store.select(fromBooks.selectSearchError);

  search(query: string) {
    this.store.dispatch(FindBookPageActions.searchBooks({ query }));
  }
}
