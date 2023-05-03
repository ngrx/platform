# Effects

Effects are designed to extract any side-effects (such as Network calls) from components and
handle potential race conditions.

## Key Concepts

* Effects isolate side effects from components, allowing for more pure components that select state and trigger updates and/or effects in ComponentStore(s).
* Effects are Observables listening for the inputs and piping them through the "prescription".
* Those inputs can either be values or Observables of values.
* Effects perform tasks, which are synchronous or asynchronous.

## `effect` method

The `effect` method takes a callback with an Observable of values, that describes HOW new 
incoming values should be handled. Each new call of the effect would push the value into that
Observable.

<code-example header="movies.store.ts">
@Injectable()
export class MoviesStore extends ComponentStore&lt;MoviesState&gt; {
  
  constructor(private readonly moviesService: MoviesService) {
    super({movies: []});
  }

  // Each new call of getMovie(id) pushed that id into movieId$ stream.
  readonly getMovie = this.effect((movieId$: Observable&lt;string&gt;) => {
    return movieId$.pipe(
      // 👇 Handle race condition with the proper choice of the flattening operator.
      switchMap((id) => this.moviesService.fetchMovie(id).pipe(
        //👇 Act on the result within inner pipe.
        tap({
          next: (movie) => this.addMovie(movie),
          error: (e) => this.logError(e),
        }),
        // 👇 Handle potential error within inner pipe.
        catchError(() => EMPTY),
      )),
    );
  });

  readonly addMovie = this.updater((state, movie: Movie) => ({
    movies: [...state.movies, movie],
  }));

  selectMovie(movieId: string) {
    return this.select((state) => state.movies.find(m => m.id === movieId));
  }
}
</code-example>

The `getMovie` effect could then be used within a component.

<code-example header="movie.component.ts">
@Component({
  template: `...`,
  // ❗️MoviesStore is provided higher up the component tree
})
export class MovieComponent {
  movie$: Observable&lt;Movie&gt;;

  @Input()
  set movieId(value: string) {
    // calls effect with value. 👇 Notice it's a single string value.
    this.moviesStore.getMovie(value);
    this.movie$ = this.moviesStore.selectMovie(value);
  }

  constructor(private readonly moviesStore: MoviesStore) {}

}
</code-example>

## tapResponse

An easy way to handle the response in ComponentStore effects in a safe way, without additional boilerplate is to use the `tapResponse` operator. It enforces that the error case is handled and that the effect would still be running should an error occur. It is essentially a simple wrapper around two operators:

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

## Calling an `effect` without parameters

A common use case is to call the `effect` method without any parameters. 
To make this possible set the generic type of the `effect` method to `void`.

<code-example header="movies.store.ts">
  readonly getAllMovies = this.effect&lt;void&gt;(
    // The name of the source stream doesn't matter: `trigger$`, `source$` or `$` are good 
    // names. We encourage to choose one of these and use them consistently in your codebase.
    (trigger$) => trigger$.pipe(
      exhaustMap(() =>
        this.moviesService.fetchAllMovies().pipe(
          tapResponse({
            next: (movies) => this.addAllMovies(movies),
            error: (error: HttpErrorResponse) => this.logError(error),
          })
        )
      )
    )
  );
</code-example>
