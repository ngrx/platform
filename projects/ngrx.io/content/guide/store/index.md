# Store overview

Store is RxJS powered state management for Angular applications, inspired by Redux. Store is a controlled state container designed to help write performant, consistent applications on top of Angular.

## Key concepts

- [Actions](guide/store/actions) describe unique events that are dispatched from components and services.
- State changes are handled by pure functions called [reducers](guide/store/reducers) that take the current state and the latest action to compute a new state.
- [Selectors](guide/store/selectors) are pure functions used to select, derive and compose pieces of state.
- State accessed with the `Store`, an observable of state and an observer of actions.

## Tutorial

The following tutorial shows you how to manage the state of a counter, and how to select and display it within an Angular component.

1.  Generate a <a href="https://stackblitz.com/fork/ngrx-start" target="_blank">new project</a> using StackBlitz.

2.  Right click on the `app` folder in StackBlitz and create a new file named `counter.actions.ts` to describe the counter actions to increment, decrement, and reset its value.

```ts
// counter.actions.ts
import { Action } from '@ngrx/store';

export enum ActionTypes {
  Increment = '[Counter Component] Increment',
  Decrement = '[Counter Component] Decrement',
  Reset = '[Counter Component] Reset',
}

export class Increment implements Action {
  readonly type = ActionTypes.Increment;
}

export class Decrement implements Action {
  readonly type = ActionTypes.Decrement;
}

export class Reset implements Action {
  readonly type = ActionTypes.Reset;
}
```

3.  Define a reducer function to handle changes in the counter value based on the provided actions.

```ts
// counter.reducer.ts
import { Action } from '@ngrx/store';
import { ActionTypes } from './counter.actions';

export const initialState = 0;

export function counterReducer(state = initialState, action: Action) {
  switch (action.type) {
    case ActionTypes.Increment:
      return state + 1;

    case ActionTypes.Decrement:
      return state - 1;

    case ActionTypes.Reset:
      return 0;

    default:
      return state;
  }
}
```

4.  Import the `StoreModule` from `@ngrx/store` and the `counter.reducer` file.

```ts
// app.module.ts
import { StoreModule } from '@ngrx/store';
import { counterReducer } from './counter.reducer';
```

5.  Add the `StoreModule.forRoot` function in the `imports` array of your `AppModule` with an object containing the `count` and the `counterReducer` that manages the state of the counter. The `StoreModule.forRoot()` method registers the global providers needed to access the `Store` throughout your application.

```ts
// app.module.ts
@NgModule({
  imports: [
    // other imports
    StoreModule.forRoot({ count: counterReducer }),
  ],
})
export class AppModule {}
```

6.  Create a new _Component_ named `my-counter` in the `app` folder. Inject the `Store` service into your component to dispatch the counter actions, and use the `select` operator to _select_ data from the state.

```ts
// my-counter.component.ts
import { Component } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Increment, Decrement, Reset } from '../counter.actions';

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

  constructor(private store: Store<{ count: number }>) {
    this.count$ = store.pipe(select('count'));
  }

  increment() {
    this.store.dispatch(new Increment());
  }

  decrement() {
    this.store.dispatch(new Decrement());
  }

  reset() {
    this.store.dispatch(new Reset());
  }
}
```

7.  Add the `MyCounter` component to your `AppComponent` template.

```html
<app-my-counter></app-my-counter>
```

And that's it! Click the increment, decrement, and reset buttons to change the state of the counter.

Let's cover what you did:

- Defined actions to express events.
- Defined a reducer function to manage the state of the counter.
- Registered the global state container that is available throughout your application.
- Injected the `Store` service to dispatch actions and select the current state of the counter.

## Next Steps

Learn about the architecture of an NgRx application through [actions](guide/store/actions), [reducers](guide/store/reducers), and [selectors](guide/store/selectors).
