# Initialization

ComponentStore can be initialized in 2 ways:

- through the constructor - it would have the initial state
- by calling `setState` and passing an object that matches the state interface.

## Initialization through the constructor

Initializing through the constructor makes the state immediately available to the ComponentStore consumers.

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
}
```

</ngrx-code-example>

## Lazy initialization

In some cases, developers do not want selectors to return any state until there's meaningful data in the ComponentStore. The solution
would be to initialize the state lazily by calling [`setState`](guide/component-store/write#setstate-method) and passing the full state to it. The same approach can be taken to reset the state.

<ngrx-docs-alert type="inform">

Initialization has to be done before updating the state, otherwise an error would be thrown.

</ngrx-docs-alert>

<ngrx-code-example header="movies-page.component.ts">

```ts
@Component({
  template: `
    <li *ngFor="let movie of movies$ | async">
      {{ movie.name }}
    </li>
  `,
  providers: [ComponentStore],
})
export class MoviesPageComponent {
  readonly movies$ = this.componentStore.select(
    (state) => state.movies
  );

  constructor(
    private readonly componentStore: ComponentStore<{
      movies: Movie[];
    }>
  ) {}

  ngOnInit() {
    this.componentStore.setState({ movies: [] });
  }
}
```

</ngrx-code-example>
