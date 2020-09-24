# Why use NgRx Store for State Management?

NgRx Store provides state management for creating maintainable, explicit applications through the use of single state and actions in order to express state changes. In cases where you don't need a global, application-wide solution to manage state, consider using [NgRx ComponentStore](guide/component) which provides a solution for local state management.

## When Should I Use NgRx Store for State Management?

In particular, you might use NgRx when you build an application with a lot of user interactions and multiple data sources, or when managing state in services are no longer sufficient.

A good guideline that might help answer the question, "Do I need NgRx Store?" is the
<a href="https://youtu.be/omnwu_etHTY" target="_blank">**SHARI**</a> principle:

- **S**hared: state that is accessed by many components and services.

- **H**ydrated: state that is persisted and rehydrated from external storage.

- **A**vailable: state that needs to be available when re-entering routes.

- **R**etrieved: state that must be retrieved with a side-effect.

- **I**mpacted: state that is impacted by actions from other sources.

However, realizing that using NgRx Store comes with some tradeoffs is also crucial. It is not meant to be the shortest or quickest way to write code. It also encourages the usage of many files.

It's also important to consider the patterns implemented with NgRx Store. A solid understanding of [`RxJS`](https://rxjs.dev) and [`Redux`](https://redux.js.org/) will be very beneficial before learning to use NgRx Store and the other state management libraries.

## Key Concepts

### Type Safety

Type safety is promoted throughout the architecture with reliance on the TypeScript compiler for program correctness. In addition to this, NgRx's strictness of type safety and the use of patterns lends itself well to the creation of higher quality code.

### Immutability and Performance

[Store](guide/store) is built on a single, immutable data structure which makes change detection a relatively straightforward task using the [`OnPush`](https://angular.io/api/core/ChangeDetectionStrategy#OnPush) strategy. NgRx Store also provides APIs for creating memoized selector functions that optimize retrieving data from your state.

### Encapsulation

Using NgRx [Effects](guide/effects) and [Store](guide/store), any interaction with external resources side effects such as network requests or web sockets, as well as any business logic, can be isolated from the UI. This isolation allows for more pure and simple components and upholds the single responsibility principle.

### Serializability

By normalizing state changes and passing them through observables, NgRx provides serializability and ensures the state is predictably stored. This allows the state to be saved to external storage such as `localStorage`.

This also allows the inspection, download, upload, and the dispatch of actions all from the [Store Devtools](guide/store-devtools).

### Testable

Because [Store](guide/store) uses pure functions for changing and selecting data from state, as well as the ability to isolate side effects from the UI, testing becomes very straightforward.
NgRx also provides test resources such as `provideMockStore` and `provideMockActions` for isolated tests and an overall better test experience.
