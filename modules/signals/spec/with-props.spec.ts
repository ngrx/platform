import { signal } from '@angular/core';
import { of } from 'rxjs';
import { withMethods, withProps, withState } from '../src';
import { getInitialInnerStore } from '../src/signal-store';

describe('withProps', () => {
  it('adds properties to the store immutably', () => {
    const initialStore = getInitialInnerStore();

    const p1 = 1;
    const p2 = 2;

    const store = withProps(() => ({ p1, p2 }))(initialStore);

    expect(Object.keys(store.props)).toEqual(['p1', 'p2']);
    expect(Object.keys(initialStore.props)).toEqual([]);

    expect(store.props.p1).toBe(1);
    expect(store.props.p2).toBe(2);
  });

  it('logs warning if previously defined signal store members have the same name', () => {
    const initialStore = [
      withState({
        s1: 10,
        s2: 's2',
      }),
      withProps(({ s1 }) => ({
        p1: of(100),
        p2: 10,
      })),
      withMethods(() => ({
        m1() {},
        m2() {},
      })),
    ].reduce((acc, feature) => feature(acc), getInitialInnerStore());
    const p2 = 100;
    jest.spyOn(console, 'warn').mockImplementation();

    withProps(() => ({
      s1: { foo: 'bar' },
      p: 10,
      p2: signal(100),
      m1: { ngrx: 'rocks' },
      m3: of('m3'),
    }))(initialStore);

    expect(console.warn).toHaveBeenCalledWith(
      '@ngrx/signals: SignalStore members cannot be overridden.',
      'Trying to override:',
      's1, p2, m1'
    );
  });
});
