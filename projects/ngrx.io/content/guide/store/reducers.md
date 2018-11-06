# Reducers

Reducers in NgRx are responsible for handling transitions from one state to the next state in your application. Reducer functions handle these transitions by determininig which [actions](guide/store/actions) to handle based on the type.

## Introduction

Reducer functions are pure functions in that they produce the same output for a given input. They are without side effects, and handle each state transition synchronously. Each reducer function takes the latest `Action` dispatched, the current state, and determines whether to return a newly modified state, or the original state. This guide shows you how to write reducer functions, register them in your `Store`, and compose feature states.

## The reducer function

There are a few consistent parts of every piece of state managed by a reducer.

- An interface or type that defines that shape of the state.
- The arguments including the initial state or current state and current action.
- The switch statement

Below is an example of a set of actions to handle the state of a scoreboard,
and the associate reducer function.

First, define some actions for interacting with a piece of state.

```ts
import { Action } from '@ngrx/store';

export enum ActionTypes {
  IncrementHome = '[Scoreboard] Home Score',
  IncrementAway = '[Scoreboard] Away Score',
  Reset = '[Scoreboard] Score Reset',
}

export class IncrementHome implements Action {
  readonly type = ActionTypes.IncrementHome;
}

export class IncrementAway implements Action {
  readonly type = ActionTypes.IncrementAway;
}

export class Reset implements Action {
  readonly type = ActionTypes.Reset;

  constructor(public payload: { home: number; away: number }) {}
}

export type ActionsUnion = IncrementHome | IncrementAway | Reset;
```

Next, create a reducer file that imports the actions and define
a shape for the piece of state.

### Defining the state shape

Each reducer function is a listener of actions. The counter actions defined above describe the possible transitions handled by the reducer. Import multiple sets of actions to handle additional state transitions within a reducer.

```ts
import * as Scoreboard from './scoreboard.actions';

export interface State {
  home: number;
  away: number;
}
```

You define the shape of the state according to what you are capturing, whether it be a single type such as a number, or a more complex object with multiple properties.

### Setting the initial state

The initial state gives the state an initial value, or provides a value if the current state is `undefined`. You set the initial state with defaults for your required state properties.

Create and export a variable to capture the initial state with one or
more default values.

```ts
export const initialState: State = {
  home: 0,
  away: 0,
};
```

The initial values for the `home` and `away` properties of the state are 0.

### Creating the reducer function

The reducer function's responsibilty is to handle the state transitions in an immutable way. Define a reducer function that handles the actions for managing the state of the counter.

```ts
export function reducer(
  state = initialState,
  action: Scoreboard.ActionsUnion
): State {
  switch (action.type) {
    case Scoreboard.ActionTypes.IncrementHome: {
      return {
        ...state,
        home: state.home + 1,
      };
    }

    case Scoreboard.ActionTypes.IncrementAway: {
      return {
        ...state,
        away: state.away + 1,
      };
    }

    case Scoreboard.ActionTypes.Reset: {
      return {
        ...action.payload, // typed to { home: number, away: number }
      };
    }

    default: {
      return state;
    }
  }
}
```

Reducers use switch statements in combination with TypeScript's discriminated unions defined in your actions to provide type-safe processing of actions in a reducer. Switch statements use type unions to determine the correct shape of the action being consumed in each case. The action types defined with your actions are reused in your reducer functions as case statements. The type union is also provided to your reducer function to constrain the available actions that are handled in that reducer function.

In the example above, the reducer is handling 3 actions: `IncrementHome`, `IncrementAway`, and `Reset`. Each action is strongly-typed based on provided `ActionsUnion`. Each action handles the state transition immutably. This means that the state transitions are not modifying the original state, but are returning a new state object using the spread operator. The spread syntax copies the properties from the current state into the object, creating a new reference. This ensures that a new state is produced with each change, preserving the purity of the change. This also promotes referential integrity, guaranteeing that the old reference was discarded when a state change occurred.

When an action is dispatched, _all registered reducers_ receive the action. Whether they handle the action is determined by the switch statement. For this reason, each switch statement _always_ includes a default case that returns the previous state when the reducer function doesn't need to handle the action.

## Registering root state

The state of your application is defined as one large object. Registering reducer functions to manage parts of your state only defines keys with associated values in the object. To register the global `Store` within your application, use the `StoreModule.forRoot()` method with a map of key/value pairs that define your state. The `StoreModule.forRooot` registers the global providers for your application, including the `Store` service you inject into your components and services to dispatch actions and select pieces of state.

```ts
import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { scoreboardReducer } from './scoreboard.reducer';

@NgModule({
  imports: [StoreModule.forRoot({ game: scoreboardReducer })],
})
export class AppModule {}
```

Registering states with `StoreModule.forRoot` ensures that the states are defined upon application startup. In general, you register root states that are alway need to be available to all areas of your application immediately.

## Register feature state

You define

```ts
import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { counterReducer } from './counter';

@NgModule({
  imports: [StoreModule.forFeature({ count: counterReducer })],
})
export class CounterModule {}
```

## Next Steps

Reducers are only responsible for deciding which state transitions need to occur for a given action.

[Effects](guide/effects)
