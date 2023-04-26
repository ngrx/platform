import { computed, signal, Signal } from '@angular/core';
import { Observable, takeUntil } from 'rxjs';

/**
 * Get the current value of an `State` as a reactive `Signal`.
 *
 * `toSignal` returns a `Signal` which provides synchronous reactive access to values produced
 * by the `State`, by subscribing to that `State`. The returned `Signal` will always
 * have the most recent value emitted by the subscription, and will throw an error if the
 * `State` errors.
 *
 * The subscription will last for the lifetime of the application itself.
 *
 * This function is for internal use only as it differs from the `toSignal`
 * provided by the `@angular/core/rxjs-interop` package with relying on
 * the injection context to unsubscribe from the provided observable.
 *
 */
export function toSignal<T>(
  state$: Observable<T>,
  destroy$: Observable<void>
): Signal<T> {
  const state = signal<State<T>>({ kind: StateKind.NoValue });

  state$.pipe(takeUntil(destroy$)).subscribe({
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
          '@ngrx/component-store: The initial state must set before reading the signal'
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
