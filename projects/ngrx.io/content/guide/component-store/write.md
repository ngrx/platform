## Updating state

ComponentStore can be updated in 2 ways:
- by calling `setState`.
- by calling creating an `updater` and passing inputs through it.

Updater describes HOW the state changes. It takes a pure function with the current state and the value as arguments,
and should return the new new state, updated immutably.

There could be many updaters within ComponentStore. They are analogous to "CASE" statements or "on()" functions in `@ngrx/store` reducer.

<code-example header="movies.store.ts">
@Injectable()
export class MoviesStore extends ComponentStore&lt;MoviesState&gt; {
  
  constructor() {
    super({movies:[]});
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
    <div (click)="add('New Movie')">Add a Movie</div>
  `,
  providers: [ComponentStore],
})
export class MoviesPageComponent {

  constructor(private readonly moviesStore: MoviesStore) {}

  add(movie: string) {
    moviesStore.addMovie(movie);
  }
}
</code-example>
