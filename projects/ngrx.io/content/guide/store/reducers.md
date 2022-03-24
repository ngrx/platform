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

<code-example header="scoreboard-page.actions.ts">
import { createAction, props } from '@ngrx/store';

export const homeScore = createAction('[Scoreboard Page] Home Score');
export const awayScore = createAction('[Scoreboard Page] Away Score');
export const resetScore = createAction('[Scoreboard Page] Score Reset');
export const setScores = createAction('[Scoreboard Page] Set Scores', props<{game: Game}>());

</code-example>

Next, create a reducer file that imports the actions and define
a shape for the piece of state.

### Defining the state shape

Each reducer function is a listener of actions. The scoreboard actions defined above describe the possible transitions handled by the reducer. Import multiple sets of actions to handle additional state transitions within a reducer.

<code-example header="scoreboard.reducer.ts">
import { Action, createReducer, on } from '@ngrx/store';
import * as ScoreboardPageActions from '../actions/scoreboard-page.actions';

export interface State {
  home: number;
  away: number;
}
</code-example>

You define the shape of the state according to what you are capturing, whether it be a single type such as a number, or a more complex object with multiple properties.

### Setting the initial state

The initial state gives the state an initial value, or provides a value if the current state is `undefined`. You set the initial state with defaults for your required state properties.

Create and export a variable to capture the initial state with one or
more default values.

<code-example header="scoreboard.reducer.ts">
export const initialState: State = {
  home: 0,
  away: 0,
};
</code-example>

The initial values for the `home` and `away` properties of the state are 0.

### Creating the reducer function

The reducer function's responsibility is to handle the state transitions in an immutable way. Create a reducer function that handles the actions for managing the state of the scoreboard using the `createReducer` function.

<code-example header="scoreboard.reducer.ts">
export const scoreboardReducer = createReducer(
  initialState,
  on(ScoreboardPageActions.homeScore, state => ({ ...state, home: state.home + 1 })),
  on(ScoreboardPageActions.awayScore, state => ({ ...state, away: state.away + 1 })),
  on(ScoreboardPageActions.resetScore, state => ({ home: 0, away: 0 })),
  on(ScoreboardPageActions.setScores, (state, { game }) => ({ home: game.home, away: game.away }))
);

</code-example>

<div class="alert is-important">

**Note:** The exported `reducer` function is no longer required if you use the default Ivy AOT compiler (or JIT). It is only necessary with the View Engine AOT compiler as [function calls are not supported](https://angular.io/guide/aot-compiler#function-calls-are-not-supported) there.

</div>

In the example above, the reducer is handling 4 actions: `[Scoreboard Page] Home Score`, `[Scoreboard Page] Away Score`, `[Scoreboard Page] Score Reset` and `[Scoreboard Page] Set Scores`. Each action is strongly-typed. Each action handles the state transition immutably. This means that the state transitions are not modifying the original state, but are returning a new state object using the spread operator. The spread syntax copies the properties from the current state into the object, creating a new reference. This ensures that a new state is produced with each change, preserving the purity of the change. This also promotes referential integrity, guaranteeing that the old reference was discarded when a state change occurred.


<div class="alert is-important">

**Note:** The [spread operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax) only does shallow copying and does not handle deeply nested objects. You need to copy each level in the object to ensure immutability. There are libraries that handle deep copying including [lodash](https://lodash.com) and [immer](https://github.com/mweststrate/immer).

</div>

When an action is dispatched, _all registered reducers_ receive the action. Whether they handle the action is determined by the `on` functions that associate one or more actions with a given state change.

<div class="alert is-important">

**Note:** You can also write reducers using switch statements, which was the previously defined way before reducer creators were introduced in NgRx. If you are looking for examples of reducers using switch statements, visit the documentation for [versions 7.x and prior](https://v7.ngrx.io/guide/store/reducers).

</div>

## Registering root state

The state of your application is defined as one large object. Registering reducer functions to manage parts of your state only defines keys with associated values in the object. To register the global `Store` within your application, use the `StoreModule.forRoot()` method with a map of key/value pairs that define your state. The `StoreModule.forRoot()` registers the global providers for your application, including the `Store` service you inject into your components and services to dispatch actions and select pieces of state.

<code-example header="app.module.ts">
import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { scoreboardReducer } from './reducers/scoreboard.reducer';

@NgModule({
  imports: [
    StoreModule.forRoot({ game: scoreboardReducer })
  ],
})
export class AppModule {}
</code-example>

Registering states with `StoreModule.forRoot()` ensures that the states are defined upon application startup. In general, you register root states that always need to be available to all areas of your application immediately.

## Register feature state

Feature states behave in the same way root states do, but allow you to define them with specific feature areas in your application. Your state is one large object, and feature states register additional keys and values in that object.

Looking at an example state object, you see how a feature state allows your state to be built up incrementally. Let's start with an empty state object.

<code-example header="app.module.ts">
import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';

@NgModule({
  imports: [
    StoreModule.forRoot({})
  ],
})
export class AppModule {}
</code-example>

This registers your application with an empty object for the root state.

```json
{
}
```

Now use the `scoreboard` reducer with a feature `NgModule` named `ScoreboardModule` to register additional state.

<code-example header="scoreboard.reducer.ts">
export const scoreboardFeatureKey = 'game';
</code-example>

<code-example header="scoreboard.module.ts">
import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { scoreboardFeatureKey, scoreboardReducer } from './reducers/scoreboard.reducer';
  
@NgModule({
  imports: [
    StoreModule.forFeature(scoreboardFeatureKey, scoreboardReducer)
  ],
})
export class ScoreboardModule {}
</code-example>

<div class="alert is-important">

**Note:** It is recommended to abstract a feature key string to prevent hardcoding strings when registering feature state and calling `createFeatureSelector`.

</div>

Add the `ScoreboardModule` to the `AppModule` to load the state eagerly.

<code-example header="app.module.ts">
import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { ScoreboardModule } from './scoreboard/scoreboard.module';

@NgModule({
  imports: [
    StoreModule.forRoot({}),
    ScoreboardModule
  ],
})
export class AppModule {}
</code-example>

Once the `ScoreboardModule` is loaded, the `game` key becomes a property in the object and is now managed in the state.

```json
{
  game: { home: 0, away: 0 }
}
```

Whether your feature states are loaded eagerly or lazily depends on the needs of your application. You use feature states to build up your state object over time and through different feature areas.

## Next Steps

Reducers are only responsible for deciding which state transitions need to occur for a given action.

In an application there is also a need to handle impure actions, e.g. AJAX requests, in NgRx we call them [Effects](guide/effects).
