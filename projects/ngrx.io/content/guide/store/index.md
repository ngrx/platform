# Store overview

Store is RxJS powered state management for Angular applications, inspired by Redux. Store is a controlled state container designed to help write performant,consistent applications on top of Angular.

## Core Principles

- State is a single, immutable data structure that emphasizes type-safety, serializability, and testability.
- [Actions](guide/store/actions) describe unique events that are dispatched to trigger state changes and/or side effects.
- State changes are handled by pure functions called [reducers](guide/store/reducers) that take the previous state and the next action to compute a new state.
- [Selectors](guide/store/selectors) are pure functions used to select, derive and compose pieces of state.
- State accessed with the `Store`, an observable of state and an observer of actions.

## Installation

```sh
npm install @ngrx/store
```

```sh
yarn add @ngrx/store
```

## Example

Create a reducer function for each data type you have in your application. The
combination of these reducers will make up your application state:

```ts
// counter.ts
import { Action } from '@ngrx/store';

export const INCREMENT = 'INCREMENT';
export const DECREMENT = 'DECREMENT';
export const RESET = 'RESET';

const initialState = 0;

export function counterReducer(state: number = initialState, action: Action) {
  switch (action.type) {
    case INCREMENT:
      return state + 1;

    case DECREMENT:
      return state - 1;

    case RESET:
      return 0;

    default:
      return state;
  }
}
```

To register the state container within your application, import the reducers and
use the `StoreModule.forRoot` function in the `imports` array of the `@NgModule`
decorator for your `AppModule`.

```ts
import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { counterReducer } from './counter';

@NgModule({
  imports: [StoreModule.forRoot({ count: counterReducer })],
})
export class AppModule {}
```

You can then inject the `Store` service into your components and services. Use
`select` operator to _select_ slice(s) of state:

```ts
import { Component } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { INCREMENT, DECREMENT, RESET } from './counter';

interface AppState {
  count: number;
}

@Component({
  selector: 'app-my-counter',
  template: `
    <button (click)="increment()">Increment</button>
    <div>Current Count: {{ count$ | async }}</div>
    <button (click)="decrement()">Decrement</button>

    <button (click)="reset()">Reset Counter</button>
  `,
})
export class MyCounterComponent {
  count$: Observable<number>;

  constructor(private store: Store<AppState>) {
    this.count$ = store.pipe(select('count'));
  }

  increment() {
    this.store.dispatch({ type: INCREMENT });
  }

  decrement() {
    this.store.dispatch({ type: DECREMENT });
  }

  reset() {
    this.store.dispatch({ type: RESET });
  }
}
```
