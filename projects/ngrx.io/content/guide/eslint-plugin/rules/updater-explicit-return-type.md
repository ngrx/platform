# updater-explicit-return-type

`Updater` should have an explicit return type.

- **Type**: problem
- **Recommended**: Yes
- **Fixable**: No
- **Suggestion**: No
- **Requires type checking**: No
- **Configurable**: No

<!-- Everything above this generated, do not edit -->
<!-- MANUAL-DOC:START -->

## Rule Details

To enforce that the `updater` method from `@ngrx/component-store` returns the expected state interface, we must explicitly add the return type.

Examples of **incorrect** code for this rule:

```ts
interface MoviesState {
  movies: Movie[];
}

class MoviesStore extends ComponentStore<MoviesState> {
  readonly addMovie = this.updater((state, movie: Movie) => ({
    movies: [...state.movies, movie],
    // ⚠ this doesn't throw, but is caught by the linter
    extra: 'property',
  }));
}
```

Examples of **correct** code for this rule:

```ts
interface MoviesState {
  movies: Movie[];
}

class MoviesStore extends ComponentStore<MoviesState> {
  readonly addMovie = this.updater(
    (state, movie: Movie): MoviesState => ({
      movies: [...state.movies, movie],
      // ⚠ this does throw
      extra: 'property',
    })
  );
}
```
