import { Injectable } from '@angular/core';
import { Database } from '@ngrx/db';
import { Actions, Effect, ofType, effect } from '@ngrx/effects';
import { defer, of } from 'rxjs';
import { catchError, map, mergeMap, switchMap, toArray } from 'rxjs/operators';

import { Book } from '@example-app/books/models/book';
import {
  SelectedBookPageActions,
  CollectionPageActions,
  CollectionApiActions,
} from '@example-app/books/actions';

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
  openDB$ = defer(() => {
    return this.db.open('books_app');
  });

  loadCollection$ = effect(() =>
    this.actions$.pipe(
      ofType(CollectionPageActions.CollectionPageActionTypes.LoadCollection),
      switchMap(() =>
        this.db.query('books').pipe(
          toArray(),
          map(
            (books: Book[]) => new CollectionApiActions.LoadBooksSuccess(books)
          ),
          catchError(error =>
            of(new CollectionApiActions.LoadBooksFailure(error))
          )
        )
      )
    )
  );

  addBookToCollection$ = effect(() =>
    this.actions$.pipe(
      ofType(SelectedBookPageActions.SelectedBookPageActionTypes.AddBook),
      map(action => action.payload),
      mergeMap(book =>
        this.db.insert('books', [book]).pipe(
          map(() => new CollectionApiActions.AddBookSuccess(book)),
          catchError(() => of(new CollectionApiActions.AddBookFailure(book)))
        )
      )
    )
  );

  removeBookFromCollection$ = effect(() =>
    this.actions$.pipe(
      ofType(SelectedBookPageActions.SelectedBookPageActionTypes.RemoveBook),
      map(action => action.payload),
      mergeMap(book =>
        this.db.executeWrite('books', 'delete', [book.id]).pipe(
          map(() => new CollectionApiActions.RemoveBookSuccess(book)),
          catchError(() => of(new CollectionApiActions.RemoveBookFailure(book)))
        )
      )
    )
  );

  constructor(
    private actions$: Actions<
      SelectedBookPageActions.SelectedBookPageActionsUnion
    >,
    private db: Database
  ) {}
}
