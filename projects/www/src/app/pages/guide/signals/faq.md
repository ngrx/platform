# Frequently Asked Questions

<details>
  <summary>How to connect my SignalStore(s) with Redux DevTools?</summary>

There's no official connection between `@ngrx/signals` and the Redux Devtools.
We expect the Angular Devtools will provide support for signals soon, which can be used to track the state.
However, you could create a feature for this, or you can make use of the [`withDevtools` feature](https://github.com/angular-architects/ngrx-toolkit?tab=readme-ov-file#devtools-withdevtools) from the `@angular-architects/ngrx-toolkit` package.

</details>

<details>
  <summary>Can I use the Flux/Redux pattern with SignalStore?</summary>

Yes. Starting from NgRx version 19.2, the Events plugin introduces support for a Flux-style state management with SignalStore.
It enables defining and dispatching events, handling them through reducers and effects, and maintaining a unidirectional data flow similar to the traditional Redux pattern.
For more information, see the Events Plugin documentation.

</details>

<details>
  <summary>Can I define my SignalStore as a class?</summary>

Yes, it is possible to define a SignalStore using a class-based approach.
However, the NgRx team recommends using the functional style for defining SignalStores.

To define a class-based SignalStore, create a new class and extend from `signalStore`.

```ts
@Injectable()
export class CounterStore extends signalStore(
  { protectedState: false },
  withState({ count: 0 })
) {
  readonly doubleCount = computed(() => this.count() * 2);

  increment(): void {
    patchState(this, { count: this.count() + 1 });
  }
}
```

</details>

<details>
  <summary>How can I get the type of a SignalStore?</summary>

To get the type of a SignalStore, use the `InstanceType` utility type.

```ts
const CounterStore = signalStore(withState({ count: 0 }));

type CounterStore = InstanceType<typeof CounterStore>;

function logCount(store: CounterStore): void {
  console.log(store.count());
}
```

</details>

<details>
  <summary>Can I inject a SignalStore via the constructor?</summary>

Yes. To inject a SignalStore via the constructor, define and export its type with the same name.

```ts
// counter-store.ts
export const CounterStore = signalStore(withState({ count: 0 }));

export type CounterStore = InstanceType<typeof CounterStore>;

// counter.ts
import { CounterStore } from './counter.store';

@Component({
  /* ... */
})
export class Counter {
  constructor(readonly store: CounterStore) {}
}
```

</details>
