import { signal } from '@angular/core';
import { of } from 'rxjs';
import { signalStore, withMethods, withProps, withState } from '../src';
import { getInitialInnerStore } from '../src/signal-store';
import { TestBed } from '@angular/core/testing';

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
    const initialStore = [
      withState({
        s1: 10,
        s2: 's2',
      }),
      withProps(() => ({
        p1: of(100),
        p2: 10,
      })),
      withMethods(() => ({
        m1() {},
        m2() {},
      })),
    ].reduce((acc, feature) => feature(acc), getInitialInnerStore());
    vi.spyOn(console, 'warn').mockImplementation();

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

  it('allows symbols as props', () => {
    const SECRET = Symbol('SECRET');

    const Store = signalStore(withProps(() => ({ [SECRET]: 'secret' })));
    const store = TestBed.configureTestingModule({ providers: [Store] }).inject(
      Store
    );

    expect(store[SECRET]).toBe('secret');
  });
});
