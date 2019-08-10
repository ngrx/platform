# @ngrx/store

Store is RxJS powered state management for Angular applications, inspired by Redux. Store is a controlled state container designed to help write performant, consistent applications on top of Angular.

## Key concepts

- [Actions](guide/store/actions) describe unique events that are dispatched from components and services.
- State changes are handled by pure functions called [reducers](guide/store/reducers) that take the current state and the latest action to compute a new state.
- [Selectors](guide/store/selectors) are pure functions used to select, derive and compose pieces of state.
- State accessed with the `Store`, an observable of state and an observer of actions.

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

6.  Create a new _Component_ named `my-counter` in the `app` folder. Inject the `Store` service into your component to dispatch the counter actions, and use the `select` operator to _select_ data from the state.

Update the `MyCounterComponent` template with buttons to call the increment, decrement, and reset methods. Use the async pipe to subscribe to the _count$_ observable.

<code-example header="src/app/my-counter/my-counter.component.html" path="store/src/app/my-counter/my-counter.component.html">
</code-example>

Update the `MyCounterComponent` class with a selector for the _count_, and methods to dispatch the Increment, Decrement, and Reset actions.

<code-example header="src/app/my-counter/my-counter.component.ts" path="store/src/app/my-counter/my-counter.component.ts">
</code-example>

7.  Add the `MyCounter` component to your `AppComponent` template.

<code-example header="src/app/app.component.html" path="store/src/app/app.component.html" region="counter">
</code-example>

And that's it! Click the increment, decrement, and reset buttons to change the state of the counter.

Let's cover what you did:

- Defined actions to express events.
- Defined a reducer function to manage the state of the counter.
- Registered the global state container that is available throughout your application.
- Injected the `Store` service to dispatch actions and select the current state of the counter.

## Next Steps

Learn about the architecture of an NgRx application through [actions](guide/store/actions), [reducers](guide/store/reducers), and [selectors](guide/store/selectors).
