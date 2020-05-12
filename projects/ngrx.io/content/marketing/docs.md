<h1 class="no-toc">What is NgRx?</h1>

NgRx is a framework for building reactive applications in Angular. NgRx provides state management, isolation of side effects, entity collection management, router bindings, code generation, and developer tools that enhance developers experience when building many different types of applications.

## Why NgRx for State Management?

NgRx provides state management for creating maintainable explicit applications, by storing single state and the use of actions in order to express state changes.


### Serializability

By normalizing state changes and passing them through observables, NgRx provides serializability and ensures state is predictably stored. This enables to save the state to an external storage, for example, `localStorage`.

In addition, it also allows to inspect, download, upload, and dispatch actions, all from the [Store Devtools](guide/store-devtools).


### Type Safety
Type safety is promoted throughout the architecture with reliance on the TypeScript compiler for program correctness.


### Encapsulation

Using NgRx [Effects](guide/effects) and [Store](guide/store), any interaction with external resources side effects, like network requests, web socket and any business logic can be isolated from the UI. This isolation allows for more pure and simple components, and keep the single responsibility principle.

### Testable

Because [Store](guide/store) uses pure functions for changing state and selecting data from state, and the ability to isolate side effects from the UI, testing becomes very straightforward.
NgRx also provides tests setup like `provideMockStore` and `provideMockActions` for isolated tests, and a better test experience.

### Performance

[Store](guide/store) is built on a single immutable data state, making change detection turn into a very easy task using an [`OnPush`](https://angular.io/api/core/ChangeDetectionStrategy#OnPush) strategy.
NgRx is also powered by memoized selector functions which optimize state query computations.

## When Should I Use NgRx for State Management

In particular, you might use NgRx when you build an application with a lot of user interactions and multiple data sources, when managing state in services are no longer sufficient.

A good substance that might answer the question "Do I need NgRx", is the
<a href="https://youtu.be/omnwu_etHTY" target="_blank">**SHARI**</a> principle:

* **S**hared: state that is accessed by many components and services.

* **H**ydrated: state that is persisted and rehydrated from external storage.

* **A**vailable: state that needs to be available when re-entering routes.

* **R**etrieved: state that must be retrieved with a side-effect.

* **I**mpacted: state that is impacted by actions from other sources.


However, realizing that using NgRx comes with some tradeoffs is also crucial. It is not meant to be the shortest or quickest way to write code and encourage its users the usage of many files.
It is also often require a steep learning curve, including some good understanding of [`RxJs`](https://rxjs-dev.firebaseapp.com/) and [`Redux`](https://redux.js.org/).


## Packages

- [Store](guide/store) - RxJS powered state management for Angular apps, inspired by Redux.
- [Store Devtools](guide/store-devtools) - Instrumentation for @ngrx/store enabling time-travel debugging.
- [Effects](guide/effects) - Side effect model for @ngrx/store.
- [Router Store](guide/router-store) - Bindings to connect the Angular Router to @ngrx/store.
- [Entity](guide/entity) - Entity State adapter for managing record collections.
- [NgRx Data](guide/data) - Extension for simplified entity data management.
- [NgRx Component](guide/component) - Extension for fully reactive, fully zone-less applications.
- [ComponentStore](guide/component-store) - Standalone library for managing local/component state.
- [Schematics](guide/schematics) - Scaffolding library for Angular applications using NgRx libraries.
