import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import * as fromBooks from '../reducers';
import * as collection from '../actions/collection';
import { Book } from '../models/book';

@Component({
  selector: 'bc-collection-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mat-card>
      <mat-card-title>My Collection</mat-card-title>
    </mat-card>

    <button (click)="increment()">
      Increment
    </button>
    <button (click)="decrement()">
      Decrement
    </button>
    <h4>Count: {{ count$ | async }}</h4>


    <bc-book-preview-list [books]="books$ | async"></bc-book-preview-list>
  `,
  /**
   * Container components are permitted to have just enough styles
   * to bring the view together. If the number of styles grow,
   * consider breaking them out into presentational
   * components.
   */
  styles: [
    `
    mat-card-title {
      display: flex;
      justify-content: center;
    }
  `,
  ],
})
export class CollectionPageComponent implements OnInit {
  books$: Observable<Book[]>;

  constructor(private store: Store<fromBooks.State>) {
    this.books$ = store.pipe(select(fromBooks.getBookCollection));
  }

  localStore = this.store.createLocalStore({
    name: 'Collection Page',
    initialState: 0,
  });

  count$ = this.store.pipe(select(this.localStore.selector));

  ngOnInit() {
    this.store.dispatch(new collection.Load());
  }

  increment() {
    this.localStore.update('Increment', value => value + 1);
  }

  decrement() {
    this.localStore.update('Decrement', value => value - 1);
  }
}
