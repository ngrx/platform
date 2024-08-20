import { computed, signal } from '@angular/core';
import {
  type Prettify,
  type StateSignals,
  withComputed,
  withMethods,
  withState,
} from '../src';
import { getInitialInnerStore } from '../src/signal-store';

describe('withComputed', () => {
  it('adds computed signals to the store immutably', () => {
    const initialStore = getInitialInnerStore();

    const s1 = signal('s1').asReadonly();
    const s2 = signal(10).asReadonly();

    const store = withComputed(() => ({ s1, s2 }))(initialStore);

    expect(Object.keys(store.computedSignals)).toEqual(['s1', 's2']);
    expect(Object.keys(initialStore.computedSignals)).toEqual([]);

    expect(store.computedSignals.s1).toBe(s1);
    expect(store.computedSignals.s2).toBe(s2);
  });

  it('logs warning if previously defined signal store members have the same name', () => {
    const initialStore = [
      withState({
        p1: 10,
        p2: 'p2',
      }),
      withComputed(() => ({
        s1: signal('s1').asReadonly(),
        s2: signal({ s: 2 }).asReadonly(),
      })),
      withMethods(() => ({
        m1() {},
        m2() {},
      })),
    ].reduce((acc, feature) => feature(acc), getInitialInnerStore());
    const s2 = signal(10).asReadonly();
    jest.spyOn(console, 'warn').mockImplementation();

    withComputed(() => ({
      p: signal(0).asReadonly(),
      p1: signal('p1').asReadonly(),
      s2,
      m1: signal({ m: 1 }).asReadonly(),
      m3: signal({ m: 3 }).asReadonly(),
      s3: signal({ s: 3 }).asReadonly(),
    }))(initialStore);

    expect(console.warn).toHaveBeenCalledWith(
      '@ngrx/signals: SignalStore members cannot be overridden.',
      'Trying to override:',
      'p1, s2, m1'
    );
  });

  it('allow to use methods', () => {
    const initialStore = [
      withState({
        p1: 1,
        p2: 2,
      }),
      withMethods(() => ({
        m1: Object.assign(() => {}, { multiplier: 3 }),
      })),
    ].reduce((acc, feature) => feature(acc), getInitialInnerStore());

    const store = withComputed((store) => {
      const { p1, p2, m1 } = store as unknown as Prettify<
        StateSignals<{ p1: number; p2: number }> & {
          m1: (() => undefined) & { multiplier: number };
        }
      >;

      return {
        c1: computed<number>(() => p1() * m1.multiplier),
        c2: computed<number>(() => p2() * m1.multiplier),
      };
    })(initialStore);

    expect(store.computedSignals.c1()).toBe(3);
    expect(store.computedSignals.c2()).toBe(6);
  });
});
