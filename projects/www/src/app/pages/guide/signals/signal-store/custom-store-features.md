# Custom Store Features

Custom SignalStore features provide a robust mechanism for extending core functionality and encapsulating common patterns, facilitating reuse across multiple stores.

## Creating a Custom Feature

A custom feature is created using the `signalStoreFeature` function, which accepts a sequence of base or other custom features as input arguments and merges them into a single feature.

### Example 1: Tracking Request Status

The following example demonstrates how to create a custom feature that includes a `requestStatus` state property along with computed properties for checking the request status.

<ngrx-code-example header="request-status.feature.ts">

```ts
import { computed } from '@angular/core';
import {
  signalStoreFeature,
  withComputed,
  withState,
} from '@ngrx/signals';

export type RequestStatus =
  | 'idle'
  | 'pending'
  | 'fulfilled'
  | { error: string };
export type RequestStatusState = { requestStatus: RequestStatus };

export function withRequestStatus() {
  return signalStoreFeature(
    withState<RequestStatusState>({ requestStatus: 'idle' }),
    withComputed(({ requestStatus }) => ({
      isPending: computed(() => requestStatus() === 'pending'),
      isFulfilled: computed(() => requestStatus() === 'fulfilled'),
      error: computed(() => {
        const status = requestStatus();
        return typeof status === 'object' ? status.error : null;
      }),
    }))
  );
}
```

</ngrx-code-example>

In addition to the state and computed properties, this feature also specifies a set of state updaters for modifying the request status.

<ngrx-code-example header="request-status.feature.ts">

```ts
export function setPending(): RequestStatusState {
  return { requestStatus: 'pending' };
}

export function setFulfilled(): RequestStatusState {
  return { requestStatus: 'fulfilled' };
}

export function setError(error: string): RequestStatusState {
  return { requestStatus: { error } };
}
```

</ngrx-code-example>

<ngrx-docs-alert type="inform">

For a custom feature, it is recommended to define state updaters as standalone functions rather than feature methods. This approach enables tree-shaking, simplifies testing, and facilitates their use alongside other updaters in a single `patchState` call.

</ngrx-docs-alert>

The `withRequestStatus` feature and updaters can be used to add the `requestStatus` state property, along with the `isPending`, `isFulfilled`, and `error` computed properties to the `BooksStore`, as follows:

<ngrx-code-example header="books.store.ts">

```ts
import { inject } from '@angular/core';
import { patchState, signalStore, withMethods } from '@ngrx/signals';
import { setAllEntities, withEntities } from '@ngrx/signals/entities';
import {
  setFulfilled,
  setPending,
  withRequestStatus,
} from './request-status.feature';
import { Book } from './book.model';
import { BooksService } from './books.service';

export const BooksStore = signalStore(
  withEntities<Book>(),
  withRequestStatus(),
  withMethods((store, booksService = inject(BooksService)) => ({
    async loadAll() {
      patchState(store, setPending());

      const books = await booksService.getAll();
      patchState(store, setAllEntities(books), setFulfilled());
    },
  }))
);
```

</ngrx-code-example>

The `BooksStore` instance will contain the following properties and methods:

- State properties from `withEntities` feature:
  - `entityMap: Signal<EntityMap<Book>>`
  - `ids: Signal<EntityId[]>`
- Computed properties from `withEntities` feature:
  - `entities: Signal<Book[]>`
- State properties from `withRequestStatus` feature:
  - `requestStatus: Signal<RequestStatus>`
- Computed properties from `withRequestStatus` feature:
  - `isPending: Signal<boolean>`
  - `isFulfilled: Signal<boolean>`
  - `error: Signal<string | null>`
- Methods:
  - `loadAll(): Promise<void>`

<ngrx-docs-alert type="help">

In this example, the `withEntities` feature from the `entities` plugin is utilized.
For more details, refer to the [Entity Management guide](guide/signals/signal-store/entity-management).

</ngrx-docs-alert>

### Example 2: Logging State Changes

The following example shows how to create a custom feature that logs SignalStore state changes to the console.

<ngrx-code-example header="logger.feature.ts">

```ts
import { effect } from '@angular/core';
import {
  getState,
  signalStoreFeature,
  withHooks,
} from '@ngrx/signals';

export function withLogger(name: string) {
  return signalStoreFeature(
    withHooks({
      onInit(store) {
        effect(() => {
          const state = getState(store);
          console.log(`${name} state changed`, state);
        });
      },
    })
  );
}
```

</ngrx-code-example>

The `withLogger` feature can be used in the `BooksStore` as follows:

