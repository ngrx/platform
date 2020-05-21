# @ngrx/component-store

ComponentStore is a standalone library that helps to manage local/component state. It's an alternative to push-based "Service with a Subject".

## Introduction

// TODO(alex-okrushko): fill-up the intro

## Key Concepts

- Local state can be initialized lazily
- Local state is typically tied to the life-cycle of a particular component and is cleaned up when that component is destroyed.
- Users of ComponentStore can update the state through `setState` or `updater`, either imperatively or by providing an Observable.
- Users of ComponentStore can read the state through `select` or a top-level `state$`. Selectors are extremely performant.
- Users of ComponentStore may start side-effects with `effect`, both sync and async, and feed the data both imperatively or reactively.

## Installation

// TODO(alex-okrushko): fill-up the installation, including pros/cons of extending the service vs Component-scoped providers

## Initialization

ComponentStore can be initialized in 2 ways:
- through constructor - it would have the initial state
- by calling `setState` and passing an object that matches the state interface.

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
  movies$: this.componentStore.state$.pipe(
    map(state => state.movies),
  );

  constructor(
    private readonly componentStore: ComponentStore<{movies: Movie[]}>
  ) {}

  ngOnInit() {
    this.componentStore.setState({movies: []});
  }
}
</code-example>

