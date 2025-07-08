# Linked State

The `withLinkedState` feature enables the creation of state slices that depend on other parts of the state. It supports both implicit and explicit linking.

In the context of the SignalStore, `withLinkedState()` serves as the equivalent to Angular's `linkedSignal()`.

Linked state can be added to the store using the `withLinkedState()` feature. This feature accepts a factory function as an input argument, which is executed within the injection context. The factory should return a dictionary containing:
- Functions that return values, which the SignalStore wraps automatically into a `linkedSignal()`, or
- `WritableSignal`, which the user can create with `linkedSignal()`.

## Implicit Linking

The following example shows the implicit notation, where a function returns a value. That function is wrapped into a `linkedSignal()`, which means it is tracked, and if one of the tracked Signals changes, the function is re-executed synchronously.

<code-example header="options-store.ts">

import { signalStore, withLinkedState, withState } from '@ngrx/signals';

const BookStore = signalStore(
  withState({
    options: [1, 2, 3],
    selectedIx: 0,
  }),
  withLinkedState(({ options, selectedIx }) => ({
    selectedOption: () => options()[selectedIx()] ?? 0,
  }))
);

</code-example>

## Explicit Linking

For the explicit notation, users need to execute `linkedSignal()` manually, but they have the advantage of using the more powerful version of `linkedSignal()`, which comes with `source` and `computation` options.

<code-example header="options-store.ts">

import { signalStore, linkedSignal } from '@ngrx/signals';

const BookStore = signalStore(
  withState({
    options: [1, 2, 3],
    selectedIx: undefined as number | undefined,
  }),
  withLinkedState(({ options, selectedIx }) => ({
    safeSelectedOption: linkedSignal({
      source: selectedIx,
      computation: (sel, previous) => {
        const ix = selectedIx();
        if (ix === undefined) {
          return previous;
        }
        return options()[ix];
      },
    }),
  }))
);

</code-example>

### Mixed Linking

Both implicit and explicit linking can be used together as well.

<code-example header="book-store.ts">

import { signalStore, linkedSignal, withLinkedState } from '@ngrx/signals';

const BookStore = signalStore(
  withState({
    options: [1, 2, 3],
    selectedIx: undefined as number | undefined,
  }),
  withLinkedState(({ options, selectedIx }) => ({
    selectedOption: () => {
      const ix = selectedIx();
      if (ix === undefined) {
        return undefined;
      }
      return options()[ix];
    },
    safeSelectedOption: linkedSignal({
      source: selectedIx,
      computation: (sel, previous) => {
        const ix = selectedIx();
        if (ix === undefined) {
          return previous;
        }
        return options()[ix];
      },
    }),
  }))
);

</code-example>