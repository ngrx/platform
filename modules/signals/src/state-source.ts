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

export const STATE_SOURCE = Symbol('STATE_SOURCE');

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
