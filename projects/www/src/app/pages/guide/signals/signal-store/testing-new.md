# Testing SignalStore

A SignalStore is an Angular service and is tested like any other service. This guide assumes Vitest; the same ideas apply to other test runners.

Testing can be approached in three ways:

- **Testing the store in isolation** by mocking its dependencies and exercising its API. When doing so, tests should not spy on the store's methods - if a method grows complex, that logic can be extracted into a service; the method calls the service, and the test mocks or fakes the service.
- **Including the store in a wider test**, such as a full feature where both components and store are tested together.
- **Providing a fake or mock of the store** when testing a component or service that uses it.

Guiding principles:

- **Public API only.** Asserting on internal state or calling internal methods ties tests to implementation and makes them brittle.
- **TestBed** is used when testing the store. It supplies dependency injection and the injection context that many features like `rxMethod()`, `signalMethod()`, and `inject()` require; instantiating the store with `new` won't work for those.

## Testing SignalStores with Different Scopes

A SignalStore can be provided locally or globally. In both cases, `TestBed` can inject it.

For the sake of brevity, the test examples contain both the implementation and the test.

### Globally provided store

If the store is created with `{ providedIn: 'root' }`, `TestBed.inject(CounterStore)` is enough to instantiate the store.

<ngrx-code-example header="counter-store.spec.ts">

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

<ngrx-code-example header="counter-store.spec.ts">

```ts
import { TestBed } from '@angular/core/testing';
import { signalStore, withState } from '@ngrx/signals';

const CounterStore = signalStore(withState({ count: 0 }));

// Test
describe('CounterStore (local)', () => {
  it('should be defined and have initial count', () => {
    TestBed.configureTestingModule({
      // 👇 provide the store in the testing module
      providers: [CounterStore],
    });

    const store = TestBed.inject(CounterStore);

    expect(store).toBeDefined();
    expect(store.count()).toBe(0);
  });
});
```

</ngrx-code-example>

## Testing SignalStore Members

A SignalStore is tested like any other Angular service by asserting on initial state, on derived values, and on the effect of calling its methods. The following example uses the same `CounterStore` as in the previous section, extended with a computed value and a method. `CounterStore` doesn't have any dependencies or async operations.

<ngrx-code-example header="counter-store.spec.ts">

```ts
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
    doubleCount: () => count() * 2,
  })),
  withMethods((store) => ({
    increment() {
      patchState(store, ({ count }) => ({ count: count + 1 }));
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

`patchState` cannot update a SignalStore instance whose state is protected (the default). Setting state directly is sometimes needed when the necessary public setters are not available.

Wrapping the store instance with `unprotected` returns a writable view that can be updated with `patchState`.

To assert that the computed `doubleCount` updates when `count` changes, the state is patched via `unprotected` and the computed is read from the store.

<ngrx-code-example header="counter-store.spec.ts">

```ts
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
    doubleCount: () => count() * 2,
  }))
);

// Test
describe('CounterStore', () => {
  it('recomputes doubleCount when count is patched via unprotected', () => {
    const store = TestBed.inject(CounterStore);

    //         👇 makes the store writable
    patchState(unprotected(store), { count: 5 });

    expect(store.count()).toBe(5);
    expect(store.doubleCount()).toBe(10);
  });
});
```

</ngrx-code-example>

## Mocking SignalStore Dependencies

When a store injects a service (for example inside `withMethods`), a test could mock that service.

The most straightforward approach is to register the dependency with `useValue` and provide an object that implements the methods the store uses. In the following example, the `CounterStore` depends on a `StepService` to determine the increment step; the test provides a mock `StepService` returning a fixed step so that assertions are predictable.

<ngrx-code-example header="counter-store.spec.ts">

```ts
import { TestBed } from '@angular/core/testing';
import {
  patchState,
  signalStore,
  withMethods,
  withState,
} from '@ngrx/signals';
import { inject, Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
class StepService {
  getStep() {
    return 1;
  }
}

const CounterStore = signalStore(
  { providedIn: 'root' },
  withState({ count: 0 }),
  withMethods((store, stepService = inject(StepService)) => ({
    increment() {
      patchState(store, ({ count }) => ({
        count: count + stepService.getStep(),
      }));
    },
  }))
);

// Test
describe('CounterStore with StepService', () => {
  it('increments by the step returned by the injected service', () => {
    const mockStepService = { getStep: () => 3 };

    TestBed.configureTestingModule({
      providers: [
        //                      👇 provide the mock service
        { provide: StepService, useValue: mockStepService },
      ],
    });

    const store = TestBed.inject(CounterStore);

    store.increment();

    expect(store.count()).toBe(3);
  });
});
```

</ngrx-code-example>

## Testing `signalMethod`

When testing a store that exposes a method created with [`signalMethod`](/guide/signals/signal-method), the `TestBed` supplies the injection context. When the method is called with a Signal, the test must wait for the effect (e.g. `TestBed.tick()` or `expect.poll`) before asserting. Additionally, the call must be made within an injection context.

<ngrx-code-example header="counter-store.spec.ts">

```ts
import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import {
  patchState,
  signalStore,
  signalMethod,
  withMethods,
  withState,
} from '@ngrx/signals';

const CounterStore = signalStore(
  { providedIn: 'root' },
  withState({ count: 0 }),
  withMethods((store) => ({
    increment: signalMethod<number>((step) => {
      patchState(store, ({ count }) => ({ count: count + step }));
    }),
  }))
);

// Test
describe('CounterStore with signalMethod', () => {
  it('increments by a static step synchronously', () => {
    const store = TestBed.inject(CounterStore);

    store.increment(1);
    expect(store.count()).toBe(1);

    store.increment(2);
    expect(store.count()).toBe(3);
  });

  it('increments by a signal step after tick', async () => {
    const store = TestBed.inject(CounterStore);
    const step = signal(2);

    TestBed.runInInjectionContext(() => store.increment(step));
    expect(store.count()).toBe(0);

    await expect.poll(() => store.count()).toBe(2);

    step.set(3);
    await expect.poll(() => store.count()).toBe(5);

    // Alternatively, TestBed.tick() would flush the effect
    step.set(1);
    TestBed.tick();
    expect(store.count()).toBe(6);
  });
});
```

</ngrx-code-example>