<ngrx-code-example header="books.store.ts">

```ts
import { signalStore } from '@ngrx/signals';
import { withEntities } from '@ngrx/signals/entities';
import { withRequestStatus } from './request-status.feature';
import { withLogger } from './logger.feature';
import { Book } from './book.model';

export const BooksStore = signalStore(
  withEntities<Book>(),
  withRequestStatus(),
  withLogger('books')
);
```

</ngrx-code-example>

State changes will be logged to the console whenever the `BooksStore` state is updated.

## Creating a Custom Feature with Input

The `signalStoreFeature` function provides the ability to create a custom feature that requires a specific state, computed properties, and/or methods to be defined in the store where it is used.
This enables the utilization of input properties within the custom feature, even if they are not explicitly defined within the feature itself.

The expected input type should be defined as the first argument of the `signalStoreFeature` function, using the `type` helper function from the `@ngrx/signals` package.

<ngrx-docs-alert type="inform">

It's recommended to define loosely-coupled/independent features whenever possible.

</ngrx-docs-alert>

### Example 3: Managing Selected Entity

The following example demonstrates how to create the `withSelectedEntity` feature.

<ngrx-code-example header="selected-entity.feature.ts">

```ts
import { computed } from '@angular/core';
import {
  signalStoreFeature,
  type,
  withComputed,
  withState,
} from '@ngrx/signals';
import { EntityId, EntityState } from '@ngrx/signals/entities';

export type SelectedEntityState = {
  selectedEntityId: EntityId | null;
};

export function withSelectedEntity<Entity>() {
  return signalStoreFeature(
    { state: type<EntityState<Entity>>() },
    withState<SelectedEntityState>({ selectedEntityId: null }),
    withComputed(({ entityMap, selectedEntityId }) => ({
      selectedEntity: computed(() => {
        const selectedId = selectedEntityId();
        return selectedId ? entityMap()[selectedId] : null;
      }),
    }))
  );
}
```

</ngrx-code-example>

The `withSelectedEntity` feature adds the `selectedEntityId` state property and `selectedEntity` computed property to the store where it is used.
However, it expects state properties from the `EntityState` type to be defined in that store.
These properties can be added to the store by using the `withEntities` feature from the `entities` plugin.

<ngrx-code-example header="books.store.ts">

```ts
import { signalStore } from '@ngrx/signals';
import { withEntities } from '@ngrx/signals/entities';
import { withSelectedEntity } from './selected-entity.feature';
import { Book } from './book.model';

export const BooksStore = signalStore(
  withEntities<Book>(),
  withSelectedEntity()
);
```

</ngrx-code-example>

The `BooksStore` instance will contain the following properties:

- State properties from `withEntities` feature:
  - `entityMap: Signal<EntityMap<Book>>`
  - `ids: Signal<EntityId[]>`
- Computed properties from `withEntities` feature:
  - `entities: Signal<Book[]>`
- State properties from `withSelectedEntity` feature:
  - `selectedEntityId: Signal<EntityId | null>`
- Computed properties from `withSelectedEntity` feature:
  - `selectedEntity: Signal<Book | null>`

The `@ngrx/signals` package offers high-level type safety.
Therefore, if `BooksStore` does not contain state properties from the `EntityState` type, the compilation error will occur.

<ngrx-code-example header="books.store.ts">

```ts
import { signalStore } from '@ngrx/signals';
import { withSelectedEntity } from './selected-entity.feature';
import { Book } from './book.model';

export const BooksStore = signalStore(
  withState({ books: [] as Book[], isLoading: false }),
  // Error: `EntityState` properties (`entityMap` and `ids`) are missing in the `BooksStore`.
  withSelectedEntity()
);
```

</ngrx-code-example>

### Example 4: Defining Computed Props and Methods as Input

In addition to state, it's also possible to define expected computed properties (signals) and methods in the following way:

<ngrx-code-example header="baz.feature.ts">

```ts
import { computed, Signal } from '@angular/core';
import {
  signalStoreFeature,
  type,
  withComputed,
  withHooks,
} from '@ngrx/signals';

export function withBaz() {
  return signalStoreFeature(
    {
      signals: type<{ foo: Signal<number> }>(),
      methods: type<{ bar(): void }>(),
    },
    withMethods(({ foo, bar }) => ({
      baz() {
        if (foo() > 10) {
          bar();
        }
      },
    }))
  );
}
```

</ngrx-code-example>

The `withBaz` feature can only be used in a store where the computed property `foo` and the method `bar` are defined.
