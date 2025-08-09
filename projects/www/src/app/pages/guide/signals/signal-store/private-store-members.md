# Private Store Members

SignalStore allows defining private members that cannot be accessed from outside the store by using the `_` prefix.
This includes root-level state slices, properties, and methods.

<code-tabs>
<code-pane header="counter-store.ts">

```ts
import { computed } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import {
    patchState,
    signalStore,
    withComputed,
    withMethods,
    withProps,
    withState,
} from '@ngrx/signals';

export const CounterStore = signalStore(
    withState({
        count1: 0,
        // 👇 private state slice
        _count2: 0,
    }),
    withComputed(({ count1, _count2 }) => ({
        // 👇 private computed signal
        _doubleCount1: computed(() => count1() _ 2),
        doubleCount2: computed(() => _count2() _ 2),
    })),
    withProps(({ count2, _doubleCount1 }) => ({
        // 👇 private property
        _count2$: toObservable(count2),
        doubleCount1$: toObservable(_doubleCount1),
    })),
    withMethods((store) => ({
        increment1(): void {
            patchState(store, { count1: store.count1() + 1 });
        },
        // 👇 private method
        _increment2(): void {
            patchState(store, { _count2: store._count2() + 1 });
        },
    })),
);
```

</code-pane>

<code-pane header="counter.ts">

```ts
import { Component, inject, OnInit } from '@angular/core';
import { CounterStore } from './counter-store';

@Component({
  /* ... */
  providers: [CounterStore],
})
export class Counter implements OnInit {
  readonly store = inject(CounterStore);

  ngOnInit(): void {
    console.log(this.store.count1()); // ✅
    console.log(this.store._count2()); // ❌

    console.log(this.store._doubleCount1()); // ❌
    console.log(this.store.doubleCount2()); // ✅

    this.store._count2$.subscribe(console.log); // ❌
    this.store.doubleCount1$.subscribe(console.log); // ✅

    this.store.increment1(); // ✅
    this.store._increment2(); // ❌
  }
}
```

</code-pane>
</code-tabs>
