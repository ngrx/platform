<ngrx-docs-alert type="help">

**<a href="/guide/signals"><b>NgRx Signals</b></a> is the new default.**

The NgRx team recommends using the `@ngrx/signals` library for local state management in Angular.
While ComponentStore remains supported, we encourage using `@ngrx/signals` for new projects and considering migration for existing ones.

</ngrx-docs-alert>

# Reading state

## `select` method

Reading state is done with the `select` method, which takes a projector that describes HOW the state is retrieved and/or transformed.
Selectors emit new values when those values "change" - the new value is no longer distinct by comparison from the previous value.

Another performance benefit of selectors is that they are "shared" - they multicast the value to each subscriber.

<ngrx-code-example header="movies.store.ts">

```ts
export interface MoviesState {
  movies: Movie[];
}

@Injectable()
export class MoviesStore extends ComponentStore<MoviesState> {
  constructor() {
    super({ movies: [] });
  }

  readonly movies$: Observable<Movie[]> = this.select(
    (state) => state.movies
  );
}
```

</ngrx-code-example>

<ngrx-code-example header="movies-page.component.ts">

```ts
@Component({
  template: `
    <li *ngFor="let movie of movies$ | async">
      {{ movie.name }}
    </li>
  `,
  providers: [MoviesStore],
})
export class MoviesPageComponent {
  movies$ = this.moviesStore.movies$;

  constructor(private readonly moviesStore: MoviesStore) {}
}
```

</ngrx-code-example>

## Combining selectors

Selectors can be used to combine other Selectors or Observables.

<ngrx-code-example header="movies.store.ts">

```ts
export interface MoviesState {
  movies: Movie[];
  userPreferredMoviesIds: string[];
}

@Injectable()
export class MoviesStore extends ComponentStore<MoviesState> {
  constructor() {
    super({ movies: [], userPreferredMoviesIds: [] });
  }

  readonly movies$ = this.select((state) => state.movies);
  readonly userPreferredMovieIds$ = this.select(
    (state) => state.userPreferredMoviesIds
  );

  readonly userPreferredMovies$ = this.select(
    this.movies$,
    this.userPreferredMovieIds$,
    (movies, ids) => movies.filter((movie) => ids.includes(movie.id))
  );
}
```

</ngrx-code-example>

## Creating a View Model

Creating view models is a recommended way to consolidate multiple streams in a clean API to provide to your component template.
The `select` method accepts a dictionary of observables as input and returns an observable of the dictionary of values as output. View models can be written in the following way:

<ngrx-code-example header="movies.store.ts">

```ts
private readonly vm$ = this.select({
    movies: this.movies$,
    userPreferredMovieIds: this.userPreferredMovieIds$,
    userPreferredMovies: this.userPreferredMovies$
  });
```

</ngrx-code-example>

## Debounce selectors

Selectors are synchronous by default, meaning that they emit the value immediately when subscribed to, and on every state change.
Sometimes the preferred behavior would be to wait (or debounce) until the state "settles" (meaning all the changes within the current microtask occur)
and only then emit the final value.
In many cases, this would be the most performant way to read data from the ComponentStore, however its behavior might be surprising sometimes, as it won't emit a value until later on.
This makes it harder to test such selectors.

Adding the debounce to a selector is done by passing `{debounce: true}` as the last argument.

<ngrx-code-example header="movies.store.ts">

