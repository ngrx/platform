## Lifecycle Hooks

You can also create lifecycle hooks that are called when the store is created and destroyed, to initialize fetching data, updating state, and more.

```ts
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
  withComputed(({ count }) => ({
    doubleCount: computed(() => count() * 2),
  })),
  withMethods(({ count, ...store }) => ({
    increment() {
      patchState(store, { count: count() + 1 });
    },
    decrement() {
      patchState(store, { count: count() - 1 });
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
```

In the example above, the `onInit` hook subscribes to an interval observable, calls the `increment` method on the store to increment the count every 2 seconds. The lifecycle methods also have access to the injection context for automatic cleanup using `takeUntilDestroyed()` function from Angular.