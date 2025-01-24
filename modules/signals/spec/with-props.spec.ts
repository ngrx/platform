import { signal } from '@angular/core';
import { of } from 'rxjs';
import { withMethods, withProps, withState } from '../src';
import { getInitialInnerStore } from '../src/signal-store';

describe('withProps', () => {
  it('adds properties to the store immutably', () => {
    const initialStore = getInitialInnerStore();

    const store = withProps(() => ({ p1: 1, p2: 2 }))(initialStore);

    expect(Object.keys(store.props)).toEqual(['p1', 'p2']);
    expect(Object.keys(initialStore.props)).toEqual([]);

    expect(store.props.p1).toBe(1);
    expect(store.props.p2).toBe(2);
  });

  it('logs warning if previously defined signal store members have the same name', () => {
    const STATE_SECRET = Symbol('state_secret');
    const METHOD_SECRET = Symbol('method_secret');
    const initialStore = [
      withState({
        s1: 10,
        s2: 's2',
        [STATE_SECRET]: 1,
      }),
      withProps(() => ({
        p1: of(100),
        p2: 10,
      })),
      withMethods(() => ({
        m1() {},
        m2() {},
        [METHOD_SECRET]() {},
      })),
    ].reduce((acc, feature) => feature(acc), getInitialInnerStore());
    vi.spyOn(console, 'warn').mockImplementation();

    withProps(() => ({
      s1: { foo: 'bar' },
      p: 10,
      p2: signal(100),
      m1: { ngrx: 'rocks' },
      m3: of('m3'),
      [STATE_SECRET]: 10,
      [METHOD_SECRET]: { x: 'y' },
    }))(initialStore);

    expect(console.warn).toHaveBeenCalledWith(
      '@ngrx/signals: SignalStore members cannot be overridden.',
      'Trying to override:',
      's1, p2, m1, Symbol(state_secret), Symbol(method_secret)'
    );
  });
});
