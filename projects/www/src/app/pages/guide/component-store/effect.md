<ngrx-docs-alert type="help">

**<a href="/guide/signals"><b>NgRx Signals</b></a> is the new default.**

The NgRx team recommends using the `@ngrx/signals` library for local state management in Angular.
While ComponentStore remains supported, we encourage using `@ngrx/signals` for new projects and considering migration for existing ones.

</ngrx-docs-alert>

# Effects

Effects are designed to extract any side-effects (such as Network calls) from components and
handle potential race conditions.

## Key Concepts

- Effects isolate side effects from components, allowing for more pure components that select state and trigger updates and/or effects in ComponentStore(s).
- Effects are Observables listening for the inputs and piping them through the "prescription".
- Those inputs can either be values or Observables of values.
- Effects perform tasks, which are synchronous or asynchronous.

## `effect` method

The `effect` method takes a callback with an Observable of values, that describes HOW new
incoming values should be handled. Each new call of the effect would push the value into that
Observable.

<ngrx-code-example header="movies.store.ts">

```ts
@Injectable()
export class MoviesStore extends ComponentStore<MoviesState> {
  constructor(private readonly moviesService: MoviesService) {
    super({ movies: [] });
  }

  // Each new call of getMovie(id) pushed that id into movieId$ stream.
  readonly getMovie = this.effect((movieId$: Observable<string>) => {
    return movieId$.pipe(
      // 👇 Handle race condition with the proper choice of the flattening operator.
      switchMap((id) =>
        this.moviesService.fetchMovie(id).pipe(
          //👇 Act on the result within inner pipe.
          tap({
            next: (movie) => this.addMovie(movie),
            error: (e) => this.logError(e),
          }),
          // 👇 Handle potential error within inner pipe.
          catchError(() => EMPTY)
        )
      )
    );
  });

  readonly addMovie = this.updater((state, movie: Movie) => ({
    movies: [...state.movies, movie],
  }));

  selectMovie(movieId: string) {
    return this.select((state) =>
      state.movies.find((m) => m.id === movieId)
    );
  }
}
```

</ngrx-code-example>

The `getMovie` effect could then be used within a component.

<ngrx-code-example header="movie.component.ts">

```ts
@Component({
  template: `...`,
  // ❗️MoviesStore is provided higher up the component tree
})
export class MovieComponent {
  movie$: Observable<Movie>;

  @Input()
  set movieId(value: string) {
    // calls effect with value. 👇 Notice it's a single string value.
    this.moviesStore.getMovie(value);
    this.movie$ = this.moviesStore.selectMovie(value);
  }

  constructor(private readonly moviesStore: MoviesStore) {}
}
```

</ngrx-code-example>

## Calling an `effect` without parameters

A common use case is to call the `effect` method without any parameters.
To make this possible set the generic type of the `effect` method to `void`.

<ngrx-code-example header="movies.store.ts">

```ts
readonly getAllMovies = this.effect<void>(
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
```

</ngrx-code-example>

## Choosing a flattening operator

The examples above use different policies for overlapping calls:

- `switchMap` in `getMovie` unsubscribes from the previous inner
  Observable when a new ID arrives. Only results from the latest
  subscription can reach `addMovie`.
- `exhaustMap` in `getAllMovies` ignores new triggers while the current
  inner Observable is active. Ignored triggers are not queued; a new
  trigger is needed after that Observable completes.

If every call must be processed, consider `concatMap` to queue them or
`mergeMap` to run them concurrently. With `mergeMap`, results can arrive
in a different order from the calls. Unsubscribing stops observing the
previous stream; aborting the underlying operation depends on its
teardown logic and does not undo work already performed by a server.

For more examples, see this
[comparison of the four flattening operators](https://frontendatlas.com/angular/trivia/rxjs-switchmap-mergemap-exhaustmap-concatmap-angular-when-to-use).
