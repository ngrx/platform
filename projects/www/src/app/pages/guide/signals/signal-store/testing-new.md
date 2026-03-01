# Testing

A SignalStore is an Angular service and is tested like any other service. This guide assumes Vitest; the same ideas apply to other test runners.

Testing can be approached in three ways:

- **Testing the store in isolation** by mocking its dependencies and exercising its API. When doing so, tests should not spy on the store's methods - if a method grows complex, that logic can be extracted into a service; the method calls the service, and the test mocks or fakes the service.
- **Including the store in a wider test**, such as a full feature where both components and store are tested together.
- **Providing a fake or mock of the store** when testing a component or service that uses it.

Guiding principles:

- **Public API only.** Asserting on internal state or calling internal methods ties tests to implementation and makes them brittle.
- **TestBed** is used when testing the store. It supplies dependency injection and the injection context that `rxMethod`, `inject()` inside `withMethods()`, and `withHooks()` need; instantiating the store with `new` won't work for those.

## Different Scopes

A SignalStore can be provided locally or globally. In both cases, `TestBed` can inject it.

For the sake of brevity, the examples below show the store and its test in one snippet.

### Globally provided store

If the store is created with `{ providedIn: 'root' }`, `TestBed.inject(CounterStore)` is enough to instantiate the store.

<ngrx-code-example header="counter-store.ts">

```ts
import { TestBed } from '@angular/core/testing';
import { signalStore, withState } from '@ngrx/signals';

const CounterStore = signalStore(
  { providedIn: 'root' },
  withState({ count: 0 })
);

// Test
describe('CounterStore (global)', () => {
  it('should be defined and have initial count', () => {
    const store = TestBed.inject(CounterStore);

    expect(store).toBeDefined();
    expect(store.count()).toBe(0);
  });
});
```

</ngrx-code-example>

### Locally provided store

If the store is not provided in root, the testing module provides it.

<ngrx-code-example header="counter-store.ts">

```ts
import { TestBed } from '@angular/core/testing';
import { signalStore, withState } from '@ngrx/signals';

const CounterStore = signalStore(withState({ count: 0 }));

// Test
describe('CounterStore (local)', () => {
  it('should be defined and have initial count', () => {
    TestBed.configureTestingModule({
      providers: [CounterStore], // store provided here
    });

    const store = TestBed.inject(CounterStore);

    expect(store).toBeDefined();
    expect(store.count()).toBe(0);
  });
});
```

</ngrx-code-example>

## SignalStore Members

A SignalStore is tested like any other Angular service by asserting on initial state, on derived values, and on the effect of calling its methods. The following example uses the same `CounterStore` as in the previous section, extended with a computed value and a method. `CounterStore` doesn't have any dependencies or async operations.

<ngrx-code-example header="counter-store.ts">

```ts
import { computed } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';

const CounterStore = signalStore(
  { providedIn: 'root' },
  withState({ count: 0 }),
  withComputed(({ count }) => ({
    doubleCount: computed(() => count() * 2),
  })),
  withMethods((store) => ({
    increment() {
      patchState(store, { count: store.count() + 1 });
    },
  }))
);

// Test
describe('CounterStore', () => {
  it('should have initial state and derived doubleCount', () => {
    const store = TestBed.inject(CounterStore);

    expect(store.count()).toBe(0);
    expect(store.doubleCount()).toBe(0);
  });

  it('should update doubleCount when count changes via increment', () => {
    const store = TestBed.inject(CounterStore);

    store.increment();
    expect(store.count()).toBe(1);
    expect(store.doubleCount()).toBe(2);

    store.increment();
    expect(store.count()).toBe(2);
    expect(store.doubleCount()).toBe(4);
  });
});
```

</ngrx-code-example>

## The `unprotected` helper

`patchState` cannot update a SignalStore instance whose state is protected (the default). Setting state directly is sometimes needed to when the necessary public setters are not available.

Wrapping the store instance with `unprotected` returns a writable view that can be updated with `patchState`.

To assert that the computed `doubleCount` updates when `count` changes, the state is patched via `unprotected` and the computed is read from the store.

<ngrx-code-example header="counter-store.ts">

```ts
import { computed } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import {
  patchState,
  signalStore,
  withComputed,
  withState,
} from '@ngrx/signals';
import { unprotected } from '@ngrx/signals/testing';

const CounterStore = signalStore(
  { providedIn: 'root' },
  withState({ count: 0 }),
  withComputed(({ count }) => ({
    doubleCount: computed(() => count() * 2),
  }))
);

// Test
describe('CounterStore', () => {
  it('recomputes doubleCount when count is patched via unprotected', () => {
    const store = TestBed.inject(CounterStore);

    patchState(unprotected(store), { count: 5 });

    expect(store.count()).toBe(5);
    expect(store.doubleCount()).toBe(10);
  });
});
```

</ngrx-code-example>
