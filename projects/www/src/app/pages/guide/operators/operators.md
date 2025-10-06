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

<ngrx-docs-alert type="help">

The `concatLatestFrom` operator has been moved from `@ngrx/effects` to `@ngrx/operators`. If you're looking for the older documentation (prior to v18), see the [v17 documentation](https://v17.ngrx.io/guide/effects/operators#concatlatestfrom).

</ngrx-docs-alert>

<ngrx-code-example header="router-effects.ts">

```ts
import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { map, tap } from 'rxjs';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { routerNavigatedAction } from '@ngrx/router-store';
import { concatLatestFrom } from '@ngrx/operators';

import { selectRouteData } from './router-selectors';

@Injectable()
export class RouterEffects {
  readonly #actions$ = inject(Actions);
  readonly #store = inject(Store);
  readonly #titleService = inject(Title);

  updateTitle$ = createEffect(
    () =>
      this.#actions$.pipe(
        ofType(routerNavigatedAction),
        concatLatestFrom(() => this.#store.select(selectRouteData)),
        map(([, data]) => `Book Collection - ${data['title']}`),
        tap((title) => this.#titleService.setTitle(title))
      ),
    { dispatch: false }
  );
}
```

</ngrx-code-example>

## tapResponse

An easy way to handle the response with an Observable in a safe way, without additional boilerplate is to use the `tapResponse` operator. It enforces that the error case is handled and that the effect would still be running should an error occur. It is essentially a simple wrapper around two operators:

- `tap` that handles success and error cases.
- `catchError(() => EMPTY)` that ensures that the effect continues to run after the error.

<ngrx-docs-alert type="help">

The `tapResponse` operator has been moved from `@ngrx/component-store` to `@ngrx/operators`. If you're looking for the older documentation (prior to v18), see the [v17 documentation](https://v17.ngrx.io/guide/component-store/effect#tapresponse).

</ngrx-docs-alert>

<ngrx-code-example header="movies-store.ts">

```ts
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { tapResponse } from '@ngrx/operators';
// ... other imports

@Injectable()
export class MoviesStore {
  // ... other store members

  readonly loadMovie = rxMethod<string>(
    pipe(
      // 👇 Handle race condition with the proper choice of the flattening operator.
      switchMap(() =>
        this.moviesService.getMovie(id).pipe(
          //👇 Act on the result within inner pipe.
          tapResponse({
            next: (movie) => this.addMovie(movie),
            error: (error: HttpErrorResponse) => this.logError(error),
          })
        )
      )
    )
  );
}
```

</ngrx-code-example>

In addition to the `next` and `error` callbacks, `tapResponse` provides the ability to pass `complete` and/or `finalize` callbacks:

<ngrx-code-example header="movies-store.ts">

```ts
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { tapResponse } from '@ngrx/operators';
// ... other imports

@Injectable()
export class MoviesStore {
  // ... other store members

  readonly loadMoviesByQuery = rxMethod<string>(
    pipe(
      tap(() => this.isLoading.set(true),
      switchMap((query) =>
        this.moviesService.getMoviesByQuery(query).pipe(
          tapResponse({
            next: (movies) => this.movies.set(movies),
            error: (error: HttpErrorResponse) => this.logError(error),
            finalize: () => this.isLoading.set(false),
          })
        )
      )
    )
  );
}
```

</ngrx-code-example>

## mapResponse

The `mapResponse` operator is particularly useful in scenarios where you need to transform data and handle potential errors with minimal boilerplate.

In the example below, we use `mapResponse` within an NgRx effect to handle loading movies from an API. It demonstrates how to map successful API responses to an action indicating success, and how to handle errors by dispatching an error action.

<ngrx-code-example header="movies-effects.ts">

```ts
import { createEffect } from '@ngrx/effects';
import { mapResponse } from '@ngrx/operators';
// ...other imports

export const loadMovies = createEffect(
  (
    actions$ = inject(Actions),
    moviesService = inject(MoviesService)
  ) => {
    return actions$.pipe(
      ofType(MoviesPageActions.opened),
      exhaustMap(() =>
        moviesService.getAll().pipe(
          mapResponse({
            next: (movies) =>
              MoviesApiActions.moviesLoadedSuccess({ movies }),
            error: (error: { message: string }) =>
              MoviesApiActions.moviesLoadedFailure({
                errorMsg: error.message,
              }),
          })
        )
      )
    );
  },
  { functional: true }
);
```

</ngrx-code-example>
