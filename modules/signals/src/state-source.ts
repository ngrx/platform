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

declare const ngDevMode: unknown;

const STATE_WATCHERS = new WeakMap<object, Array<StateWatcher<any>>>();

/**
 * Symbol used to access the state source in signal stores.
 *
 * @public
 */
export const STATE_SOURCE = Symbol('STATE_SOURCE');

/**
 * A state source with writable signals for all state properties.
 *
 * @public
 */
export type WritableStateSource<State extends object> = {
  [STATE_SOURCE]: { [K in keyof State]: WritableSignal<State[K]> };
};

/**
 * A state source with read-only signals for all state properties.
 *
 * @public
 */
export type StateSource<State extends object> = {
  [STATE_SOURCE]: { [K in keyof State]: Signal<State[K]> };
};

/**
 * A function that takes a state and returns a partial state update.
 *
 * @public
 */
export type PartialStateUpdater<State extends object> = (
  state: State
) => Partial<State>;

/**
 * A function that watches state changes.
 *
 * @public
 */
export type StateWatcher<State extends object> = (
  state: NoInfer<State>
) => void;

/**
 * Checks if a value is a writable signal.
 *
 * @param value - The value to check.
 * @returns True if the value is a writable signal.
 *
 * @public
 */
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

/**
 * Checks if a state source has writable signals for all its state properties.
 *
 * @param stateSource - The state source to check.
 * @returns True if all state properties are writable.
 *
 * @public
 */
export function isWritableStateSource<State extends object>(
  stateSource: StateSource<State>
): stateSource is WritableStateSource<State> {
  const signals: Record<string | symbol, unknown> = stateSource[STATE_SOURCE];
  return Reflect.ownKeys(stateSource[STATE_SOURCE]).every((key) => {
    return isWritableSignal(signals[key]);
  });
}

/**
 * Updates the state source with the provided partial state updates.
 *
 * @param stateSource - The writable state source to update.
 * @param updaters - One or more partial state updates or updater functions.
 *
 * @public
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
 * Gets the current state value from a state source.
 *
 * @param stateSource - The state source to read from.
 * @returns The current state value.
 *
 * @public
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
 * Watches state changes and calls the watcher function when the state changes.
 *
 * @param stateSource - The state source to watch.
 * @param watcher - The function to call when state changes.
 * @param config - Optional configuration with injector.
 * @returns An object with a destroy method to stop watching.
 *
 * @public
 */
export function watchState<State extends object>(
  stateSource: StateSource<State>,
  watcher: StateWatcher<State>,
  config?: { injector?: Injector }
): { destroy(): void } {
  if (!config?.injector) {
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
