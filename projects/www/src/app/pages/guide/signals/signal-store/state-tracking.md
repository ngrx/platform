# State Tracking

State tracking enables the implementation of custom SignalStore features such as logging, state undo/redo, and storage synchronization.

## Using `getState` and `effect`

The `getState` function is used to get the current state value of the SignalStore.
When used within a reactive context, state changes are automatically tracked.

<ngrx-code-example header="counter-store.ts">

```ts
import { effect } from '@angular/core';
import {
  getState,
  patchState,
  signalStore,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';

export const CounterStore = signalStore(
  withState({ count: 0 }),
  withMethods((store) => ({
    increment(): void {
      patchState(store, { count: store.count() + 1 });
    },
  })),
  withHooks({
    onInit(store) {
      effect(() => {
        // 👇 The effect is re-executed on state change.
        const state = getState(store);
        console.log('counter state', state);
      });

      setInterval(() => store.increment(), 1_000);
    },
  })
);
```

</ngrx-code-example>

Due to the `effect` glitch-free behavior, if the state is changed multiple times in the same tick, the effect function will be executed only once with the final state value.
While the asynchronous effect execution is beneficial for performance reasons, functionalities such as state undo/redo require tracking all SignalStore's state changes without coalescing state updates in the same tick.

## Using `watchState`

The `watchState` function allows for synchronous tracking of SignalStore's state changes.
It accepts a SignalStore instance as the first argument and a watcher function as the second argument.

By default, the `watchState` function needs to be executed within an injection context.
It is tied to its lifecycle and is automatically cleaned up when the injector is destroyed.

<ngrx-code-example header="counter-store.ts">

```ts
import { effect } from '@angular/core';
import {
  getState,
  patchState,
  signalStore,
  watchState,
  withHooks,
  withState,
} from '@ngrx/signals';

export const CounterStore = signalStore(
  withState({ count: 0 }),
  withMethods((store) => ({
    increment(): void {
      patchState(store, { count: store.count() + 1 });
    },
  })),
  withHooks({
    onInit(store) {
      watchState(store, (state) => {
        console.log('[watchState] counter state', state);
      }); // logs: { count: 0 }, { count: 1 }, { count: 2 }

      effect(() => {
        console.log('[effect] counter state', getState(store));
      }); // logs: { count: 2 }

      store.increment();
      store.increment();
    },
  })
);
```

</ngrx-code-example>

In the example above, the `watchState` function will execute the provided watcher 3 times: once with the initial counter state value and two times after each increment.
Conversely, the `effect` function will be executed only once with the final counter state value.

### Manual Cleanup

If a state watcher needs to be cleaned up before the injector is destroyed, manual cleanup can be performed by calling the `destroy` method.

<ngrx-code-example header="counter-store.ts">

```ts
import {
  patchState,
  signalStore,
  watchState,
  withHooks,
  witMethods,
  withState,
} from '@ngrx/signals';

export const CounterStore = signalStore(
  withState({ count: 0 }),
  withMethods((store) => ({
    increment(): void {
      patchState(store, { count: store.count() + 1 });
    },
  })),
  withHooks({
    onInit(store) {
      const { destroy } = watchState(store, console.log);

      setInterval(() => store.increment(), 1_000);

      // 👇 Stop watching after 5 seconds.
      setTimeout(() => destroy(), 5_000);
    },
  })
);
```

</ngrx-code-example>

### Usage Outside of Injection Context

The `watchState` function can be used outside an injection context by providing an injector as the second argument.

<ngrx-code-example header="counter.ts">

```ts
import { Component, inject, Injector, OnInit } from '@angular/core';
import { watchState } from '@ngrx/signals';
import { CounterStore } from './counter-store';

@Component({
  /* ... */
  providers: [CounterStore],
})
export class Counter implements OnInit {
  readonly #injector = inject(Injector);
  readonly store = inject(CounterStore);

  ngOnInit(): void {
    watchState(this.store, console.log, {
      injector: this.#injector,
    });

    setInterval(() => this.store.increment(), 2_000);
  }
}
```

</ngrx-code-example>
