# Operators

The operators library provides some useful operators that are frequently
used when managing state and side effects. 

## `concatLatestFrom`

The `concatLatestFrom` operator functions similarly to `withLatestFrom` with one important difference - it lazily evaluates the provided Observable factory.

This allows you to utilize the source value when selecting additional sources to concat.

Additionally, because the factory is not executed until it is needed, it also mitigates the performance impact of creating some kinds of Observables.

For example, when selecting data from the store with `store.select`, `concatLatestFrom` will prevent the
selector from being evaluated until the source emits a value.

The `concatLatestFrom` operator takes an Observable factory function that returns an array of Observables, or a single Observable.

<code-example header="router.effects.ts">
import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { map, tap } from 'rxjs/operators';

import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { routerNavigatedAction } from '@ngrx/router-store';

import { selectRouteData } from './router.selectors';

@Injectable()
export class RouterEffects {
  updateTitle$ = createEffect(() =>
    this.actions$.pipe(
      ofType(routerNavigatedAction),
      concatLatestFrom(() => this.store.select(selectRouteData)),
      map(([, data]) => `Book Collection - ${data['title']}`),
      tap((title) => this.titleService.setTitle(title))
    ),
    {
      dispatch: false,
    }
  );

  constructor(
    private actions$: Actions,
    private store: Store,
    private titleService: Title
  ) {}
}
</code-example>

## tapResponse

An easy way to handle the response with an Observable in a safe way, without additional boilerplate is to use the `tapResponse` operator. It enforces that the error case is handled and that the effect would still be running should an error occur. It is essentially a simple wrapper around two operators:

- `tap` that handles success and error cases.
- `catchError(() => EMPTY)` that ensures that the effect continues to run after the error.

<code-example header="movies.store.ts">
  readonly getMovie = this.effect((movieId$: Observable&lt;string&gt;) => {
    return movieId$.pipe(
      // 👇 Handle race condition with the proper choice of the flattening operator.
      switchMap((id) => this.moviesService.fetchMovie(id).pipe(
        //👇 Act on the result within inner pipe.
        tapResponse(
          (movie) => this.addMovie(movie),
          (error: HttpErrorResponse) => this.logError(error),
        ),
      )),
    );
  });
</code-example>

There is also another signature of the `tapResponse` operator that accepts the observer object as an input argument. In addition to the `next` and `error` callbacks, it provides the ability to pass `complete` and/or `finalize` callbacks:

<code-example header="movies.store.ts">
  readonly getMoviesByQuery = this.effect&lt;string&gt;((query$) => {
    return query$.pipe(
      tap(() => this.patchState({ loading: true }),
      switchMap((query) =>
        this.moviesService.fetchMoviesByQuery(query).pipe(
          tapResponse({
            next: (movies) => this.patchState({ movies }),
            error: (error: HttpErrorResponse) => this.logError(error),
            finalize: () => this.patchState({ loading: false }),
          })
        )
      )
    );
  });
</code-example>

## mapResponse

The `mapResponse` operator is particularly useful in scenarios where you need to transform data and handle potential errors with minimal boilerplate.

In the example below, we use `mapResponse` within an NgRx effect to handle loading movies from an API. It demonstrates how to map successful API responses to an action indicating success, and how to handle errors by dispatching an error action.

<code-example header="movies.effects.ts">
  export const loadMovies = createEffect(
    (actions$ = inject(Actions), moviesService = inject(MoviesService)) => {
      return actions$.pipe(
        ofType(MoviesPageActions.opened),
        exhaustMap(() =>
          moviesService.getAll().pipe(
            mapResponse({
              next: (movies) => MoviesApiActions.moviesLoadedSuccess({ movies }),
              error: (error: { message: string }) =>
                MoviesApiActions.moviesLoadedFailure({ errorMsg: error.message }),
            })
          )
        )
      );
    },
    { functional: true }
  );
</code-example>
