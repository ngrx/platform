# Reading state

## `select` method

Reading state is done with `select` function, that takes a projector which describes HOW the state is retrieved and/or transformed.
Selectors emit new values whenever those values "change" - the new value is no longer distinct by comparison from the previous value.

Another performance benefit of selectors is that they are "shared" - they multicast the value to each subscriber.

<code-example header="movies.store.ts">
export interface MoviesState {
  movies: Movie[];
}

@Injectable()
export class MoviesStore extends ComponentStore&lt;MoviesState&gt; {
  
  constructor() {
    super({movies:[]});
  }

  readonly movies$:&lt;Movie[]&gt Observable = this.select(state => state.movies);
}
</code-example>

<code-example header="movies-page.component.ts">
@Component({
  template: `
    &lt;li *ngFor="let movie of (movies$ | async)"&gt;
      {{ movie.name }}
    &lt;/li&gt;
  `,
  providers: [MoviesStore],
})
export class MoviesPageComponent {
  movies$ = this.moviesStore.movies$;

  constructor(private readonly moviesStore: MoviesStore) {}
}
</code-example>

## Combining selectors

Selectors can also be used to combine other Selectors or Observables.

<code-example header="movies.store.ts">
export interface MoviesState {
  movies: Movie[];
  userPreferredMoviesIds: string[];
}

@Injectable()
export class MoviesStore extends ComponentStore&lt;MoviesState&gt; {
  
  constructor() {
    super({movies:[], userPreferredMoviesIds:[]});
  }

  readonly movies$ = this.select(state => state.movies);
  readonly userPreferredMovieIds$ = this.select(state => state.userPreferredMoviesIds);

  readonly userPreferredMovies$ = this.select(
    movies$,
    userPreferredMovieIds$,
    (movies, ids) => movies.filter(id => ids.includes(id)),
  );
}
</code-example>

## Debounce selectors

Selectors are synchronous by default, meaning that emit the value immediately when subscribed to, and on every state change.
Sometimes the preferred behavior would be to wait (or debounce) until the state "settles" (meaning all the changes within current microtask occur)
and only then emit the final value.
In many cases, this would be the most perfomant way to read data from the ComponentStore, however its behavior might be surprising sometimes, as it won't emit a value until later on.
It is also harder to test such selectors.

Adding debounce to a selector is done by passing `{debounce: true}` as the last argument.

<code-example header="movies.store.ts">
@Injectable()
export class MoviesStore extends ComponentStore&lt;MoviesState&gt; {
  
  constructor() {
    super({movies: Movie[], moviesPerPage: 10, currentPageIndex: 0});

    this.effect((moviePageData$: Observable<{moviesPerPage: number, currentPageIndex: number}>) => {
      return moviePageData$.pipe(
        concatMap(({moviesPerPage, currentPageIndex}) => 
            this.movieService.loadMovies(moviesPerPage, currentPageIndex)).pipe(
              tap(results => this.updateMovieResults(results)),
            ),
      );
    })(fetchMoviesData$) // 👈 effect is triggered whenever debounced data is changed
  }

  // Updates how many movies per page user should be displayed
  readonly updateMoviesPerPage = this.updater((state, moviesPerPage: number) => ({
    ...state,
    moviesPerPage, // updates with new value
  }));

  // Updates which page of movies the User is currently on
  readonly updateMoviesPerPage = this.updater((state, currentPageIndex: number) => ({
    ...state,
    currentPageIndex, // updates with new page index
  }));

  readonly moviesPerPage$ = this.select(state => state.moviesPerPage);

  readonly currentPageIndex$ = this.select(state => state.currentPageIndex);

  private readonly fetchMoviesData$ = this.select(
    moviesPerPage$,
    currentPageIndex$,
    (moviesPerPage, currentPageIndex) => ({moviesPerPage, currentPageIndex}),
    {debounce: true}, // 👈 setting this selector to debounce
    );
}
</code-example>


## Selecting from global `@ngrx/store`

ComponentStore is an independent library, however it can easily consume data from `@ngrx/store` or any other global state management libraries.

<code-example header="movies.store.ts">

  private readonly fetchMoviesData$ = this.select(
    this.store.select(getUserId), // 👈 store.select returns an Observable, which could be easily mixed within selector
    moviesPerPage$,
    currentPageIndex$,
    (userId, moviesPerPage, currentPageIndex) => ({userId, moviesPerPage, currentPageIndex}),
    );
}
</code-example>

## `get` method

While selector provides a reactive way to read the state from ComponentStore via Observable, sometimes imperative reading is needed.
One of such use cases is accessing the state within `effect`s and that's where `get` method could be used.

`get` method is ComponentStore-private, meaning it's accessible only within ComponentStore. It's done to discourage frequent imperative reads 
from the state as the NgRx team is in a consensus that such reads promote further potentially harmful architectural decisions.
