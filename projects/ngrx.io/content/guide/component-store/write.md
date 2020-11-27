# Updating state

ComponentStore can be updated in 2 ways:
- by calling `setState`.
- by creating an `updater` and passing inputs through it.

## `updater` method

The `updater` method describes HOW the state changes. It takes a pure function with the current state and the value as arguments,
and should return the new state, updated immutably.

There could be many updaters within a ComponentStore. They are analogous to "CASE" statements or `on()` functions in `@ngrx/store` reducer.

<div class="alert is-helpful">

Using the `updater` method allows developers to extract business logic out of components into services,
which makes components easier to read and test.

</div>

<code-example header="movies.store.ts">
@Injectable()
export class MoviesStore extends ComponentStore&lt;MoviesState&gt; {
  
  constructor() {
    super({movies: []});
  }

  readonly addMovie = this.updater((state, movie: Movie) => ({
    movies: [...state.movies, movie],
  }));
}
</code-example>

Updater then can be called with the values imperatively or could take an Observable.

<code-example header="movies-page.component.ts">
@Component({
  template: `
    &lt;button (click)="add('New Movie')"&gt;Add a Movie&lt;/button&gt;
  `,
  providers: [MoviesStore],
})
export class MoviesPageComponent {

  constructor(private readonly moviesStore: MoviesStore) {}

  add(movie: string) {
    this.moviesStore.addMovie(movie);
  }
}
</code-example>

## `setState` method

The `setState` method can be called by either providing the object of state type or as a callback.

When the object is provided it resets the entire state to the provided value. This is also how lazy
initialization is performed.

The callback approach allows developers to change the state partially.

<code-example header="movies-page.component.ts">
@Component({
  template: `...`,
  providers: [ComponentStore],
})
export class MoviesPageComponent {
  constructor(
    private readonly componentStore: ComponentStore&lt;MoviesState&gt;
  ) {}

  ngOnInit() {
    this.componentStore.setState({movies: []});
  }

  resetMovies() {
    //    resets the State to empty array 👇
    this.componentStore.setState({movies: []});
  }

  addMovie(movie: Movie) {
    this.componentStore.setState((state) => {
      return {
        ...state,
        movies: [...state.movies, movie],
      };
    });
  }
}
</code-example>
