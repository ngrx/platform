# updater-explicit-return-type

`Updater` should have an explicit return type.

- **Type**: problem
- **Deprecated**: Yes
- **Fixable**: No
- **Suggestion**: No
- **Requires type checking**: No
- **Configurable**: No

<!-- Everything above this generated, do not edit -->
<!-- MANUAL-DOC:START -->

## Deprecation Notice

This rule is deprecated. The `ComponentStore.updater` method now enforces exact return types at the type level, so excess properties in updater callbacks will produce TypeScript compilation errors without needing an explicit return type annotation. It is safe to remove this rule from your ESLint configuration. See the [Updating state guide](guide/component-store/write) for details and known limitations.

## Rule Details

To enforce that the `updater` method from `@ngrx/component-store` returns the expected state interface, we must explicitly add the return type.

Examples of **incorrect** code for this rule:

<ngrx-code-example>

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

</ngrx-code-example>

Examples of **correct** code for this rule:

<ngrx-code-example>

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

</ngrx-code-example>
