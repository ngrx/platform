# Lifecycle Hooks

The `@ngrx/signals` package provides the @ngrx/signals!withHooks:function feature for incorporating lifecycle hooks into a SignalStore.
This feature enables performing additional logic when the store is initialized or destroyed.

The @ngrx/signals!withHooks:function feature has two signatures.
The first signature expects an object with `onInit` and/or `onDestroy` methods.
Both methods receive the store instance as input arguments.

<ngrx-code-example header="counter.store.ts">

```ts
import { computed } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { interval } from 'rxjs';
import {
  patchState,
  signalStore,
  withState,
  withHooks,
  withMethods,
} from '@ngrx/signals';

export const CounterStore = signalStore(
  withState({ count: 0 }),
  withMethods((store) => ({
    increment(): void {
      patchState(store, (state) => ({ count: state.count + 1 }));
    },
  })),
  withHooks({
    onInit(store) {
      // 👇 Increment the `count` every 2 seconds.
      interval(2_000)
        // 👇 Automatically unsubscribe when the store is destroyed.
        .pipe(takeUntilDestroyed())
        .subscribe(() => store.increment());
    },
    onDestroy(store) {
      console.log('count on destroy', store.count());
    },
  })
);
```

</ngrx-code-example>

The `onInit` hook is executed within the injection context, enabling the injection of dependencies or the utilization of functions that must be invoked within the injection context, such as `takeUntilDestroyed`.

If there is a need to share code between lifecycle hooks or use injected dependencies within the `onDestroy` hook, the second signature can be utilized.
Similar to the @ngrx/signals!withMethods:function and @ngrx/signals!withComputed:function features, the second signature of the @ngrx/signals!withHooks:function feature expects a factory function.
This function receives a store instance as an input argument, returns an object with `onInit` and/or `onDestroy` methods, and is executed within the injection context.

<ngrx-code-example header="counter.store.ts">

```ts
export const CounterStore = signalStore(
  //* ... */
  withHooks((store) => {
    const logger = inject(Logger);
    let interval = 0;

    return {
      onInit() {
        interval = setInterval(() => store.increment(), 2_000);
      },
      onDestroy() {
        logger.info('count on destroy', store.count());
        clearInterval(interval);
      },
    };
  })
);
```

</ngrx-code-example>
