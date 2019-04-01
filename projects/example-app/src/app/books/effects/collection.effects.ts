import { Injectable } from '@angular/core';
import { Actions, Effect, ofType, createEffect } from '@ngrx/effects';
import { defer, of } from 'rxjs';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
import { Book } from '@example-app/books/models/book';
import {
  CollectionApiActions,
  CollectionPageActions,
  SelectedBookPageActions,
} from '@example-app/books/actions';
import { BookStorageService } from '@example-app/core/services';
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
  checkStorageSupport$ = defer(() => this.storageService.supported());

  loadCollection$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CollectionPageActions.loadCollection.type),
      switchMap(() =>
        this.storageService.getCollection().pipe(
          map((books: Book[]) =>
            CollectionApiActions.loadBooksSuccess({ books })
          ),
          catchError(error =>
            of(CollectionApiActions.loadBooksFailure({ error }))
          )
        )
      )
    )
  );

  addBookToCollection$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SelectedBookPageActions.addBook.type),
      mergeMap(({ book }) =>
        this.storageService.addToCollection([book]).pipe(
          map(() => CollectionApiActions.addBookSuccess({ book })),
          catchError(() => of(CollectionApiActions.addBookFailure({ book })))
        )
      )
    )
  );

  removeBookFromCollection$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SelectedBookPageActions.removeBook.type),
      mergeMap(({ book }) =>
        this.storageService.removeFromCollection([book.id]).pipe(
          map(() => CollectionApiActions.removeBookSuccess({ book })),
          catchError(() => of(CollectionApiActions.removeBookFailure({ book })))
        )
      )
    )
  );

  constructor(
    private actions$: Actions<
      SelectedBookPageActions.SelectedBookPageActionsUnion
    >,
    private storageService: BookStorageService
  ) {}
}
