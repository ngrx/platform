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

export const OptionsStore = signalStore(
  withState({ options: [1, 2, 3] }),
  withLinkedState(({ options }) => ({
    selectedOption: () => options()[0] ?? undefined,
  }))
);

</code-example>

## Explicit Linking

The explicit notation requires users to execute `linkedSignal()` manually; however, it offers the advantage of using the more powerful version of `linkedSignal()`, which includes the `source` and `computation` options.

<code-example header="options-store.ts">

import { linkedSignal } from '@angular/core';
import { signalStore, withLinkedState, withState } from '@ngrx/signals';

export const OptionsStore = signalStore(
  withState({ options: [] as Option[] }),
  withLinkedState(({ options }) => ({
    selectedOption: linkedSignal&lt;Option[], Option&gt;({
      source: options,
      computation: (newOptions, previous) => {
        const option = newOptions.find((o) => o.id === previous?.value.id);
        return option ?? newOptions[0];
      },
    })
  }))
);

</code-example>