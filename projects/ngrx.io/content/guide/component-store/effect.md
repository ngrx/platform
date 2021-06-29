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
- `tap` that handles success and error
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
