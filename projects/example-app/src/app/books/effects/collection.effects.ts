import { Injectable } from '@angular/core';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import { defer, of } from 'rxjs';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';

import { collectionApiActions } from '@example-app/books/actions/collection-api.actions';
import { collectionPageActions } from '@example-app/books/actions/collection-page.actions';
import { selectedBookPageActions } from '@example-app/books/actions/selected-book-page.actions';
import { Book } from '@example-app/books/models';
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
   * Wrapping the supported call in `defer` makes
   * effect easier to test.
   */
  checkStorageSupport$ = createEffect(
    () => defer(() => this.storageService.supported()),
    { dispatch: false }
  );

  loadCollection$ = createEffect(() =>
    this.actions$.pipe(
      ofType(collectionPageActions.enter),
      switchMap(() =>
        this.storageService.getCollection().pipe(
          map((books: Book[]) =>
            collectionApiActions.loadBooksSuccess({ books })
          ),
          catchError((error) =>
            of(collectionApiActions.loadBooksFailure({ error }))
          )
        )
      )
    )
  );

  addBookToCollection$ = createEffect(() =>
    this.actions$.pipe(
      ofType(selectedBookPageActions.addBook),
      mergeMap(({ book }) =>
        this.storageService.addToCollection([book]).pipe(
          map(() => collectionApiActions.addBookSuccess({ book })),
          catchError(() => of(collectionApiActions.addBookFailure({ book })))
        )
      )
    )
  );

  removeBookFromCollection$ = createEffect(() =>
    this.actions$.pipe(
      ofType(selectedBookPageActions.removeBook),
      mergeMap(({ book }) =>
        this.storageService.removeFromCollection([book.id]).pipe(
          map(() => collectionApiActions.removeBookSuccess({ book })),
          catchError(() => of(collectionApiActions.removeBookFailure({ book })))
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private storageService: BookStorageService
  ) {}
}
