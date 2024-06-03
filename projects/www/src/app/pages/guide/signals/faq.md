# Frequently Asked Questions

## How to connect my SignalStore(s) with Redux DevTools?

There's no official connection between `@ngrx/signals` and the Redux Devtools.
We expect the Angular Devtools will provide support for signals soon, which can be used to track the state.
However, you could create a feature for this, or you can make use of the [`withDevtools` feature](https://github.com/angular-architects/ngrx-toolkit?tab=readme-ov-file#devtools-withdevtools) from the `@angular-architects/ngrx-toolkit` package.

## Is there a way to define private methods on a SignalStore?

Currently there's no built-in support for private properties.
To achieve this in the current version, you can resort to workarounds, e.g. by not returning them.

```ts
withMethods(() => {
  function privateFunction() {
    /* implementation here */
  }
  function publicFunction() {
    /* implementation here */
  }
  function publicFunction2() {
    privateFunction();
  }

  return { publicFunction, publicFunction2 };
});
```

## Can I interact with my NgRx Actions within a SignalStore?

Signals are not meant to have a concept of time. Also, the effect is somewhat tied to Angular change detection, so you can't observe every action that would be dispatched over time through some sort of Signal API.
The global NgRx Store is still the best mechanism to dispatch action(s) over time and react to them across multiple features.

## Can I use the Redux pattern (reducers) to build my state?

Just like `@ngrx/component-store`, there is no indirection between events and how it affects the state. To update the SignalStore's state use the `patchState` function.
However, SignalStore is extensible and you can build your own custom feature that uses the Redux pattern.

## Can I define my SignalStore as a class?

To create a class-based SignalStore, create a new class and extend from `signalStore`.

```ts
@Injectable()
export class CounterStore extends signalStore(
  withState({ count: 0 })
) {
  readonly doubleCount = computed(() => this.count() * 2);

  increment(): void {
    patchState(this, { count: this.count() + 1 });
  }
}
```

## How can I get the type of a SignalStore?

To get the type of a SignalStore, use the `InstanceType` utility type.

```ts
const CounterStore = signalStore(withState({ count: 0 }));

type CounterStore = InstanceType<typeof CounterStore>;

function logCount(store: CounterStore): void {
  console.log(store.count());
}
```

## Can I inject a SignalStore via the constructor?

To inject a SignalStore via the constructor, define and export its type with the same name.

```ts
// counter.store.ts
export const CounterStore = signalStore(withState({ count: 0 }));

export type CounterStore = InstanceType<typeof CounterStore>;

// counter.component.ts
import { CounterStore } from './counter.store';

@Component({
  /* ... */
})
export class CounterComponent {
  constructor(readonly store: CounterStore) {}
}
```
