# Initialization

ComponentStore can be initialized in 2 ways:
- through constructor - it would have the initial state
- by calling `setState` and passing an object that matches the state interface.

## Initialization through constructor

Initializing through constructor makes the state immediately available to the ComponentStore consumers.

<code-example header="movies.store.ts">
export interface MoviesState {
  movies: Movie[];
}

@Injectable()
export class MoviesStore extends ComponentStore&lt;MoviesState&gt; {
  
  constructor() {
    super({movies: []});
  }
}
</code-example>

## Lazy initialization

In some cases developers do not want for selectors to return any state until there's some meaningful data in the ComponentStore. The solution
would be to initialize the state lazily by calling `setState` and passing the full state to it. The same approach can be taken to reset the state.

<div class="alert is-important">

**Note:** Initialization has to be done prior to updating the state, otherwise an Error would be thrown.

</div>

<code-example header="movies-page.component.ts">
@Component({
  template: `
    &lt;li *ngFor="let movie of (movies$ | async)"&gt;
      {{ movie.name }}
    &lt;/li&gt;
  `,
  providers: [ComponentStore],
})
export class MoviesPageComponent {
  movies$ = this.componentStore.state$.pipe(
    map(state => state.movies),
  );

  constructor(
    private readonly componentStore: ComponentStore&lt;{movies: Movie[]}&gt;
  ) {}

  ngOnInit() {
    this.componentStore.setState({movies: []});
  }
}
</code-example>
