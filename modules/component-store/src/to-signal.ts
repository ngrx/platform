/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {
  assertInInjectionContext,
  computed,
  DestroyRef,
  inject,
  isDevMode,
  signal,
  Signal,
  untracked,
  WritableSignal,
} from '@angular/core';
import { Observable } from 'rxjs';

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
export function toSignal<T, U extends T | null | undefined>(
  // toSignal(Observable<Animal>, {initialValue: null}) -> Signal<Animal|null>
  source: Observable<T>,
  options: { initialValue: U; requireSync?: false; manualCleanup?: boolean }
): Signal<T | U>;
export function toSignal<T>(
  // toSignal(Observable<Animal>, {requireSync: true}) -> Signal<Animal>
  source: Observable<T>,
  options: { requireSync: boolean; manualCleanup?: boolean }
): Signal<T>;
// toSignal(Observable<Animal>) -> Signal<Animal|undefined>
export function toSignal<T, U = undefined>(
  source: Observable<T>,
  options?: { initialValue?: U; requireSync?: boolean; manualCleanup?: boolean }
): Signal<T | U> {
  if (!options?.manualCleanup) {
    assertInInjectionContext(toSignal);
  }

  // Note: T is the Observable value type, and U is the initial value type. They don't have to be
  // the same - the returned signal gives values of type `T`.
  let state: WritableSignal<State<T | U>>;
  if (options?.requireSync) {
    // Initially the signal is in a `NoValue` state.
    state = signal({ kind: StateKind.NoValue });
  } else {
    // If an initial value was passed, use it. Otherwise, use `undefined` as the initial value.
    state = signal<State<T | U>>({
      kind: StateKind.Value,
      value: options?.initialValue as U,
    });
  }

  const sub = source.subscribe({
    next: (value) => state.set({ kind: StateKind.Value, value }),
    error: (error) => state.set({ kind: StateKind.Error, error }),
    // Completion of the Observable is meaningless to the signal. Signals don't have a concept of
    // "complete".
  });

  if (
    isDevMode() &&
    options?.requireSync &&
    untracked(state).kind === StateKind.NoValue
  ) {
    throw new Error(
      '`@ngrx/component-store: toSignal()` called with `requireSync` but `Observable` did not emit synchronously.'
    );
  }

  if (!options?.manualCleanup) {
    // Unsubscribe when the current context is destroyed.
    inject(DestroyRef).onDestroy(sub.unsubscribe.bind(sub));
  }

  // The actual returned signal is a `computed` of the `State` signal, which maps the various states
  // to either values or errors.
  return computed(() => {
    const current = state();
    switch (current.kind) {
      case StateKind.Value:
        return current.value;
      case StateKind.Error:
        throw current.error;
      case StateKind.NoValue:
        // This shouldn't really happen because the error is thrown on creation.
        // TODO(alxhub): use a RuntimeError when we finalize the error semantics
        throw new Error(
          '@ngrx/component-store: The initial state must set before reading the signal.'
        );
    }
  });
}

const enum StateKind {
  NoValue,
  Value,
  Error,
}

interface NoValueState {
  kind: StateKind.NoValue;
}

interface ValueState<T> {
  kind: StateKind.Value;
  value: T;
}

interface ErrorState {
  kind: StateKind.Error;
  error: unknown;
}

type State<T> = NoValueState | ValueState<T> | ErrorState;
