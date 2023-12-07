# Lifecycle Hooks

You can also create lifecycle hooks that are called when the store is created or destroyed.
Lifecycle hooks can be used to initialize fetching data, updating state, and more.

<code-example header="counter.store.ts">
import { computed } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { interval } from 'rxjs';
import {
  signalStore,
  withState,
  patchState,
  withComputed,
  withHooks,
  withMethods,
} from '@ngrx/signals';

export const CounterStore = signalStore(
  withState({ count: 0 }),
  withMethods(({ count, ...store }) => ({
    increment() {
      patchState(store, { count: count() + 1 });
    },
  })),
  withHooks({
    onInit({ increment }) {
      interval(2_000)
        .pipe(takeUntilDestroyed())
        .subscribe(() => increment());
    },
    onDestroy({ count }) {
      console.log('count on destroy', count());
    },
  }),
);
</code-example>

In the example above, the `onInit` hook subscribes to an interval observable, and calls the `increment` method on the store to increment the count every 2 seconds. The lifecycle methods also have access to the injection context for automatic cleanup using the `takeUntilDestroyed()` function from Angular.