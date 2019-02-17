# Entity overview

Entity State adapter for managing record collections.

Entity provides an API to manipulate and query entity collections.

- Reduces boilerplate for creating reducers that manage a collection of models.
- Provides performant CRUD operations for managing entity collections.
- Extensible type-safe adapters for selecting entity information.

## Installation 

Detailed installation instructions can be found on the [Installation](guide/entity/install) page.

## Important! 

The Entity State adapter is only compatible with plain javascript objects. This means, for example, you cannot use it to store ES6 class instances. See issue [#976](https://github.com/ngrx/platform/issues/976). Unfortunately for you, the linked issue does not explain *why* we made this decision.
