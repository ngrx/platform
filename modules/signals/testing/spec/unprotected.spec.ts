import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { patchState, signalStore, StateSource, withState } from '@ngrx/signals';
import { STATE_SOURCE } from '../../src/state-source';
import { unprotected } from '../src';

describe('unprotected', () => {
  it('returns writable state source', () => {
    const CounterStore = signalStore(
      { providedIn: 'root' },
      withState({ count: 0 })
    );

    const counterStore = TestBed.inject(CounterStore);
    patchState(unprotected(counterStore), { count: 1 });

    expect(counterStore.count()).toBe(1);
  });

  it('throws error when provided state source is not writable', () => {
    const readonlySource: StateSource<{ count: number }> = {
      [STATE_SOURCE]: { count: signal(0).asReadonly() },
    };

    expect(() => unprotected(readonlySource)).toThrowError(
      '@ngrx/signals: The provided source is not writable.'
    );
  });
});