```ts
@Injectable()
export class MoviesStore extends ComponentStore<MoviesState> {
  constructor(private movieService: MovieService) {
    super({ movies: [], moviesPerPage: 10, currentPageIndex: 0 });

    // 👇 effect is triggered whenever debounced data is changed
    this.fetchMovies(this.fetchMoviesData$);
  }

  // Updates how many movies per page should be displayed
  readonly updateMoviesPerPage = this.updater(
    (state, moviesPerPage: number) => ({
      ...state,
      moviesPerPage, // updates with new value
    })
  );

  // Updates which page of movies that the user is currently on
  readonly updateCurrentPageIndex = this.updater(
    (state, currentPageIndex: number) => ({
      ...state,
      currentPageIndex, // updates with new page index
    })
  );

  readonly moviesPerPage$ = this.select(
    (state) => state.moviesPerPage
  );

  readonly currentPageIndex$ = this.select(
    (state) => state.currentPageIndex
  );

  private readonly fetchMoviesData$ = this.select(
    {
      moviesPerPage: this.moviesPerPage$,
      currentPageIndex: this.currentPageIndex$,
    },
    { debounce: true } // 👈 setting this selector to debounce
  );

  private readonly fetchMovies = this.effect(
    (
      moviePageData$: Observable<{
        moviesPerPage: number;
        currentPageIndex: number;
      }>
    ) => {
      return moviePageData$.pipe(
        concatMap(({ moviesPerPage, currentPageIndex }) => {
          return this.movieService
            .loadMovies(moviesPerPage, currentPageIndex)
            .pipe(tap((results) => this.updateMovieResults(results)));
        })
      );
    }
  );
}
```

</ngrx-code-example>

## Using a custom equality function

The observable created by the `select` method compares the newly emitted value with the previous one using the default equality check (`===`) and emits only if the value has changed. However, the default behavior can be overridden by passing a custom equality function to the `select` method config.

<ngrx-code-example header="movies.store.ts">

```ts
export interface MoviesState {
  movies: Movie[];
}

@Injectable()
export class MoviesStore extends ComponentStore<MoviesState> {
  constructor() {
    super({ movies: [] });
  }

  readonly movies$: Observable<Movie[]> = this.select(
    (state) => state.movies,
    { equal: (prev, curr) => prev.length === curr.length } // 👈 custom equality function
  );
}
```

</ngrx-code-example>

## Selecting from global `@ngrx/store`

ComponentStore is an independent library, however it can easily consume data from `@ngrx/store` or from any other global state management library.

<ngrx-code-example header="movies.store.ts">

```ts
private readonly fetchMoviesData$ = this.select(
  this.store.select(getUserId), // 👈 store.select returns an Observable, which is easily mixed within selector
  moviesPerPage$,
  currentPageIndex$,
  (userId, moviesPerPage, currentPageIndex) => ({userId, moviesPerPage, currentPageIndex}),
);
```

</ngrx-code-example>

## `selectSignal` method

ComponentStore also provides the `selectSignal` method, which has two signatures.
The first signature creates a signal from the provided state projector function.
The second signature creates a signal by combining the provided signals, this is similar to the `select` method that combines the provided observables.

<ngrx-code-example header="users.store.ts">

```ts
import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';

import { User } from './user.model';

type UsersState = { users: User[]; query: string };

@Injectable()
export class UsersStore extends ComponentStore<UsersState> {
  // type: Signal<User[]>
  readonly users = this.selectSignal((s) => s.users);
  // type: Signal<string>
  readonly query = this.selectSignal((s) => s.query);
  // type: Signal<User[]>
  readonly filteredUsers = this.selectSignal(
    this.users,
    this.query,
    (users, query) => users.filter(({ name }) => name.includes(query))
  );
}
```

</ngrx-code-example>

The `selectSignal` method also accepts an equality function to stop the recomputation of the deeper dependency chain if two values are determined to be equal.

## `state` signal

The `state` signal returns the entire state of the ComponentStore.

Use the `state` signal to create computed signals that derives its value from the state.

<ngrx-code-example header="users.store.ts">

```ts
import { computed, Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';

import { User } from './user.model';

type UsersState = { users: User[]; query: string };

@Injectable()
export class UsersStore extends ComponentStore<UsersState> {
  readonly users = computed(() => this.state().users);
  readonly query = computed(() => this.state().query);

  readonly filteredUsers = computed(() =>
    this.users().filter(({ name }) => name.includes(this.query()))
  );
}
```

</ngrx-code-example>

## `get` method

While a selector provides a reactive way to read the state from ComponentStore via Observable, sometimes an imperative read is needed.
One of such use cases is accessing the state within an `effect`s and that's where `get` method could be used.

<ngrx-docs-alert type="error">

The `get` method is ComponentStore-private, meaning it's accessible only within the ComponentStore. It's done to discourage frequent imperative reads
from the state as the NgRx team is in a consensus that such reads promote further potentially harmful architectural decisions.

</ngrx-docs-alert>
