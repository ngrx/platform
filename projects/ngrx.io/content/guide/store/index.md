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
  <img src="generated/images/guide/store/state-management-lifecycle.png" alt="NgRx State Management Lifecycle Diagram" width="100%" height="100%" />
</figure>

## Tutorial

The following tutorial shows you how to manage the state of a counter, and how to select and display it within an Angular component. Try the <live-example name="store" noDownload></live-example>.

1.  Generate a new project using StackBlitz <live-example name="ngrx-start" noDownload></live-example>.

2.  Right click on the `app` folder in StackBlitz and create a new file named `counter.actions.ts` to describe the counter actions to increment, decrement, and reset its value.

<code-example header="src/app/counter.actions.ts" path="store/src/app/counter.actions.ts">
</code-example>

3.  Define a reducer function to handle changes in the counter value based on the provided actions.

<code-example header="src/app/counter.reducer.ts" path="store/src/app/counter.reducer.ts">
</code-example>

4.  Import the `StoreModule` from `@ngrx/store` and the `counter.reducer` file.

<code-example header="src/app/app.module.ts (imports)" path="store/src/app/app.module.ts" region="imports">
</code-example>

5.  Add the `StoreModule.forRoot` function in the `imports` array of your `AppModule` with an object containing the `count` and the `counterReducer` that manages the state of the counter. The `StoreModule.forRoot()` method registers the global providers needed to access the `Store` throughout your application.

<code-example header="src/app/app.module.ts (StoreModule)" path="store/src/app/app.module.1.ts">
</code-example>

6.  Create a new file called `my-counter.component.ts` in a folder named `my-counter` within the `app` folder that will define a new component called `MyCounterComponent`. This component will render buttons that allow the user to change the count state. Also, create the `my-counter.component.html` file within this same folder.

<code-example header="src/app/my-counter/my-counter.component.ts" >
import { Component } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-my-counter',
  templateUrl: './my-counter.component.html',
})
export class MyCounterComponent {
  count$: Observable&lt;number&gt;

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
</code-example>

<code-example header="src/app/my-counter/my-counter.component.html" >
    &lt;button (click)="increment()"&gt;Increment&lt;/button&gt;

    &lt;div&gt;Current Count: {{ count$ | async }}&lt;/div&gt;

    &lt;button (click)="decrement()"&gt;Decrement&lt;/button&gt;

    &lt;button (click)="reset()"&gt;Reset Counter&lt;/button&gt;
</code-example>


7.  Add the new component to your AppModule's declarations and declare it in the template:

<code-example header="src/app/app.component.html" path="store/src/app/app.component.html" region="counter">
</code-example>

<code-example header="src/app/app.module.ts" path="store/src/app/app.module.ts">
</code-example>

8.  Inject the store into `MyCounterComponent` and connect the `count$` stream to the store's `count` state. Implement the `increment`, `decrement`, and `reset` methods by dispatching actions to the store.

<code-example header="src/app/my-counter/my-counter.component.ts" path="store/src/app/my-counter/my-counter.component.ts">
</code-example>

And that's it! Click the increment, decrement, and reset buttons to change the state of the counter.

Let's cover what you did:

- Defined actions to express events.
- Defined a reducer function to manage the state of the counter.
- Registered the global state container that is available throughout your application.
- Injected the `Store` service to dispatch actions and select the current state of the counter.

## Next Steps

Learn about the architecture of an NgRx application through [actions](guide/store/actions), [reducers](guide/store/reducers), and [selectors](guide/store/selectors).
