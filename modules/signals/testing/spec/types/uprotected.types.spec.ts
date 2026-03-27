import {
  computed,
  inject,
  type Signal,
  type WritableSignal,
} from '@angular/core';
import { signalStore, withState, withComputed } from '@ngrx/signals';
import { unprotected } from '@ngrx/signals/testing';
import { describe, expect, it } from 'tstyche';
import { STATE_SOURCE } from 'modules/signals/src/state-source.js';

describe('unprotected', () => {
  it('replaces StateSource with WritableStateSource', () => {
    const CounterStore = signalStore(
      withState({ count: 0 }),
      withComputed(({ count }) => ({
        doubleCount: computed(() => count() * 2),
      }))
    );

    const store = inject(CounterStore);

    expect(unprotected(store)).type.toBe<{
      count: Signal<number>;
      doubleCount: Signal<number>;
      [STATE_SOURCE]: { count: WritableSignal<number> };
    }>();
  });

  it('does not affect the store with an unprotected state', () => {
    const CounterStore = signalStore(
      { protectedState: false },
      withState({ count: 0 })
    );

    const store = inject(CounterStore);

    expect(unprotected(store)).type.toBe<{
      count: Signal<number>;
      [STATE_SOURCE]: { count: WritableSignal<number> };
    }>();
  });
});
