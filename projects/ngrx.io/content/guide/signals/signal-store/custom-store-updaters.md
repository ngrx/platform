# Custom Store Updaters

NgRx SignalStore supports the creation of custom state updaters to streamline and modularize state management logic. Custom updaters are particularly useful when the same or similar state updates need to be applied across different components or features.

## Creating Custom Updaters

Custom state updaters are pure functions that accept the current state and return a partial state object. These can then be applied using the `patchState` function.

Here's a basic example of custom state updaters:

<code-example header="counter.feature.ts">

export interface CounterState {
  count: number;
}

export const increment = () => (state: CounterState) => ({
  count: state.count + 1,
});у

export const decrement = () => (state: CounterState) => ({
  count: state.count - 1,
});

export const reset = () => ({ count: 0 });

export const setCountTo = (value: number) => (state: CounterState) => ({
  count: value,
});

export function withCounter() {
  return withState({
    count: 0,
  });
}

</code-example>


<code-example header="counter.store.ts">

import { signalStore, withState } from '@ngrx/signals';

export const CounterStore = signalStore(
  { protectedState: false },
  withCounter(),
);

</code-example>

<code-example header="component.ts">

import { Component, inject } from '@angular/core';
import { patchState } from '@ngrx/signals';
import { CounterStore } from './counter.store';
import { increment, decrement, reset } from './counter.updaters';

@Component({
  selector: 'app-counter',
  template: `
    <button (click)="onIncrement()">Increment</button>
    <button (click)="onDecrement()">Decrement</button>
    <button (click)="onReset()">Reset</button>
    <button (click)="onResetToTen()">Reset to 10</button>
  `,
  providers: [CounterStore]
})
export class CounterComponent {
  readonly store = inject(CounterStore);

  onIncrement() {
    patchState(this.store, increment());
  }

  onDecrement() {
    patchState(this.store, decrement());
  }

  onReset() {
    patchState(this.store, reset());
  }

  onResetToTen() {
    patchState(this.store, setCountTo(10));
  }
}

</code-example>

## Merging Multiple Updaters

The `mergeUpdaters` utility helps when creating custom updaters based on the combination of other updaters. It is used during the definition of new reusable updaters.

<code-example header="counter.feature.ts">

import { mergeUpdaters } from './utils';
import { increment, reset, setCountTo } from './base-updaters';

export const resetAndIncrement = () => mergeUpdaters(reset(), increment());

export const setAndIncrement = (value: number) =>
  mergeUpdaters(setCountTo(value), increment());

// ...

</code-example>

These new updaters can now be reused wherever needed:

<code-example header="component.ts">

import { Component, inject } from '@angular/core';
import { patchState } from '@ngrx/signals';
import { CounterStore } from './counter.store';
import { resetAndIncrement } from './counter.updaters';

@Component({
  selector: 'app-counter-combined',
  template: `
    <button (click)="onResetAndIncrement()">Reset and Increment</button>
    <button (click)="onSetAndIncrement(100)">Set to 100 and Increment</button>
  `,
  providers: [CounterStore]
})
export class CounterCombinedComponent {
  readonly store = inject(CounterStore);

  onResetAndIncrement() {
    patchState(this.store, resetAndIncrement());
  }

  onSetAndIncrement(value: number) {
    patchState(this.store, setAndIncrement(value));
  }
}

</code-example>

## Benefits of Custom and Merged Updaters

* **Reusability**: Define common state transformations once and reuse them across multiple stores or components.
* **Maintainability**: Centralize update logic, making it easier to manage and update as the application grows.
* **Readability**: Clearly express complex state transformations through composed updaters, enhancing the readability of your code.

## Best Practices

To ensure consistency across your codebase, we recommend defining **all** updaters — even those without arguments — as factory functions. This pattern simplifies usage, promotes uniformity, and prepares your code for future extensions where arguments might be required.

* Prefer standalone updater functions to methods within store definitions for better tree-shaking and easier testing.
* Use `mergeUpdaters` to encapsulate composition logic at the definition level, not inside store methods.
* Avoid using `mergeUpdaters` inline in `patchState`, to keep business logic declarative and consistent.
