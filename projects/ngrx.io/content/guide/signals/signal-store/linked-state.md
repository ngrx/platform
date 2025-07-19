# Linked State

The `withLinkedState` feature enables the creation of state slices that depend on other signals.
This feature accepts a factory function as an input argument, which is executed within the injection context.
The factory should return a dictionary containing linked state slices, defined as either computation functions or `WritableSignal` instances.
These linked state slices become an integral part of the SignalStore's state and are treated the same as regular state slices - `DeepSignal`s are created for each of them, and they can be updated using `patchState`.

## Implicit Linking

When a computation function is provided, the SignalStore wraps it in a `linkedSignal()`.
As a result, the linked state slice is updated automatically whenever any of its dependent signals change.

<code-tabs linenums="true">
<code-pane header="options-store.ts">

import { patchState, signalStore, withLinkedState, withState } from '@ngrx/signals';

export const OptionsStore = signalStore(
  withState({ options: [1, 2, 3] }),
  withLinkedState(({ options }) => ({
    // 👇 Defining a linked state slice.
    selectedOption: () => options()[0] ?? undefined,
  })),
  withMethods((store) => ({
    setOptions(options: number[]): void {
      patchState(store, { options });
    },
    setSelectedOption(selectedOption: number): void {
      // 👇 Updating a linked state slice.
      patchState(store, { selectedOption });
    },
  }),
);

</code-pane>

<code-pane header="option-list.ts">

@Component({
  // ... other metadata
  providers: [OptionsStore],
})
export class OptionList {
  readonly store = inject(OptionsStore);

  constructor() {
    console.log(this.store.selectedOption()); // logs: 1

    this.store.setSelectedOption(2);
    console.log(this.store.selectedOption()); // logs: 2

    this.store.setOptions([4, 5, 6]);
    console.log(this.store.selectedOption()); // logs: 4
  }
}

</code-pane>
</code-tabs>

## Explicit Linking

The `withLinkedState` feature also supports providing `WritableSignal` instances as linked state slices.
This can include signals created using `linkedSignal()` with `source` and `computation` options, as well as any other `WritableSignal` instances.
In both cases, the SignalStore and the original signal remain fully synchronized - updating one immediately reflects in the other.

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
    }),
  }))
);

</code-example>
