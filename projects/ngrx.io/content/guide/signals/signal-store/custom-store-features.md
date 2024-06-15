# Custom Store Features

Custom SignalStore features provide a robust mechanism for extending core functionality and encapsulating common patterns, facilitating reuse across multiple stores.

## Creating a Custom Feature

A custom feature is created using the `signalStoreFeature` function, which accepts a sequence of base or other custom features as input arguments and merges them into a single feature.

### Example 1: Tracking Request Status

The following example demonstrates how to create a custom feature that includes a `requestStatus` state property along with computed properties for checking the request status.

<code-example header="request-status.feature.ts">

import { computed } from '@angular/core';
import { signalStoreFeature, withComputed, withState } from '@ngrx/signals';

export type RequestStatus = 'idle' | 'pending' | 'fulfilled' | { error: string };
export type RequestStatusState = { requestStatus: RequestStatus };

export function withRequestStatus() {
  return signalStoreFeature(
    withState&lt;RequestStatusState&gt;({ requestStatus: 'idle' }),
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

</code-example>

In addition to the state and computed properties, this feature also specifies a set of state updaters for modifying the request status.

<code-example header="request-status.feature.ts">

export function setPending(): RequestStatusState {
  return { requestStatus: 'pending' };
}

export function setFulfilled(): RequestStatusState {
  return { requestStatus: 'fulfilled' };
}

export function setError(error: string): RequestStatusState {
  return { requestStatus: { error } };
}

</code-example>

<div class="alert is-important">

For a custom feature, it is recommended to define state updaters as standalone functions rather than feature methods. This approach enables tree-shaking, simplifies testing, and facilitates their use alongside other updaters in a single `patchState` call.

</div>

The `withRequestStatus` feature and updaters can be used to add the `requestStatus` state property, along with the `isPending`, `isFulfilled`, and `error` computed properties to the `BooksStore`, as follows:

<code-example header="books.store.ts">

import { inject } from '@angular/core';
import { patchState, signalStore, withMethods } from '@ngrx/signals';
import { setAllEntities, withEntities } from '@ngrx/signals/entities';
import { setFulfilled, setPending, withRequestStatus } from './request-status.feature';
import { Book } from './book.model';
import { BooksService } from './books.service';

export const BooksStore = signalStore(
  withEntities&lt;Book&gt;(),
  withRequestStatus(),
  withMethods((store, booksService = inject(BooksService)) => ({
    async loadAll() {
      patchState(store, setPending());

      const books = await booksService.getAll();
      patchState(store, setAllEntities(books), setFulfilled());
    },
  })),
);

</code-example>

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

<div class="alert is-helpful">

In this example, the `withEntities` feature from the `entities` plugin is utilized.
For more details, refer to the [Entity Management guide](guide/signals/signal-store/entity-management).

</div>

### Example 2: Logging State Changes

The following example shows how to create a custom feature that logs SignalStore state changes to the console.

<code-example header="logger.feature.ts">

import { effect } from '@angular/core';
import { getState, signalStoreFeature, withHooks } from '@ngrx/signals';

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

</code-example>

The `withLogger` feature can be used in the `BooksStore` as follows:

<code-example header="books.store.ts">

import { signalStore } from '@ngrx/signals';
import { withEntities } from '@ngrx/signals/entities';
import { withRequestStatus } from './request-status.feature';
import { withLogger } from './logger.feature';
import { Book } from './book.model';

export const BooksStore = signalStore(
  withEntities&lt;Book&gt;(),
  withRequestStatus(),
  withLogger('books')
);

</code-example>

State changes will be logged to the console whenever the `BooksStore` state is updated.

## Creating a Custom Feature with Input

The `signalStoreFeature` function provides the ability to create a custom feature that requires a specific state, computed properties, and/or methods to be defined in the store where it is used.
This enables the utilization of input properties within the custom feature, even if they are not explicitly defined within the feature itself.

The expected input type should be defined as the first argument of the `signalStoreFeature` function, using the `type` helper function from the `@ngrx/signals` package.

<div class="alert is-important">

It's recommended to define loosely-coupled/independent features whenever possible.

</div>

### Example 3: Managing Selected Entity

The following example demonstrates how to create the `withSelectedEntity` feature.

<code-example header="selected-entity.feature.ts">

import { computed } from '@angular/core';
import { signalStoreFeature, type, withComputed, withState } from '@ngrx/signals';
import { EntityId, EntityState } from '@ngrx/signals/entities';

export type SelectedEntityState = { selectedEntityId: EntityId | null };

export function withSelectedEntity&lt;Entity&gt;() {
  return signalStoreFeature(
    { state: type&lt;EntityState&lt;Entity&gt;&gt;() },
    withState&lt;SelectedEntityState&gt;({ selectedEntityId: null }),
    withComputed(({ entityMap, selectedEntityId }) => ({
      selectedEntity: computed(() => {
        const selectedId = selectedEntityId();
        return selectedId ? entityMap()[selectedId] : null;
      }),
    }))
  );
}

</code-example>

The `withSelectedEntity` feature adds the `selectedEntityId` state property and `selectedEntity` computed property to the store where it is used.
However, it expects state properties from the `EntityState` type to be defined in that store.
These properties can be added to the store by using the `withEntities` feature from the `entities` plugin.

<code-example header="books.store.ts">

import { signalStore } from '@ngrx/signals';
import { withEntities } from '@ngrx/signals/entities';
import { withSelectedEntity } from './selected-entity.feature';
import { Book } from './book.model';

export const BooksStore = signalStore(
  withEntities&lt;Book&gt;(),
  withSelectedEntity()
);

</code-example>

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

<code-example header="books.store.ts">

import { signalStore } from '@ngrx/signals';
import { withSelectedEntity } from './selected-entity.feature';
import { Book } from './book.model';

export const BooksStore = signalStore(
  withState({ books: [] as Book[], isLoading: false }),
  // Error: `EntityState` properties (`entityMap` and `ids`) are missing in the `BooksStore`.
  withSelectedEntity()
);

</code-example>

### Example 4: Defining Computed Props and Methods as Input

In addition to state, it's also possible to define expected computed properties (signals) and methods in the following way:

<code-example header="baz.feature.ts">

import { Signal } from '@angular/core';
import { signalStoreFeature, type, withMethods } from '@ngrx/signals';

export function withBaz() {
  return signalStoreFeature(
    {
      computed: type&lt;{ foo: Signal&lt;number&gt; }&gt;(),
      methods: type&lt;{ bar(): void }&gt;(),
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

</code-example>

The `withBaz` feature can only be used in a store where the computed property `foo` and the method `bar` are defined. 
