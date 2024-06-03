# Reducers

Reducers in NgRx are responsible for handling transitions from one state to the next state in your application. Reducer functions handle these transitions by determining which [actions](guide/store/actions) to handle based on the action's type.

## Introduction

Reducers are pure functions in that they produce the same output for a given input. They are without side effects and handle each state transition synchronously. Each reducer function takes the latest `Action` dispatched, the current state, and determines whether to return a newly modified state or the original state. This guide shows you how to write reducer functions, register them in your `Store`, and compose feature states.

## The reducer function

There are a few consistent parts of every piece of state managed by a reducer.

- An interface or type that defines the shape of the state.
- The arguments including the initial state or current state and the current action.
- The functions that handle state changes for their associated action(s).

Below is an example of a set of actions to handle the state of a scoreboard,
and the associated reducer function.

First, define some actions for interacting with a piece of state.

<ngrx-code-example header="scoreboard-page.actions.ts">

```ts
import { createAction, props } from '@ngrx/store';

export const homeScore = createAction('[Scoreboard Page] Home Score');
export const awayScore = createAction('[Scoreboard Page] Away Score');
export const resetScore = createAction(
  '[Scoreboard Page] Score Reset'
);
export const setScores = createAction(
  '[Scoreboard Page] Set Scores',
  props<{ game: Game }>()
);
```

</ngrx-code-example>

Next, create a reducer file that imports the actions and define
a shape for the piece of state.

### Defining the state shape

Each reducer function is a listener of actions. The scoreboard actions defined above describe the possible transitions handled by the reducer. Import multiple sets of actions to handle additional state transitions within a reducer.

<ngrx-code-example header="scoreboard.reducer.ts">

```ts
import { Action, createReducer, on } from '@ngrx/store';
import * as ScoreboardPageActions from '../actions/scoreboard-page.actions';

export interface State {
  home: number;
  away: number;
}
```

</ngrx-code-example>

You define the shape of the state according to what you are capturing, whether it be a single type such as a number, or a more complex object with multiple properties.

### Setting the initial state

The initial state gives the state an initial value, or provides a value if the current state is `undefined`. You set the initial state with defaults for your required state properties.

Create and export a variable to capture the initial state with one or
more default values.

<ngrx-code-example header="scoreboard.reducer.ts">

```ts
export const initialState: State = {
  home: 0,
  away: 0,
};
```

</ngrx-code-example>

The initial values for the `home` and `away` properties of the state are 0.

### Creating the reducer function

The reducer function's responsibility is to handle the state transitions in an immutable way. Create a reducer function that handles the actions for managing the state of the scoreboard using the `createReducer` function.

<ngrx-code-example header="scoreboard.reducer.ts">

```ts
export const scoreboardReducer = createReducer(
  initialState,
  on(ScoreboardPageActions.homeScore, (state) => ({
    ...state,
    home: state.home + 1,
  })),
  on(ScoreboardPageActions.awayScore, (state) => ({
    ...state,
    away: state.away + 1,
  })),
  on(ScoreboardPageActions.resetScore, (state) => ({
    home: 0,
    away: 0,
  })),
  on(ScoreboardPageActions.setScores, (state, { game }) => ({
    home: game.home,
    away: game.away,
  }))
);
```

</ngrx-code-example>

<ngrx-docs-alert type="inform">

