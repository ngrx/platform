import { computed, signal, Signal } from '@angular/core';

import { StateObservable } from './state';

/**
 * Get the current value of an `StateObservable` as a reactive `Signal`.
 *
 * `toSignal` returns a `Signal` which provides synchronous reactive access to values produced
 * by the `StateObservable`, by subscribing to that `StateObservable`. The returned `Signal` will always
 * have the most recent value emitted by the subscription, and will throw an error if the
 * `StateObservable` errors.
 *
 * The subscription will last for the lifetime of the application itself.
 *
 * This function is for internal use only as it differs from the `toSignal`
 * provided by the `@angular/core/rxjs-interop` package with relying on
 * the injection context to unsubscribe from the provided observable.
 *
 */
export function toSignal<T>(state$: StateObservable): Signal<T> {
  const state = signal<State<T>>({ kind: StateKind.NoValue });

  state$.subscribe({
    next: (value) => state.set({ kind: StateKind.Value, value }),
    error: (error) => state.set({ kind: StateKind.Error, error }),
  });

  return computed(() => {
    const currentState = state();

    switch (currentState.kind) {
      case StateKind.Value:
        return currentState.value;
      case StateKind.Error:
        throw currentState.error;
      case StateKind.NoValue:
        throw new Error(
          '@ngrx/store: The state observable must emit the initial value synchronously'
        );
    }
  });
}

enum StateKind {
  NoValue,
  Value,
  Error,
}

type NoValueState = { kind: StateKind.NoValue };
type ValueState<T> = { kind: StateKind.Value; value: T };
type ErrorState = { kind: StateKind.Error; error: unknown };

type State<T> = NoValueState | ValueState<T> | ErrorState;
