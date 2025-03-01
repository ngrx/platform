import {
  assertInInjectionContext,
  DestroyRef,
  inject,
  Injector,
  Signal,
  untracked,
  WritableSignal,
} from '@angular/core';
import { Prettify } from './ts-helpers';

const STATE_WATCHERS = new WeakMap<Signal<object>, Array<StateWatcher<any>>>();

export const STATE_SOURCE = Symbol('STATE_SOURCE');

export type WritableStateSource<State extends object> = {
  readonly [STATE_SOURCE]: WritableSignal<State>;
};

export type StateSource<State extends object> = {
  readonly [STATE_SOURCE]: Signal<State>;
};

export type PartialStateUpdater<State extends object> = (
  state: State
) => Partial<State>;

export type StateWatcher<State extends object> = (
  state: NoInfer<State>
) => void;

export function patchState<State extends object>(
  stateSource: WritableStateSource<State>,
  ...updaters: Array<
    Partial<Prettify<State>> | PartialStateUpdater<Prettify<State>>
  >
): void {
  stateSource[STATE_SOURCE].update((currentState) =>
    updaters.reduce(
      (nextState: State, updater) => ({
        ...nextState,
        ...(typeof updater === 'function' ? updater(nextState) : updater),
      }),
      currentState
    )
  );

  notifyWatchers(stateSource);
}

export function getState<State extends object>(
  stateSource: StateSource<State>
): State {
  return stateSource[STATE_SOURCE]();
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