The exported `reducer` function is no longer required if you use the default Ivy AOT compiler (or JIT). It is only necessary with the View Engine AOT compiler as [function calls are not supported](https://angular.io/guide/aot-compiler#function-calls-are-not-supported) there.

</ngrx-docs-alert>

In the example above, the reducer is handling 4 actions: `[Scoreboard Page] Home Score`, `[Scoreboard Page] Away Score`, `[Scoreboard Page] Score Reset` and `[Scoreboard Page] Set Scores`. Each action is strongly-typed. Each action handles the state transition immutably. This means that the state transitions are not modifying the original state, but are returning a new state object using the spread operator. The spread syntax copies the properties from the current state into the object, creating a new reference. This ensures that a new state is produced with each change, preserving the purity of the change. This also promotes referential integrity, guaranteeing that the old reference was discarded when a state change occurred.

<ngrx-docs-alert type="inform">

The [spread operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax) only does shallow copying and does not handle deeply nested objects. You need to copy each level in the object to ensure immutability. There are libraries that handle deep copying including [lodash](https://lodash.com) and [immer](https://github.com/mweststrate/immer).

</ngrx-docs-alert>

When an action is dispatched, _all registered reducers_ receive the action. Whether they handle the action is determined by the `on` functions that associate one or more actions with a given state change.

<ngrx-docs-alert type="inform">

You can also write reducers using switch statements, which was the previously defined way before reducer creators were introduced in NgRx. If you are looking for examples of reducers using switch statements, visit the documentation for [versions 7.x and prior](https://v7.ngrx.io/guide/store/reducers).

</ngrx-docs-alert>

## Registering root state

The state of your application is defined as one large object. Registering reducer functions to manage parts of your state only defines keys with associated values in the object. To register the global `Store` within your application, use the `StoreModule.forRoot()` method with a map of key/value pairs that define your state. The `StoreModule.forRoot()` registers the global providers for your application, including the `Store` service you inject into your components and services to dispatch actions and select pieces of state.

<ngrx-code-example header="app.module.ts">

```ts
import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { scoreboardReducer } from './reducers/scoreboard.reducer';

@NgModule({
  imports: [StoreModule.forRoot({ game: scoreboardReducer })],
})
export class AppModule {}
```

</ngrx-code-example>

Registering states with `StoreModule.forRoot()` ensures that the states are defined upon application startup. In general, you register root states that always need to be available to all areas of your application immediately.

### Using the Standalone API

Registering the root store and state can also be done using the standalone APIs if you are bootstrapping an Angular application using standalone features.

<ngrx-code-example header="main.ts">

```ts
import { bootstrapApplication } from '@angular/platform-browser';
import { provideStore, provideState } from '@ngrx/store';

import { AppComponent } from './app.component';
import { scoreboardReducer } from './reducers/scoreboard.reducer';

bootstrapApplication(AppComponent, {
  providers: [
    provideStore(),
    provideState({ name: 'game', reducer: scoreboardReducer }),
  ],
});
```

</ngrx-code-example>

<ngrx-docs-alert type="inform">

Although you can register reducers in the `provideStore()` function, we recommend keeping `provideStore()` empty and using the `provideState()` function to register feature states in the root `providers` array.

</ngrx-docs-alert>

## Registering feature state

Feature states behave in the same way root states do, but allow you to define them with specific feature areas in your application. Your state is one large object, and feature states register additional keys and values in that object.

Looking at an example state object, you see how a feature state allows your state to be built up incrementally. Let's start with an empty state object.

<ngrx-code-example header="app.module.ts">

```ts
import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';

@NgModule({
  imports: [StoreModule.forRoot({})],
})
export class AppModule {}
```

</ngrx-code-example>

Using the Standalone API:

<ngrx-code-example header="main.ts">

```ts
import { bootstrapApplication } from '@angular/platform-browser';
import { provideStore } from '@ngrx/store';

import { AppComponent } from './app.component';

bootstrapApplication(AppComponent, {
  providers: [provideStore()],
});
```

</ngrx-code-example>

This registers your application with an empty object for the root state.

```json
{}
```

Now use the `scoreboard` reducer with a feature `NgModule` named `ScoreboardModule` to register additional state.

<ngrx-code-example header="scoreboard.reducer.ts">

```ts
export const scoreboardFeatureKey = 'game';
```

</ngrx-code-example>

<ngrx-code-example header="scoreboard.module.ts">

```ts
import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import {
  scoreboardFeatureKey,
  scoreboardReducer,
} from './reducers/scoreboard.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature(scoreboardFeatureKey, scoreboardReducer),
  ],
})
export class ScoreboardModule {}
```

</ngrx-code-example>

### Using the Standalone API

Feature states are registered in the `providers` array of the route config.

<ngrx-code-example header="game-routes.ts">

```ts
import { Route } from '@angular/router';
import { provideState } from '@ngrx/store';

import {
  scoreboardFeatureKey,
  scoreboardReducer,
} from './reducers/scoreboard.reducer';

export const routes: Route[] = [
  {
    path: 'scoreboard',
    providers: [
      provideState({
        name: scoreboardFeatureKey,
        reducer: scoreboardReducer,
      }),
    ],
  },
];
```

</ngrx-code-example>

<ngrx-docs-alert type="inform">

It is recommended to abstract a feature key string to prevent hardcoding strings when registering feature state and calling `createFeatureSelector`. Alternatively, you can use a [Feature Creator](guide/store/feature-creators) which automatically generates selectors for your feature state.

</ngrx-docs-alert>

Add the `ScoreboardModule` to the `AppModule` to load the state eagerly.

<ngrx-code-example header="app.module.ts">

```ts
import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { ScoreboardModule } from './scoreboard/scoreboard.module';

@NgModule({
  imports: [StoreModule.forRoot({}), ScoreboardModule],
})
export class AppModule {}
```

</ngrx-code-example>

Using the Standalone API, register the feature state on application bootstrap:

<ngrx-code-example header="main.ts">

```ts
import { bootstrapApplication } from '@angular/platform-browser';
import { provideStore } from '@ngrx/store';

import { AppComponent } from './app.component';
import {
  scoreboardFeatureKey,
  scoreboardReducer,
} from './reducers/scoreboard.reducer';

bootstrapApplication(AppComponent, {
  providers: [
    provideStore({ [scoreboardFeatureKey]: scoreboardReducer }),
  ],
});
```

</ngrx-code-example>

After the feature is loaded, the `game` key becomes a property in the object and is now managed in the state.

```json
{
  "game": { "home": 0, "away": 0 }
}
```

Whether your feature states are loaded eagerly or lazily depends on the needs of your application. You use feature states to build up your state object over time and through different feature areas.

## Standalone API in module-based apps

If you have a module-based Angular application, you can still use standalone components. NgRx standalone APIs support this workflow as well.

For module-based apps, you have the `StoreModule.forRoot({...})` included in the `imports` array of your `AppModule`, which registers the root store for dependency injection. Standalone components look for a different injection token that can only be provided by the `provideStore({...})` function detailed above. In order to use NgRx in a standalone component, you must first add the `provideStore({...})` function the the `providers` array in your `AppModule` with the same configuration you have inside of your `forRoot({...})`. For module-based apps with standalone components, you will simply have both.

<ngrx-code-example header="app.module.ts">

```ts
import { NgModule } from '@angular/core';
import { StoreModule, provideStore } from '@ngrx/store';
import { scoreboardReducer } from './reducers/scoreboard.reducer';

@NgModule({
  imports: [StoreModule.forRoot({ game: scoreboardReducer })],
  providers: [provideStore({ game: scoreboardReducer })],
})
export class AppModule {}
```

</ngrx-code-example>

Note: Similarly, if you are using effects, you will need to register both `EffectsModule.forRoot([...])` and `provideEffects([...])`. For more info, see [Effects](guide/effects).
