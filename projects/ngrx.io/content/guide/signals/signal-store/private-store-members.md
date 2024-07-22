# Private Store Members

SignalStore allows defining private members that cannot be accessed from outside the store by using the `_` prefix.
This includes root-level state slices, computed signals, and methods.

<code-tabs linenums="false">
<code-pane header="counter.store.ts">

import { computed } from '@angular/core';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
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
    _doubleCount1: computed(() => count1() * 2),
    doubleCount2: computed(() => _count2() * 2),
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

</code-pane>

<code-pane header="counter.component.ts">

import { Component, inject, OnInit } from '@angular/core';
import { CounterStore } from './counter.store';

@Component({
  /* ... */
  providers: [CounterStore],
})
export class CounterComponent implements OnInit {
  readonly store = inject(CounterStore);

  ngOnInit(): void {
    console.log(this.store.count1()); // ✅
    console.log(this.store._count2()); // ❌

    console.log(this.store._doubleCount1()); // ❌
    console.log(this.store.doubleCount2()); // ✅

    this.store.increment1(); // ✅
    this.store._increment2(); // ❌
  }
}

</code-pane>
</code-tabs>
