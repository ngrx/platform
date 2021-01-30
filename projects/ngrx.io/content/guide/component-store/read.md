# Reading state

## `select` method

Reading state is done with the `select` method, which takes a projector that describes HOW the state is retrieved and/or transformed.
Selectors emit new values when those values "change" - the new value is no longer distinct by comparison from the previous value.

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

  readonly movies$: Observable&lt;Movie[]&gt; = this.select(state => state.movies);
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

Selectors can be used to combine other Selectors or Observables.

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
        this.movies$,
        this.userPreferredMovieIds$,
        (movies, ids) => movies.filter(movie => ids.includes(movie.id))
  );
}
</code-example>

## Debounce selectors

Selectors are synchronous by default, meaning that they emit the value immediately when subscribed to, and on every state change.
Sometimes the preferred behavior would be to wait (or debounce) until the state "settles" (meaning all the changes within the current microtask occur)
and only then emit the final value.
In many cases, this would be the most performant way to read data from the ComponentStore, however its behavior might be surprising sometimes, as it won't emit a value until later on.
This makes it harder to test such selectors.

Adding the debounce to a selector is done by passing `{debounce: true}` as the last argument.

<code-example header="movies.store.ts">
@Injectable()
export class MoviesStore extends ComponentStore&lt;MoviesState&gt; {
  
  constructor() {
    super({movies: Movie[], moviesPerPage: 10, currentPageIndex: 0});

    this.effect((moviePageData$: Observable<{moviesPerPage: number, currentPageIndex: number}>) => {
      return moviePageData$.pipe(
        concatMap(({moviesPerPage, currentPageIndex}) =>
          this.movieService.loadMovies(moviesPerPage, currentPageIndex),
        ).pipe(tap(results => this.updateMovieResults(results))),
      );
    })(this.fetchMoviesData$); // 👈 effect is triggered whenever debounced data is changed
  }

  // Updates how many movies per page should be displayed
  readonly updateMoviesPerPage = this.updater((state, moviesPerPage: number) => ({
    ...state,
    moviesPerPage, // updates with new value
  }));

  // Updates which page of movies that the user is currently on
  readonly updateCurrentPageIndex = this.updater((state, currentPageIndex: number) => ({
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

ComponentStore is an independent library, however it can easily consume data from `@ngrx/store` or from any other global state management library.

<code-example header="movies.store.ts">
private readonly fetchMoviesData$ = this.select(
  this.store.select(getUserId), // 👈 store.select returns an Observable, which is easily mixed within selector
  moviesPerPage$,
  currentPageIndex$,
  (userId, moviesPerPage, currentPageIndex) => ({userId, moviesPerPage, currentPageIndex}),
);
</code-example>

## `get` method

While a selector provides a reactive way to read the state from ComponentStore via Observable, sometimes an imperative read is needed.
One of such use cases is accessing the state within an `effect`s and that's where `get` method could be used.

<div class="alert is-critical">

The `get` method is ComponentStore-private, meaning it's accessible only within the ComponentStore. It's done to discourage frequent imperative reads 
from the state as the NgRx team is in a consensus that such reads promote further potentially harmful architectural decisions.

</div>
