# Entity overview

Entity State adapter for managing record collections.

Entity provides an API to manipulate and query entity collections.

- Reduces boilerplate for creating reducers that manage a collection of models.
- Provides performant CRUD operations for managing entity collections.
- Extensible type-safe adapters for selecting entity information.

## Installation 

Detailed installation instructions can be found on the [Installation](guide/entity/install) page.

## Entity and class instances

The Entity State adapter is only compatible with plain javascript objects. This means, for example, you cannot use it to store ES6 class instances. This limitation exists to enforce our desired "best practice" that you only use `@ngrx/store` to store plain javascript objects (as well as potentially reduce user-error bug reports). Some reasons why you should only store plain javascript objects in `@ngrx/store`.

1. Guarantee that the data structures contained in state don't themselves contain logic, reducing the chance that they'll mutate themselves
2. State will always be serializable allowing you to store and rehydrate from browser storage mechanisms like local storage
3. State can be inspected via the Redux Devtools.

This will always be a core constraint of NgRx and will not change in the future. The [Redux docs](https://redux.js.org/faq/organizingstate#can-i-put-functions-promises-or-other-non-serializable-items-in-my-store-state) may offer more insight into this constraint.

The proper way to interact with @ngrx/entities is to pass it in plain JavaScript objects that are typed with interfaces.
