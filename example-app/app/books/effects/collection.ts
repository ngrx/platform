import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Database } from '@ngrx/db';
import { Observable } from 'rxjs/Observable';
import { defer } from 'rxjs/observable/defer';
import { of } from 'rxjs/observable/of';
import { Load } from './../actions/book';

import {
  LoadFail,
  LoadSuccess,
  AddBookSuccess,
  AddBookFail,
  CollectionActionTypes,
  RemoveBook,
  RemoveBookFail,
  RemoveBookSuccess,
  AddBook,
} from './../actions/collection';
import { Book } from '../models/book';
import { switchMap, toArray, map, catchError, mergeMap } from 'rxjs/operators';

@Injectable()
export class CollectionEffects {
  /**
   * This effect does not yield any actions back to the store. Set
   * `dispatch` to false to hint to @ngrx/effects that it should
   * ignore any elements of this effect stream.
   *
   * The `defer` observable accepts an observable factory function
   * that is called when the observable is subscribed to.
   * Wrapping the database open call in `defer` makes
   * effect easier to test.
   */
  @Effect({ dispatch: false })
  openDB$: Observable<any> = defer(() => {
    return this.db.open('books_app');
  });

  @Effect()
  loadCollection$: Observable<Action> = this.actions$.pipe(
    ofType(CollectionActionTypes.Load),
    switchMap(() =>
      this.db
        .query('books')
        .pipe(
          toArray(),
          map((books: Book[]) => new LoadSuccess(books)),
          catchError(error => of(new LoadFail(error)))
        )
    )
  );

  @Effect()
  addBookToCollection$: Observable<Action> = this.actions$.pipe(
    ofType(CollectionActionTypes.AddBook),
    map((action: AddBook) => action.payload),
    mergeMap(book =>
      this.db
        .insert('books', [book])
        .pipe(
          map(() => new AddBookSuccess(book)),
          catchError(() => of(new AddBookFail(book)))
        )
    )
  );

  @Effect()
  removeBookFromCollection$: Observable<Action> = this.actions$.pipe(
    ofType(CollectionActionTypes.RemoveBook),
    map((action: RemoveBook) => action.payload),
    mergeMap(book =>
      this.db
        .executeWrite('books', 'delete', [book.id])
        .pipe(
          map(() => new RemoveBookSuccess(book)),
          catchError(() => of(new RemoveBookFail(book)))
        )
    )
  );

  constructor(private actions$: Actions, private db: Database) {}
}
