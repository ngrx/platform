# @ngrx/store

Store is RxJS powered global state management for Angular applications, inspired by Redux. Store is a controlled state container designed to help write performant, consistent applications on top of Angular.

## Key concepts

- [Actions](guide/store/actions) describe unique events that are dispatched from components and services.
- State changes are handled by pure functions called [reducers](guide/store/reducers) that take the current state and the latest action to compute a new state.
- [Selectors](guide/store/selectors) are pure functions used to select, derive and compose pieces of state.
- State is accessed with the `Store`, an observable of state and an observer of actions.

## Local state management

NgRx Store is mainly for managing global state across an entire application. In cases where you need to manage temporary or local component state, consider using [NgRx ComponentStore](guide/component-store).

## Installation

Detailed installation instructions can be found on the [Installation](guide/store/install) page.

## Diagram

The following diagram represents the overall general flow of application state in NgRx.

<figure>
  <img src="images/guide/store/state-management-lifecycle.png" alt="NgRx State Management Lifecycle Diagram" width="100%" height="100%" />
</figure>

<ngrx-docs-alert type="inform">

All `Actions` that are dispatched within an application state are always first processed by the `Reducers` before being handled by the `Effects` of the application state.

</ngrx-docs-alert>

## Tutorial

The following tutorial shows you how to manage the state of a counter, and how to select and display it within an Angular component.

1.  Generate a new project using StackBlitz.

2.  Right click on the `app` folder in StackBlitz and create a new file named `counter.actions.ts` to describe the counter actions to increment, decrement, and reset its value.

<ngrx-code-example header="src/counter.actions.ts">

```ts
import { createAction } from '@ngrx/store';

export const increment = createAction(
  '[Counter Component] Increment'
);
export const decrement = createAction(
  '[Counter Component] Decrement'
);
export const reset = createAction('[Counter Component] Reset');
```

</ngrx-code-example>

3.  Define a reducer function to handle changes in the counter value based on the provided actions.

<ngrx-code-example header="src/counter.reducer.ts">

```ts
import { createReducer, on } from '@ngrx/store';
import { increment, decrement, reset } from './counter.actions';

export const initialState = 0;

export const counterReducer = createReducer(
  initialState,
  on(increment, (state) => state + 1),
  on(decrement, (state) => state - 1),
  on(reset, () => 0)
);
```

</ngrx-code-example>

4.  Import the @ngrx/store!provideStore:function from `@ngrx/store` and the reducer exported from `counter.reducer` file.

<ngrx-code-example header="src/app.config.ts">

```ts
import { provideStore } from '@ngrx/store';
import { counterReducer } from './counter.reducer';
```

</ngrx-code-example>

5.  Add the `StoreModule.forRoot` function in the `imports` array of your `AppModule` with an object containing the `count` and the `counterReducer` that manages the state of the counter. The `StoreModule.forRoot()` method registers the global providers needed to access the `Store` throughout your application.

<ngrx-code-example header="src/app.module.ts (StoreModule)" path="store/src/app.module.1.ts">
</ngrx-code-example>

6.  Create a new file called `my-counter.component.ts` in a folder named `my-counter` within the `app` folder that will define a new component called `MyCounterComponent`. This component will render buttons that allow the user to change the count state. Also, create the `my-counter.component.html` file within this same folder.

<ngrx-code-example header="src/my-counter/my-counter.component.ts" >

```ts
import { Component, Signal } from '@angular/core';

@Component({
  selector: 'app-my-counter',
})
export class MyCounterComponent {
  count: Signal<number>;

  constructor() {
    // TODO: Connect `this.count$` stream to the current store `count` state
  }

  increment() {
    // TODO: Dispatch an increment action
  }

  decrement() {
    // TODO: Dispatch a decrement action
  }

  reset() {
    // TODO: Dispatch a reset action
  }
}
```

</ngrx-code-example>

<ngrx-code-example header="src/app/my-counter/my-counter.component.html" >

```html
<button (click)="increment()">Increment</button>

<div>Current Count: {{ count() }}</div>

<button (click)="decrement()">Decrement</button>

<button (click)="reset()">Reset Counter</button>
```

</ngrx-code-example>

7.  Add the new component to your AppModule's declarations and declare it in the template:

<ngrx-code-example header="src/app/app.component.html" path="store/src/app/app.component.html" region="counter">
</ngrx-code-example>

<ngrx-code-example header="src/app/app.module.ts" path="store/src/app/app.module.ts">
</ngrx-code-example>

8.  Inject the store into `MyCounterComponent` and connect the `count` signal to the store's `count` state. Implement the `increment`, `decrement`, and `reset` methods by dispatching actions to the store.

<ngrx-code-example header="src/my-counter/my-counter.component.ts">

```ts
import { Component, Signal, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { increment, decrement, reset } from '../counter.actions';

@Component({
  selector: 'app-my-counter',
  standalone: true,
})
export class MyCounterComponent {
  private readonly store: Store<{ count: number }> = inject(Store);
  count: Signal<number> = this.store.selectSignal(
    (state) => state.count
  );

  increment() {
    this.store.dispatch(increment());
  }

  decrement() {
    this.store.dispatch(decrement());
  }

  reset() {
    this.store.dispatch(reset());
  }
}
```

</ngrx-code-example>

And that's it! Click the increment, decrement, and reset buttons to change the state of the counter.

Let's cover what you did:

- Defined actions to express events.
- Defined a reducer function to manage the state of the counter.
- Registered the global state container that is available throughout your application.
- Injected the `Store` service to dispatch actions and select the current state of the counter.

<ngrx-docs-stackblitz name="store"></ngrx-docs-stackblitz>
