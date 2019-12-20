# @ngrx/entity

Entity State adapter for managing record collections.

Entity provides an API to manipulate and query entity collections.

- Reduces boilerplate for creating reducers that manage a collection of models.
- Provides performant CRUD operations for managing entity collections.
- Extensible type-safe adapters for selecting entity information.

## Installation 

Detailed installation instructions can be found on the [Installation](guide/entity/install) page.

## Entity and class instances

Entity promotes the use of plain JavaScript objects when managing collections. *ES6 class instances will be transformed into plain JavaScript objects when entities are managed in a collection*. This provides you with some assurances when managing these entities:

1. Guarantee that the data structures contained in state don't themselves contain logic, reducing the chance that they'll mutate themselves.
2. State will always be serializable allowing you to store and rehydrate from browser storage mechanisms like local storage.
3. State can be inspected via the Redux Devtools.

This is one of the [core principles](docs) of NgRx. The [Redux docs](https://redux.js.org/faq/organizing-state#can-i-put-functions-promises-or-other-non-serializable-items-in-my-store-state) also offers some more insight into this constraint.
