import { SIGNAL } from '@angular/core/primitives/signals';
import { SignalsDictionary } from './signal-store-models';
import { STATE_SIGNAL, SignalStateMeta } from './signal-state';
import { Prettify } from './ts-helpers';

export function getState<State extends Record<string, unknown>>(
  store: Prettify<SignalStateMeta<State> & SignalsDictionary>
): Record<string, unknown> {
  const state: Record<string, unknown> = store[STATE_SIGNAL]();

  return Object.keys(store).reduce((acc, key) => {
    // Ignore values already existing from the initial state
    if (key in state) {
      return acc;
    }

    const value = store[key];
    if (SIGNAL in value) {
      acc[key] = value();
    }

    return acc;
  }, state);
}
