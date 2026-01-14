import {
  assertInInjectionContext,
  DestroyRef,
  inject,
  Injector,
  isSignal,
  Signal,
  untracked,
  WritableSignal,
} from '@angular/core';

const STATE_WATCHERS = new WeakMap<object, Array<StateWatcher<any>>>();

export const STATE_SOURCE = Symbol(
  typeof ngDevMode !== 'undefined' && ngDevMode ? 'STATE_SOURCE' : ''
);

export type WritableStateSource<State extends object> = {
  [STATE_SOURCE]: { [K in keyof State]: WritableSignal<State[K]> };
};

export type StateSource<State extends object> = {
  [STATE_SOURCE]: { [K in keyof State]: Signal<State[K]> };
};

export type PartialStateUpdater<State extends object> = (
  state: State
) => Partial<State>;

export type StateWatcher<State extends object> = (
  state: NoInfer<State>
) => void;

export function isWritableSignal(
  value: unknown
): value is WritableSignal<unknown> {
  return (
    isSignal(value) &&
    'set' in value &&
    'update' in value &&
    typeof value.set === 'function' &&
    typeof value.update === 'function'
  );
}

export function isWritableStateSource<State extends object>(
  stateSource: StateSource<State>
): stateSource is WritableStateSource<State> {
  const signals: Record<string | symbol, unknown> = stateSource[STATE_SOURCE];
  return Reflect.ownKeys(stateSource[STATE_SOURCE]).every((key) => {
    return isWritableSignal(signals[key]);
  });
}

/**
 * @description
 *
 * Updates the state of a SignalStore or SignalState.
 * Accepts a sequence of partial state objects and partial state updaters.
 *
 * @usageNotes
 *
 * ```ts
 * import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
 *
 * export const CounterStore = signalStore(
 *   withState({ count1: 0, count2: 0 }),
 *   withMethods((store) => ({
 *     incrementFirst(): void {
 *       patchState(store, (state) => ({ count1: state.count1 + 1 }));
 *     },
 *     resetSecond(): void {
 *       patchState(store, { count2: 0 });
 *     },
 *   }))
 * );
 * ```
 */
export function patchState<State extends object>(
  stateSource: WritableStateSource<State>,
  ...updaters: Array<
    Partial<NoInfer<State>> | PartialStateUpdater<NoInfer<State>>
  >
): void {
  const currentState = untracked(() => getState(stateSource));
  const newState = updaters.reduce(
    (nextState: State, updater) => ({
      ...nextState,
      ...(typeof updater === 'function' ? updater(nextState) : updater),
    }),
    currentState
  );

  const signals = stateSource[STATE_SOURCE];
  const stateKeys = Reflect.ownKeys(stateSource[STATE_SOURCE]);

  for (const key of Reflect.ownKeys(newState)) {
    if (stateKeys.includes(key)) {
      const signalKey = key as keyof State;
      if (currentState[signalKey] !== newState[signalKey]) {
        signals[signalKey].set(newState[signalKey]);
      }
    } else if (typeof ngDevMode !== 'undefined' && ngDevMode) {
      console.warn(
        `@ngrx/signals: patchState was called with an unknown state slice '${String(
          key
        )}'.`,
        'Ensure that all state properties are explicitly defined in the initial state.',
        'Updates to properties not present in the initial state will be ignored.'
      );
    }
  }

  notifyWatchers(stateSource);
}

/**
 * @description
 *
 * Returns a snapshot of the current state from a SignalStore or SignalState.
 * When used within a reactive context, state changes are automatically tracked.
 *
 * @usageNotes
 *
 * ```ts
 * import { Component, effect, inject } from '@angular/core';
 * import { getState, signalStore, withState } from '@ngrx/signals';
 *
 * export const CounterStore = signalStore(
 *   withState({ count1: 0, count2: 0 })
 * );
 *
 * \@Component(...)
 * export class Counter {
 *   readonly store = inject(CounterStore);
 *
 *   constructor() {
 *     effect(() => {
 *       const state = getState(this.store);
 *       // 👇 Logs on state changes.
 *       console.log(state);
 *     });
 *   }
 * }
 * ```
 */
export function getState<State extends object>(
  stateSource: StateSource<State>
): State {
  const signals: Record<string | symbol, Signal<unknown>> = stateSource[
    STATE_SOURCE
  ];
  return Reflect.ownKeys(stateSource[STATE_SOURCE]).reduce((state, key) => {
    const value = signals[key]();
    return {
      ...state,
      [key]: value,
    };
  }, {} as State);
}

/**
 * @description
 *
 * Synchronously tracks state changes of a SignalStore or SignalState.
 *
 * @usageNotes
 *
 * ```ts
 * import { Component } from '@angular/core';
 * import { signalState, watchState } from '@ngrx/signals';
 *
 * \@Component(...)
 * export class Counter {
 *   readonly state = signalState({ count1: 0, count2: 0 });
 *
 *   constructor() {
 *     // 👇 Synchronously logs every state change without debouncing.
 *     watchState(this.state, console.log);
 *   }
 * }
 * ```
 */
export function watchState<State extends object>(
  stateSource: StateSource<State>,
  watcher: StateWatcher<State>,
  config?: { injector?: Injector }
): { destroy(): void } {
  if (typeof ngDevMode !== 'undefined' && ngDevMode && !config?.injector) {
    assertInInjectionContext(watchState);
  }

  const injector = config?.injector ?? inject(Injector);
  const destroyRef = injector.get(DestroyRef);

  addWatcher(stateSource, watcher);
  watcher(getState(stateSource));

  const destroy = () => removeWatcher(stateSource, watcher);
  destroyRef.onDestroy(destroy);

  return { destroy };
}

function getWatchers<State extends object>(
  stateSource: StateSource<State>
): Array<StateWatcher<State>> {
  return STATE_WATCHERS.get(stateSource[STATE_SOURCE]) || [];
}

function notifyWatchers<State extends object>(
  stateSource: StateSource<State>
): void {
  const watchers = getWatchers(stateSource);

  for (const watcher of watchers) {
    const state = untracked(() => getState(stateSource));
    watcher(state);
  }
}

function addWatcher<State extends object>(
  stateSource: StateSource<State>,
  watcher: StateWatcher<State>
): void {
  const watchers = getWatchers(stateSource);
  STATE_WATCHERS.set(stateSource[STATE_SOURCE], [...watchers, watcher]);
}

function removeWatcher<State extends object>(
  stateSource: StateSource<State>,
  watcher: StateWatcher<State>
): void {
  const watchers = getWatchers(stateSource);
  STATE_WATCHERS.set(
    stateSource[STATE_SOURCE],
    watchers.filter((w) => w !== watcher)
  );
}
